"use client"

import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    /* .hero */
    <section className="text-center py-12 px-5 bg-white dark:bg-zinc-950 transition-colors duration-500">
      
      {/* Animated Heading with Gradient */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight"
      >
        2FA <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Online</span> – Free Online 2FA Code Generator
      </motion.h1>

      {/* Description */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto mt-4 text-sm md:text-base leading-relaxed text-gray-500 dark:text-zinc-400 font-medium"
      >
        Generate TOTP codes instantly from your secret keys — 
        <span className="text-gray-900 dark:text-zinc-200"> secure, fast, works offline</span> in your browser.
      </motion.p>

      {/* Security Badge (Optional Visual Addition) */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        Saved Your Data In Your Local Storage
      </motion.div>
    </section>
  );
};

export default Hero;