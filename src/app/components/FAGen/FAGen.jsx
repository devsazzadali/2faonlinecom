"use client"

import React, { useState, useEffect } from 'react';
import { authenticator } from 'otplib'; 
import { HiEye, HiEyeOff, HiTrash, HiPlus, HiDuplicate } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const FAGen = ({ onAccountDeleted }) => {
  const [accounts, setAccounts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isMounted, setIsMounted] = useState(false);

  // ১. মাউন্ট এবং রিস্টোর ইভেন্ট লিসেনার
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('2fa_accounts_v1');
    if (saved) {
      setAccounts(JSON.parse(saved));
    } else {
      setAccounts([{ id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]);
    }

    // App.js থেকে আসা রিস্টোর সিগন্যাল ধরা
    const handleRestore = (event) => {
      const restored = event.detail;
      setAccounts(prev => [...prev, {
        ...restored,
        id: Date.now(), // নতুন আইডি জেনারেট করা
        code: '------',
        active: false,
        showSecret: false
      }]);
    };

    window.addEventListener('restoreAccount', handleRestore);
    return () => window.removeEventListener('restoreAccount', handleRestore);
  }, []);

  // ২. লোকাল স্টোরেজে সেভ
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('2fa_accounts_v1', JSON.stringify(accounts));
    }
  }, [accounts, isMounted]);

  // ৩. কোড জেনারেটর ইঞ্জিন
  useEffect(() => {
    if (!isMounted) return;
    const updateCodes = () => {
      const now = Math.floor(Date.now() / 1000);
      setTimeLeft(30 - (now % 30));

      setAccounts(prevAccounts => {
        return prevAccounts.map(acc => {
          const secret = acc.secret.replace(/\s+/g, '').toUpperCase();
          let newToken = '------';
          let isActive = false;
          if (secret.length >= 16) {
            try {
              newToken = authenticator.generate(secret);
              isActive = true;
            } catch (e) { newToken = 'ERROR'; }
          }
          return { ...acc, code: newToken, active: isActive };
        });
      });
    };
    updateCodes();
    const interval = setInterval(updateCodes, 1000);
    return () => clearInterval(interval);
  }, [isMounted]);

  const addAccount = () => {
    setAccounts([...accounts, { id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]);
  };

  if (!isMounted) return null;

  return (
    /* ডার্ক মোড ফিক্স করতে এখান থেকে bg-white এবং min-h-screen সরানো হয়েছে */
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <AnimatePresence mode='popLayout'>
            {accounts.map((acc) => (
              <motion.div 
                key={acc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-5">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-2 block">Account Name</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="e.g. Google / GitHub"
                    value={acc.name}
                    onChange={(e) => setAccounts(accounts.map(a => a.id === acc.id ? { ...a, name: e.target.value } : a))}
                  />
                </div>

                <div className="mb-6">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-2 block">Secret Key</label>
                  <div className="relative">
                    <input
                      className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm font-mono tracking-tight focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      type={acc.showSecret ? "text" : "password"}
                      placeholder="Paste secret key..."
                      value={acc.secret}
                      onChange={(e) => setAccounts(accounts.map(a => a.id === acc.id ? { ...a, secret: e.target.value } : a))}
                    />
                    <button 
                      type="button" 
                      onClick={() => setAccounts(accounts.map(a => a.id === acc.id ? { ...a, showSecret: !a.showSecret } : a))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      {acc.showSecret ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-2xl p-8 mb-6 text-center">
                  <motion.div 
                    key={acc.code}
                    initial={{ opacity: 0.5, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-5xl font-black tracking-[6px] transition-colors duration-300 ${acc.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-zinc-800'}`}
                  >
                    {acc.code}
                  </motion.div>
                </div>

                {/* ডিলিট বাটন - এখন হিস্ট্রিতে ডাটা পাঠাবে */}
                <button 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-[11px] font-bold transition-colors"
                  onClick={() => {
                    // ডিলিট করার আগে App.js-এ ডাটা পাঠানো
                    if(acc.secret) onAccountDeleted(acc); 
                    
                    const filtered = accounts.filter(a => a.id !== acc.id);
                    setAccounts(filtered.length > 0 ? filtered : [{ id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]);
                  }}
                >
                  <HiTrash size={16} /> REMOVE ACCOUNT
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex flex-col items-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addAccount}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black shadow-xl"
          >
            <HiPlus size={24} /> ADD NEW ACCOUNT
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FAGen;