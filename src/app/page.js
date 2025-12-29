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

  // ১. ইনিশিয়াল লোড (Theme এবং History)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const themeIsDark = savedTheme === "dark" || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(themeIsDark);
    if (themeIsDark) document.documentElement.classList.add("dark");
    
    const savedHistory = localStorage.getItem('2fa_history');
    if (savedHistory) setHistoryList(JSON.parse(savedHistory));
    
    setIsLoaded(true);
  }, []);

  // ২. হিস্ট্রি অ্যাড করার মেইন ফাংশন
  const addToHistory = (rawEntry) => {
    if(!rawEntry || !rawEntry.secret) return; // সিক্রেট না থাকলে সেভ হবে না

    const formattedEntry = {
      id: Date.now(),
      name: rawEntry.name || 'Untitled Account',
      secret: rawEntry.secret,
      timestamp: Date.now(),
      // সিক্রেট কি আংশিক গোপন রাখা (Privacy)
      maskedKey: `${rawEntry.secret.substring(0, 4)}••••${rawEntry.secret.slice(-4)}`,
      addedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistoryList(prev => {
      const updated = [formattedEntry, ...prev].slice(0, 20); // সর্বোচ্চ ২০টি হিস্ট্রি রাখবে
      localStorage.setItem('2fa_history', JSON.stringify(updated));
      return updated;
    });
  };

  // ৩. হিস্ট্রি থেকে রিস্টোর করার লজিক
  const restoreFromHistory = (item) => {
    // FAGen-কে সিগন্যাল পাঠানো
    window.dispatchEvent(new CustomEvent('restoreAccount', { detail: item }));
    
    // হিস্ট্রি থেকে রিমুভ করা
    const updatedHistory = historyList.filter(h => h.id !== item.id);
    setHistoryList(updatedHistory);
    localStorage.setItem('2fa_history', JSON.stringify(updatedHistory));
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header 
        onHistoryClick={() => setShowHistory(!showHistory)} 
        historyCount={historyList.length} 
        isDarkMode={isDarkMode}
        onThemeToggle={() => {
          const newTheme = !isDarkMode;
          setIsDarkMode(newTheme);
          document.documentElement.classList.toggle("dark");
          localStorage.setItem("theme", newTheme ? "dark" : "light");
        }}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* Hero থেকে জেনারেট করলে সরাসরি হিস্ট্রিতে যাবে */}
        <Hero onCodeGenerate={addToHistory} />
        
        {showHistory && (
          <History 
            historyData={historyList} 
            onRestore={restoreFromHistory} 
          />
        )}

        <div className="flex justify-center overflow-hidden rounded-2xl border border-border-custom">
           <Ads />
        </div>

        {/* FAGen থেকে ডিলিট করলে হিস্ট্রিতে অ্যাড হবে */}
        <FAGen onAccountDeleted={addToHistory} />
        
        <End />
      </main>
    </div>
  )
}