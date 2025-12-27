"use client"

import React, { useState } from "react";
// MdOutlineStickyNote2 আইকনটি অ্যাড করা হয়েছে
import { MdDarkMode, MdLightMode, MdMenu, MdClose, MdHistory, MdRefresh, MdDeleteSweep, MdOutlineStickyNote2 } from "react-icons/md"; 
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // Next.js এর লিঙ্ক ব্যবহার করা হয়েছে

const Header = ({ onHistoryClick, historyCount, isDarkMode, onThemeToggle, onRefresh, onClearHistory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-[1000] w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between relative">
        
        {/* Brand */}
        <Link href="/">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="text-2xl group-hover:scale-110 transition-transform">🛡️</div>
            <div className="font-black text-xl tracking-tight text-gray-900 dark:text-white">
              2FA<span className="text-blue-600">Online</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Generator
          </Link>
          {/* Secure Notes Page Link */}
          <Link href="/note" className="text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            <MdOutlineStickyNote2 size={18} /> Notes
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <button 
              className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
              onClick={onHistoryClick}
            >
              <MdHistory size={18} className="text-blue-600" /> 
              History <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{historyCount}</span>
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button 
            className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all active:rotate-12" 
            onClick={onThemeToggle}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <MdLightMode size={20} className="text-yellow-500 animate-pulse" />
            ) : (
              <MdDarkMode size={20} className="text-blue-600" />
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-gray-700 dark:text-zinc-200" onClick={toggleMenu}>
            {isMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-5 w-64 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl p-4 mt-2 flex flex-col gap-2 md:hidden"
            >
              {/* Mobile Note Link */}
              <Link 
                href="/note" 
                onClick={toggleMenu}
                className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-zinc-200"
              >
                <MdOutlineStickyNote2 size={20} className="text-blue-600" /> Secure Notes
              </Link>

              <button 
                className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-zinc-200" 
                onClick={() => { onHistoryClick(); toggleMenu(); }}
              >
                <MdHistory size={20} className="text-blue-600" /> History ({historyCount})
              </button>
              
              <button 
                className="w-full p-3 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center gap-3 text-sm font-bold text-red-500" 
                onClick={() => { onClearHistory(); toggleMenu(); }}
              >
                <MdDeleteSweep size={20} /> Clear History
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;