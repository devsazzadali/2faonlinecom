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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const themeIsDark = savedTheme === "dark" || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(themeIsDark);
    if (themeIsDark) document.documentElement.classList.add("dark");
    
    const savedHistory = localStorage.getItem('2fa_history');
    if (savedHistory) setHistoryList(JSON.parse(savedHistory));
    
    setIsLoaded(true);
  }, []);

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
        <Hero onCodeGenerate={(entry) => {/* History Update Logic */}} />
        
        {showHistory && <History historyData={historyList} />}

        <div className="flex justify-center overflow-hidden rounded-2xl border border-border-custom">
           <Ads />
        </div>

        <FAGen />
        
        <End />
      </main>
    </div>
  )
}