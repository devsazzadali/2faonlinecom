"use client"

import React, { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import History from './components/History/History.jsx'
import Ads from './components/Ads/Ads.jsx'
import FAGen from './components/FAGen/FAGen.jsx'
import End from './components/End/End.jsx'

const App = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [historyList, setHistoryList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Hydration ফিক্স করার জন্য

  // ১. লোড হওয়ার সময় একবার থিম এবং হিস্ট্রি চেক করা
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const themeIsDark = savedTheme === "dark";
    
    setIsDarkMode(themeIsDark);
    if (themeIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const savedHistory = localStorage.getItem('2fa_history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      setHistoryList(parsed.filter(item => item.timestamp > sevenDaysAgo));
    }
    
    setIsLoaded(true); // মাউন্ট শেষ
  }, []);

  // ২. থিম টগল (একদম সলিড লজিক)
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // ৩. হিস্ট্রি অ্যাড করা (FAGen থেকে কল হবে)
  const addToHistory = (rawEntry) => {
    if(!rawEntry || !rawEntry.secret) return;

    const formattedEntry = {
      id: Date.now(),
      name: rawEntry.name || 'Untitled Account',
      secret: rawEntry.secret,
      timestamp: Date.now(),
      maskedKey: `${rawEntry.secret.substring(0, 4)}••••${rawEntry.secret.slice(-4)}`,
      addedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistoryList(prev => {
      const updated = [formattedEntry, ...prev];
      localStorage.setItem('2fa_history', JSON.stringify(updated));
      return updated;
    });
  };

  // ৪. রিস্টোর লজিক
  const restoreFromHistory = (item) => {
    window.dispatchEvent(new CustomEvent('restoreAccount', { detail: item }));
    
    const updatedHistory = historyList.filter(h => h.id !== item.id);
    setHistoryList(updatedHistory);
    localStorage.setItem('2fa_history', JSON.stringify(updatedHistory));
  };

  // Hydration এরর এড়ানোর জন্য লোড না হওয়া পর্যন্ত কিছু রেন্ডার করবে না
  if (!isLoaded) return <div className="min-h-screen bg-white dark:bg-zinc-950"></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <Header 
        onHistoryClick={() => setShowHistory(!showHistory)} 
        historyCount={historyList.length} 
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        onRefresh={() => window.location.reload()}
      />
      
      <main className="container mx-auto pb-20">
        <Hero onCodeGenerate={addToHistory} />

        {showHistory && (
          <History 
            historyData={historyList} 
            onRestore={restoreFromHistory} 
          />
        )}

        <Ads />

        <FAGen onAccountDeleted={addToHistory} />
        
        <End />
      </main>
    </div>
  )
}

export default App;