"use client"

import React from "react";
import { motion } from "framer-motion";

const End = () => {
  return (
    <div className="w-full max-w-[900px] mx-auto my-12 px-4 transition-colors duration-500">
      
      {/* How to Use Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-8 mb-8 shadow-sm transition-colors"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h3>
        <ul className="space-y-3">
          {[
            "Enter a name for your account (optional)",
            "Paste the secret key from your 2FA setup",
            "Your code will generate automatically every 30 seconds",
            "Click the code to copy it to your clipboard",
            "Add multiple accounts as needed",
            "Your keys are saved locally for 7 days"
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-zinc-400">
              <span className="text-blue-600 font-bold">•</span>
              {text}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Account Store One Main Blue Section */}
      <section className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-8 md:p-12 text-center transition-all">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📱</span> 
            <span className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">Account Store One</span>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Premium Partner</span>
          </div>
          <h4 className="text-lg md:text-xl font-bold text-gray-800 dark:text-zinc-200">Professional Facebook Advertising Solutions</h4>
        </div>

        {/* Warning Alert Box */}
        <div className="bg-white dark:bg-zinc-950 border border-red-100 dark:border-red-900/30 rounded-2xl p-5 max-w-2xl mx-auto mb-10 text-left shadow-sm">
          <div className="flex gap-4 items-start">
            <span className="text-2xl">⚠️</span>
            <div>
              <strong className="text-red-600 dark:text-red-400 block mb-1 text-sm md:text-base">Tired of Facebook ad account bans?</strong>
              <p className="text-gray-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                Account Store One provides verified business managers, aged profiles, and high-trust advertising assets to help you scale without interruption.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Grid Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { icon: "🏢", title: "Verified BMs", desc: "High-limit Business Managers", bg: "bg-blue-100/50 dark:bg-blue-900/30" },
            { icon: "👤", title: "Aged Profiles", desc: "Established history profiles", bg: "bg-zinc-100 dark:bg-zinc-800" },
            { icon: "✅", title: "Blue Tick Pages", desc: "Enhanced credibility pages", bg: "bg-green-100/50 dark:bg-green-900/30" }
          ].map((item, i) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={i} 
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200/50 dark:border-zinc-800 shadow-sm"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4`}>
                {item.icon}
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h5>
              <p className="text-xs text-gray-500 dark:text-zinc-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-xl mx-auto italic">
            "Join over 5,000+ successful marketers who rely on Account Store One infrastructure."
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4">
            <a 
              href="http://accountstoreone.com/" 
              target="_blank" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Visit accountstoreone.com →
            </a>
            <span className="px-4 py-2 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/50 rounded-full text-[11px] font-bold text-blue-600 dark:text-blue-400">24/7 Support</span>
            <span className="px-4 py-2 bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-900/50 rounded-full text-[11px] font-bold text-green-600 dark:text-green-400">5,000+ Customers</span>
          </div>
        </div>
      </section>
      
      <div className="text-center mt-10 text-gray-400 dark:text-zinc-600 text-xs font-medium">
        © 2025 2FAOnline.com. All Rights Reserved.
      </div>
    </div>
  );
};

export default End;