"use client";

import React, { useRef } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

/**
 * Single-video-file uploader with plus icon in the empty state.
 *
 * Props:
 *  - onFileSelected(file) => void
 */
export default function GlobalVideoUploader({ onFileSelected }) {
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
      <div className="pointer-events-none flex flex-col items-center justify-center text-center">
        <PlusIcon className="h-10 w-10 text-[#0984e3]" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag &amp; Drop or Click to Upload
          <br />
          (Single video file)
        </p>
      </div>

      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}