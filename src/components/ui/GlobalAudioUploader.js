"use client";

import React, { useRef } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

/**
 * Single-audio-file uploader with a plus icon in the empty state.
 * 
 * Props:
 *  - onFileSelected(file) => void
 * 
 * When a file is chosen, we call onFileSelected with that File.
 * This does NOT track "didProcess" or "onDownloadOne" etc.
 * We keep it minimal so your parent page is in control.
 */
export default function GlobalAudioUploader({ onFileSelected }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected?.(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelected?.(droppedFile);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="
        relative flex items-center justify-center
        rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800
        p-6
        text-gray-600 dark:text-gray-300
        min-h-[300px]
        cursor-pointer
      "
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Always show the plus icon + text if no file is selected (the parent will show the player if they want) */}
      <div className="pointer-events-none flex flex-col items-center justify-center text-center">
        <PlusIcon className="h-10 w-10 text-[#0984e3]" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag &amp; Drop or Click to Upload
          <br />
          (Single audio file)
        </p>
      </div>

      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}