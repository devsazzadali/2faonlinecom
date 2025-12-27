"use client"

import React from "react";
import { motion } from "framer-motion";

const Ads = () => {
  return (
    /* bg-transparent নিশ্চিত করবে যে পেজের পেছনের কালার দেখা যাবে */
    <section 
      id="ads" 
      className="w-full flex justify-center py-4 mb-[18px] px-4 bg-transparent transition-colors duration-500"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl flex justify-center"
      >
        <img 
          src="/image/ads-top.png" 
          alt="Advertisement" 
          /* ডার্ক মোডে ইমেজের ব্রাইটনেস সামান্য কমানোর জন্য 'dark:brightness-90' যোগ করা হয়েছে 
             যাতে চোখের জন্য আরামদায়ক হয়।
          */
          className="w-full md:w-[80%] rounded-xl shadow-sm dark:shadow-none transition-all duration-300 object-cover dark:brightness-90 border border-transparent dark:border-zinc-800"
        />
      </motion.div>
    </section>
  );
};

export default Ads;