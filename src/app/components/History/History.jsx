"use client"
import React, { useState, useEffect } from 'react';
import { HiClock } from 'react-icons/hi';

const History = ({ historyData = [], onRestore, onClearAll, onClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // আপেক্ষিক সময়ের জন্য ফাংশন (ডান পাশের ছোট ব্যাজের জন্য)
  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // সরাসরি সময় দেখানোর ফাংশন (নিচের জন্য)
  const formatExactTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!historyData || historyData.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-3">
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
          <HiClock size={14}/> Recent History
        </h2>
        <button onClick={() => setShowConfirm(true)} className="text-[10px] font-bold text-red-400/70 hover:text-red-500 uppercase">Clear</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
        {historyData.map((item, index) => (
          <div 
            key={index} 
            onClick={() => { 
              onRestore?.(item); 
              onClose?.(); 
              window.dispatchEvent(new CustomEvent('restoreAccount', {detail: item})); 
            }}
            className="group bg-[#f9fafb] dark:bg-[#161618] border border-slate-200/50 dark:border-[#232326] p-3 rounded-[14px] hover:bg-white dark:hover:bg-[#1c1c1f] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <div className="flex justify-between items-center mb-1.5">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-[13px] truncate pr-2">
                {item.name || 'Unnamed Account'}
              </h3>
              {/* ডানপাশে আপেক্ষিক সময় (e.g. 5m ago) */}
              <span className="text-[9px] text-slate-500 font-bold bg-slate-200/40 dark:bg-zinc-800 px-2 py-0.5 rounded-full shrink-0">
                {getTimeAgo(item.deletedAt)}
              </span>
            </div>
            
            <div className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mb-1.5 tracking-wider">
              {item.secret ? `${item.secret.substring(0, 4)}****${item.secret.slice(-4)}` : '••••'}
            </div>
            
            {/* নিচে সরাসরি সময় (e.g. 01:24 PM) */}
            <div className="text-[9px] text-slate-400/70 font-semibold uppercase tracking-tight flex items-center gap-1">
              <span>Deleted at:</span>
              <span className="text-blue-500/80">{formatExactTime(item.deletedAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[500] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1c1c1f] p-6 rounded-2xl shadow-2xl w-full max-w-[260px] text-center border">
            <p className="font-bold text-sm mb-4">Clear History?</p>
            <div className="flex gap-2">
              <button onClick={() => { onClearAll(); setShowConfirm(false); }} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold">CLEAR</button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 py-2 rounded-xl text-xs font-bold">NO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;