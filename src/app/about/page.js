"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12
        rounded-md
        shadow
        font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        About Nocabot LLC
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Proudly Chicago-based. No ads, no fees. Just useful tools.
      </p>

      <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          Nocabot LLC is a small Chicago-based company aiming to provide 
          convenient, no-cost tools and apps without intrusive ads 
          or data collection. We believe in privacy, simplicity, 
          and a straightforward user experience.
        </p>
        <p className="mt-4">
          Everything is offered on an <strong>as-is</strong> basis—no warranties 
          or guarantees. By using our services, you acknowledge 
          that Nocabot LLC is not responsible for any direct or indirect damages. 
          We do not store or retain your data beyond what is necessary 
          to process your request.
        </p>
        <p className="mt-4">
          We charge no fees and display no ads—our tools are free 
          for personal or commercial use. 
          Thank you for supporting a local Chicago business! 
          For questions or feedback, please get in touch. We appreciate your support!
        </p>
      </div>
    </div>
  );
}