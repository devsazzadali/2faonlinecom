"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdNoteAdd, MdDelete, MdAccessTime, MdSecurity } from 'react-icons/md';
// Header এর পাথ চেক করে নিন (আপনার components ফোল্ডার অনুযায়ী)
import Header from '../components/Header/Header.jsx'; 

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ১. ডার্ক মোড এবং ৩০ দিনের ক্লিনআপ লজিক
  useEffect(() => {
    // থিম চেক
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // নোট লোড এবং অটো-ডিলিট
    const savedNotes = localStorage.getItem('2fa_secure_notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      // ৩০ দিনের পুরনো নোট ফিল্টার করা
      const filteredNotes = parsedNotes.filter(note => (now - note.id) < thirtyDaysInMs);
      
      setNotes(filteredNotes);
      localStorage.setItem('2fa_secure_notes', JSON.stringify(filteredNotes));
    }
  }, []);

  const addNote = () => {
    if (!input.trim()) return;
    const newNote = {
      id: Date.now(),
      text: input,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      addedTime: new Date().toLocaleString()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('2fa_secure_notes', JSON.stringify(updated));
    setInput("");
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('2fa_secure_notes', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500 text-slate-900 dark:text-slate-100">
      <Header isDarkMode={isDarkMode} /> 

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3">Secure <span className="text-blue-600">Notes</span></h1>
          <p className="text-sm opacity-60 flex items-center justify-center gap-2">
            <MdSecurity className="text-green-500" /> Saved locally. Auto-deletes after 30 days.
          </p>
        </div>

        <div className="relative mb-12">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Store your recovery keys or secret notes safely..."
            className="w-full h-40 p-6 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none shadow-inner"
          />
          <button 
            onClick={addNote}
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <MdNoteAdd size={20} /> Save Securely
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div 
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl relative group shadow-sm hover:shadow-md transition-all"
              >
                <button onClick={() => deleteNote(note.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                  <MdDelete size={20} />
                </button>
                <p className="text-sm leading-relaxed mb-6 whitespace-pre-wrap pr-6">{note.text}</p>
                <div className="pt-4 border-t border-slate-50 dark:border-zinc-800 space-y-1">
                  <div className="text-[10px] font-bold opacity-40 uppercase flex items-center gap-1">
                    <MdAccessTime /> {note.addedTime}
                  </div>
                  <div className="text-[10px] font-bold text-red-500/60 uppercase">
                    Expires: {note.expiryDate}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default NotePage;