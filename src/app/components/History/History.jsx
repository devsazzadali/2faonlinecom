"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdHistory, MdRestore, MdInfoOutline } from 'react-icons/md';

const History = ({ historyData, onRestore }) => {
  return (
    <div className="w-full max-w-[950px] mx-auto my-8 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm transition-colors duration-500">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <MdHistory className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Recent Deleted Keys</h3>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium tracking-wide uppercase">Click a card to restore it back to live</p>
          </div>
        </div>
        
        {/* কাউন্টার */}
        <div className="text-[10px] font-black bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-slate-500">
          {historyData.length} ITEMS
        </div>
      </div>
      
      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {historyData && historyData.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {historyData.map((item) => (
              <motion.div 
                key={item.id} // App.js এ দেওয়া ইউনিক ID ব্যবহার করা হয়েছে
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onRestore(item)} // এখানে ক্লিক করলেই App.js হয়ে FAGen এ চলে যাবে
                className="group relative cursor-pointer bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
              >
                {/* Restore Badge Overlay */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0">
                  CLICK TO RESTORE
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-sm font-black text-slate-800 dark:text-zinc-100 truncate">
                    {item.name || 'Unnamed Account'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500 tracking-tighter">
                    {item.maskedKey}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-900">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-zinc-600 uppercase">
                    <MdInfoOutline size={12} />
                    {item.addedTime}
                  </div>
                  <MdRestore className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="col-span-full py-20 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
              <MdHistory size={32} className="text-slate-200 dark:text-zinc-700" />
            </div>
            <p className="text-sm font-bold text-slate-300 dark:text-zinc-600 tracking-widest uppercase">No Deleted History</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default History;