"use client"

import React, { useState, useEffect } from 'react';
import { authenticator } from 'otplib'; 
import { HiEye, HiEyeOff, HiTrash, HiPlus } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const FAGen = ({ onAccountDeleted }) => {
  const [accounts, setAccounts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // ১. মাউন্ট এবং ডাটা লোড
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('2fa_accounts_v1');
    if (saved) {
      setAccounts(JSON.parse(saved));
    } else {
      setAccounts([{ id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]);
    }

    const handleRestore = (event) => {
      const restored = event.detail;
      setAccounts(prev => [...prev, {
        ...restored,
        id: Date.now(), 
        code: '------',
        active: false,
        showSecret: false
      }]);
    };

    window.addEventListener('restoreAccount', handleRestore);
    return () => window.removeEventListener('restoreAccount', handleRestore);
  }, []);

  // ২. লোকাল স্টোরেজে সেভ (শুধুমাত্র মাউন্ট হওয়ার পর)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('2fa_accounts_v1', JSON.stringify(accounts));
    }
  }, [accounts, isMounted]);

  // ৩. কোড জেনারেটর ইঞ্জিন (Optimized)
  useEffect(() => {
    if (!isMounted) return;

    const updateCodes = () => {
      setAccounts(prevAccounts => 
        prevAccounts.map(acc => {
          if (!acc.secret) return { ...acc, code: '------', active: false };
          
          const secret = acc.secret.replace(/\s+/g, '').toUpperCase();
          try {
            if (secret.length >= 16) {
              return { ...acc, code: authenticator.generate(secret), active: true };
            }
          } catch (e) {
            return { ...acc, code: 'ERROR', active: false };
          }
          return { ...acc, code: '------', active: false };
        })
      );
    };

    const interval = setInterval(updateCodes, 1000);
    return () => clearInterval(interval);
  }, [isMounted]);

  // ৪. ডিলিট লজিক (Fixed)
  const handleDelete = (id) => {
    const accountToDelete = accounts.find(a => a.id === id);
    
    // যদি একাউন্টে সিক্রেট থাকে তবেই হিস্ট্রিতে পাঠাবে
    if (accountToDelete && accountToDelete.secret && onAccountDeleted) {
      onAccountDeleted(accountToDelete);
    }

    const filtered = accounts.filter(a => a.id !== id);
    
    // যদি সব ডিলিট হয়ে যায়, তবে একটি খালি ফর্ম দেখাবে
    if (filtered.length === 0) {
      setAccounts([{ id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]);
    } else {
      setAccounts(filtered);
    }
  };

  const addAccount = () => {
    setAccounts([...accounts, { id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]);
  };

  if (!isMounted) return null;

  return (
    <div className="py-12 w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
          <AnimatePresence mode='popLayout'>
            {accounts.map((acc) => (
              <motion.div 
                key={acc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-2 block">Account Name</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      placeholder="e.g. Google / GitHub"
                      value={acc.name}
                      onChange={(e) => setAccounts(accounts.map(a => a.id === acc.id ? { ...a, name: e.target.value } : a))}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-2 block">Secret Key</label>
                    <div className="relative">
                      <input
                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm font-mono tracking-tight focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        type={acc.showSecret ? "text" : "password"}
                        placeholder="Paste secret key..."
                        value={acc.secret}
                        onChange={(e) => setAccounts(accounts.map(a => a.id === acc.id ? { ...a, secret: e.target.value } : a))}
                      />
                      <button 
                        type="button" 
                        onClick={() => setAccounts(accounts.map(a => a.id === acc.id ? { ...a, showSecret: !a.showSecret } : a))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                      >
                        {acc.showSecret ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800/50 rounded-2xl p-8 mb-6 text-center">
                    <div className={`text-5xl font-mono font-black tracking-[4px] transition-colors duration-300 ${acc.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-200 dark:text-zinc-800'}`}>
                      {acc.code}
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-[11px] font-bold transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/20"
                  onClick={() => handleDelete(acc.id)}
                >
                  <HiTrash size={16} /> REMOVE ACCOUNT
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addAccount}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <HiPlus size={20} /> ADD NEW ACCOUNT
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FAGen;