"use client";

import React from "react";

export default function MemeMakerPage() {
  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12
        rounded-md
        border border-gray-200 dark:border-gray-700
        shadow dark:shadow-black/50
        font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Meme Maker
      </h1>
      <p className="mt-1 text-sm text-center text-gray-600 dark:text-gray-400">
        Coming soon! Stay tuned for fun meme creation tools.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        {/* Just a placeholder button to illustrate a future feature */}
        <button
          onClick={() => alert("Meme Maker is coming soon!")}
          className="
            rounded-md bg-indigo-600 px-4 py-2 
            text-sm font-semibold text-white 
            hover:bg-indigo-500
          "
        >
          Try Meme Maker (Coming Soon)
        </button>
      </div>

      {/*
        // If you wanted to preserve old Konva logic, you could comment it out:

        // import dynamic from "next/dynamic";
        // import AddTextModal from "@/components/meme/AddTextModal";
        // ...
        // All the advanced overlay logic is removed for now. 
      */}
    </div>
  );
}