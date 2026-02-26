"use client"
import React, { useState, useEffect, useRef } from 'react';
import { authenticator } from 'otplib'; 
import { HiEye, HiEyeOff, HiTrash, HiPlus } from 'react-icons/hi';
import { MdContentCopy, MdCheck } from 'react-icons/md';
import { LuClock3 } from 'react-icons/lu'; 
import { motion, AnimatePresence } from 'framer-motion';

const FAGen = ({ onAccountDeleted }) => {
  const [accounts, setAccounts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [seconds, setSeconds] = useState(30); 
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ show: false, name: '' });
  
  const lastHistoryState = useRef({});

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('2fa_accounts_v1');
    if (saved) setAccounts(JSON.parse(saved));
    else setAccounts([{ id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]);
  }, []);

  useEffect(() => {
    const handleRestore = (event) => {
      const restoredItem = event.detail;
      if (restoredItem) {
        setAccounts(prev => {
          const exists = prev.find(a => a.secret === restoredItem.secret);
          if (exists) return prev;
          const newAcc = { id: Date.now(), name: restoredItem.name, secret: restoredItem.secret, code: '------', active: true, showSecret: false };
          return [newAcc, ...prev];
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('restoreAccount', handleRestore);
    return () => window.removeEventListener('restoreAccount', handleRestore);
  }, []);

  useEffect(() => {
    if (isMounted) localStorage.setItem('2fa_accounts_v1', JSON.stringify(accounts));
  }, [accounts, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      const epoch = Math.round(new Date().getTime() / 1000);
      setSeconds(30 - (epoch % 30));

      setAccounts(prevAccounts => 
        prevAccounts.map(acc => {
          const cleanSecret = acc.secret.replace(/\s+/g, '');
          if (cleanSecret.length >= 8) {
            try {
              const newCode = authenticator.generate(cleanSecret.toUpperCase());
              return { ...acc, code: newCode, active: true };
            } catch (e) { return { ...acc, code: 'INVALID', active: false }; }
          }
          return { ...acc, code: '------', active: false };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [isMounted]);

  useEffect(() => {
    accounts.forEach(acc => {
      const currentCode = acc.code;
      const cleanSecret = acc.secret.trim();
      if (acc.active && currentCode !== '------' && currentCode !== 'INVALID') {
        if (lastHistoryState.current[cleanSecret] !== currentCode) {
          onAccountDeleted?.({ 
            name: acc.name || 'Untitled', 
            secret: acc.secret, 
            code: currentCode, 
            deletedAt: Date.now()
          });
          lastHistoryState.current[cleanSecret] = currentCode;
        }
      }
    });
  }, [accounts, onAccountDeleted]);

  const handleDelete = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const handleCopy = (code, id, name) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setToast({ show: true, name: name || 'Account' });
    setTimeout(() => { setCopiedId(null); setToast({ show: false, name: '' }); }, 3000);
  };

  if (!isMounted) return null;
  const hasActiveCode = accounts.some(acc => acc.active && acc.code !== '------');

  return (
    <div className="py-6 w-full max-w-4xl mx-auto relative font-sans text-left px-3">
      {/* মোবাইলে ২ কলাম এবং ডেস্কটপে মিডিয়াম সাইজ ২ কলাম */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <AnimatePresence mode='popLayout'>
          {accounts.map((acc) => (
            <motion.div key={acc.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} 
              className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-[#232326] rounded-[22px] p-3.5 sm:p-5 shadow-lg"
            >
              <div className="mb-3">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-[#4a4a4e] uppercase tracking-wider block mb-1">Account</label>
                <input className="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-[#2d2d30] rounded-xl px-3 py-1.5 sm:py-2 text-[12px] sm:text-[14px] text-slate-900 dark:text-white outline-none" value={acc.name} placeholder="Name" onChange={(e) => setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, name: e.target.value } : a))} />
              </div>

              <div className="mb-3">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-[#4a4a4e] uppercase tracking-wider block mb-1">Secret</label>
                <div className="relative">
                  <input className="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-[#2d2d30] rounded-xl px-3 py-1.5 sm:py-2 pr-9 font-mono text-[11px] sm:text-[13px] text-slate-900 dark:text-white outline-none" type={acc.showSecret ? "text" : "password"} value={acc.secret} placeholder="Key" onChange={(e) => setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, secret: e.target.value } : a))} />
                  <button onClick={() => setAccounts(prev => prev.map(a => a.id === acc.id ? { ...a, showSecret: !a.showSecret } : a))} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {acc.showSecret ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0c0c0e] rounded-[16px] py-4 sm:py-7 mb-3 text-center border border-slate-100 dark:border-[#1c1c1f]">
                <div className={`text-[22px] sm:text-[34px] font-black tracking-[2px] sm:tracking-[3px] mb-1 sm:mb-2 ${acc.active ? 'text-blue-600 dark:text-[#60a5fa]' : 'text-slate-300 dark:text-[#232326]'}`}>{acc.code}</div>
                {acc.active && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-900 dark:bg-[#161618] px-2 sm:px-3 py-1 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-[8px] sm:text-[9px] font-bold uppercase">Active</span>
                    </div>
                    <button onClick={() => handleCopy(acc.code, acc.id, acc.name)} className="bg-white dark:bg-[#27272a] p-1.5 rounded-lg border border-slate-200 dark:border-[#3f3f46] active:scale-95 transition-all">
                      {copiedId === acc.id ? <MdCheck className="text-green-600" size={16} /> : <MdContentCopy className="text-slate-500" size={16} />}
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => handleDelete(acc.id)} className="w-full flex items-center justify-center gap-1 text-red-500 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest py-1 hover:opacity-70">
                <HiTrash size={14} /> Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* টাইমার ক্যাপসুল - মিডিয়াম সাইজ */}
      <AnimatePresence>
        {hasActiveCode && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center mt-8">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-[#232326] rounded-full px-5 py-2 shadow-md flex items-center gap-3">
              <LuClock3 size={16} className={seconds < 6 ? "text-red-500 animate-pulse" : "text-blue-600"}/>
              <span className={`text-lg font-black ${seconds < 6 ? "text-red-500" : "text-slate-900 dark:text-white"}`}>{seconds}s</span>
              <div className="w-16 h-1.5 bg-slate-100 dark:bg-[#1c1c1f] rounded-full overflow-hidden">
                <motion.div className={`h-full ${seconds < 6 ? 'bg-red-500' : 'bg-blue-500'}`} animate={{ width: `${(seconds / 30) * 100}%` }} transition={{ duration: 1, ease: "linear" }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-6">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setAccounts(prev => [...prev, { id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }])} 
          className="bg-blue-600 text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
        >
          <HiPlus size={18}/> Add Account
        </motion.button>
      </div>

      {/* Popup Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-8 right-1/2 translate-x-1/2 sm:right-8 sm:translate-x-0 z-[200] bg-white dark:bg-[#1c1c1f] shadow-xl border border-slate-100 dark:border-[#2d2d30] rounded-xl p-4 min-w-[260px]"
          >
            <div className="flex items-center gap-3">
              <MdCheck className="text-green-500" size={20} />
              <p className="text-slate-900 dark:text-white text-sm font-medium">Copied: <span className="text-blue-500">{toast.name}</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAGen;