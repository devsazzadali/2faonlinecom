"use client"

import React from "react";

const Ads = () => {
  return (
    <section 
      id="ads" 
      className="w-full flex justify-center bg-transparent p-0 m-0 overflow-hidden"
    >
      <div className="w-full max-w-full">
        <a 
          href="https://t.me/accountstoreone_official" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full block p-0 m-0 leading-[0]"
        >
          <img 
            src="/Image/ads-top.png" 
            alt="Advertisement" 
            className="w-full h-auto block border-none shadow-none outline-none p-0 m-0 object-cover dark:brightness-90 transition-all duration-300 rounded-none cursor-pointer"
          />
        </a>
      </div>
    </section>
  );
};

export default Ads;