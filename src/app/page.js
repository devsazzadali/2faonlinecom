"use client"
import React, { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import History from './components/History/History'
import Ads from './components/Ads/Ads'
import FAGen from './components/FAGen/FAGen'
import End from './components/End/End'

export default function App() {
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [historyList, setHistoryList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ৭ দিন আগের টাইমস্ট্যাম্প বের করার ফাংশন
  const getSevenDaysAgo = () => Date.now() - (7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    // থিম সেটআপ
    const savedTheme = localStorage.getItem("theme");
    const themeIsDark = savedTheme === "dark" || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(themeIsDark);
    if (themeIsDark) document.documentElement.classList.add("dark");
    
    // হিস্ট্রি লোড এবং ৭ দিনের পুরনো ডাটা ক্লিনআপ
    const savedHistory = localStorage.getItem('2fa_history_unlimited');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      const sevenDaysAgo = getSevenDaysAgo();
      
      // শুধুমাত্র গত ৭ দিনের ডাটা ফিল্টার করা হলো
      const freshHistory = parsedHistory.filter(item => item.deletedAt > sevenDaysAgo);
      setHistoryList(freshHistory);
      localStorage.setItem('2fa_history_unlimited', JSON.stringify(freshHistory));
    }
    
    setIsLoaded(true);
  }, []);

  /**
   * Senior Developer Logic:
   * ১. ইউনিক সিক্রেট কী এবং কোড কম্বিনেশন চেক করবে।
   * ২. একই সিক্রেটের নতুন কোড আসলে আগেরটি মুছে লেটেস্টটি টপে রাখবে (হিজীবিজী হবে না)।
   * ৩. সর্বোচ্চ ৫০টি এন্ট্রি থাকবে।
   * ৪. ৭ দিন পর ডাটা অটো ডিলিট হবে।
   */
  const addToHistory = (rawEntry) => {
    if(!rawEntry || !rawEntry.secret || !rawEntry.code || rawEntry.code === '------') return;

    setHistoryList(prev => {
      const sevenDaysAgo = getSevenDaysAgo();
      
      // ডুপ্লিকেট চেক (একই সিক্রেট এবং একই কোড থাকলে ইগনোর করবে)
      const isExactlyDuplicate = prev.some(
        item => item.secret === rawEntry.secret && item.code === rawEntry.code
      );
      if (isExactlyDuplicate) return prev;

      // একই সিক্রেটের পুরনো কোড থাকলে সেটি সরিয়ে ফেলবে (যাতে লিস্ট ক্লিন থাকে)
      const filteredBySecret = prev.filter(h => h.secret !== rawEntry.secret);

      const formattedEntry = {
        ...rawEntry,
        id: Date.now(),
        deletedAt: Date.now(), 
      };

      // নতুন ডাটা যোগ এবং ৭ দিনের ফিল্টার অ্যাপ্লাই
      const updated = [formattedEntry, ...filteredBySecret].filter(
        item => item.deletedAt > sevenDaysAgo
      );
      
      // সর্বোচ্চ ৫০টি ডাটা রাখা
      const limitedHistory = updated.slice(0, 50);
      
      localStorage.setItem('2fa_history_unlimited', JSON.stringify(limitedHistory));
      return limitedHistory;
    });
  };

  const restoreFromHistory = (item) => {
    window.dispatchEvent(new CustomEvent('restoreAccount', { detail: item }));
    const updatedHistory = historyList.filter(h => h.id !== item.id);
    setHistoryList(updatedHistory);
    localStorage.setItem('2fa_history_unlimited', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistoryList([]);
      localStorage.removeItem('2fa_history_unlimited');
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <Header 
        onHistoryClick={() => setShowHistory(!showHistory)} 
        historyCount={historyList.length} 
        isDarkMode={isDarkMode}
        onClearHistory={clearHistory}
        onThemeToggle={() => {
          const newTheme = !isDarkMode;
          setIsDarkMode(newTheme);
          if (newTheme) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          localStorage.setItem("theme", newTheme ? "dark" : "light");
        }}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        <Hero onCodeGenerate={addToHistory} />
        
        {showHistory && (
          <History 
            historyData={historyList} 
            onRestore={restoreFromHistory} 
            onClearAll={clearHistory}
          />
        )}

        <div className="flex justify-center overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800">
            <Ads />
        </div>

        <FAGen onAccountDeleted={addToHistory} />
        
        <End />
      </main>
    </div>
  )
}