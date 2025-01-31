"use client";

import React, { useRef, useState } from "react";
import { useAudioContext } from "@/context/AudioProvider";
import { PlusIcon, MusicalNoteIcon } from "@heroicons/react/20/solid";

/**
 * Single-file Audio Uploader:
 *   - Big 300px drop area if no file
 *   - Once a file is loaded => show a small 40×40 box
 *   - The box has a music note icon, the file name, and a perfect-circle "X" button top-right
 *   - Overwrites existing file if user drags a new one
 */
export default function GlobalAudioUploader() {
  const { globalAudio, setAudio } = useAudioContext();
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  /** DRAG / DROP handlers */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setAudio(droppedFile);
    }
  };

  /** CLICK => open file dialog if no file */
  const handleClick = () => {
    if (!globalAudio) {
      fileInputRef.current?.click();
    }
  };

  /** On <input> change => set new audio */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(file);
    }
  };

  /** Remove => setAudio(null) */
  const handleRemove = (ev) => {
    ev.stopPropagation();
    setAudio(null);
  };

  if (!globalAudio) {
    // If no audio => big drop area with plus icon
    return (
      <div
        className={`
          relative flex items-center justify-center
          rounded-md border-2 border-dashed
          p-6 min-h-[300px]
          bg-white dark:bg-gray-800
          text-gray-600 dark:text-gray-300
          cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
              : "border-gray-300 dark:border-gray-700"
          }
        `}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="pointer-events-none flex flex-col items-center justify-center text-center">
          <PlusIcon
            className={`h-10 w-10 ${
              isDragging ? "text-blue-500" : "text-[#0984e3]"
            }`}
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pointer-events-none">
            {isDragging
              ? "Drop your audio file here!"
              : "Drag & Drop or Click to Upload\n(Single audio file)"}
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

  // If we have an audio => show the small box like the image approach
  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-md border-2 border-dashed
        p-6 min-h-[300px]
        bg-white dark:bg-gray-800
        text-gray-600 dark:text-gray-300
      `}
      /* We still allow drag-over to overwrite the existing file. */
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* If user is dragging a new file, highlight the entire container */}
      <div
        className={`
          pointer-events-none absolute inset-0
          ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : ""}
        `}
      />
      {/* The small "preview" box for our single file */}
      <div
        className="
          pointer-events-auto
          relative
          h-40 w-40
          overflow-hidden
          rounded-md
          border border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-700
          flex flex-col items-center justify-center
        "
      >
        {/* Perfect-circle X in top-right */}
        <button
          type="button"
          onClick={handleRemove}
          className="
            absolute top-2 right-2 z-10
            h-6 w-6
            flex items-center justify-center
            rounded-full
            bg-gray-200 dark:bg-gray-600
            text-gray-600 dark:text-gray-100
            hover:bg-gray-300 dark:hover:bg-gray-500
          "
        >
          &times;
        </button>

        {/* Music icon in center */}
        <MusicalNoteIcon className="h-8 w-8 text-[#0984e3]" />

        {/* File name at bottom */}
        <p
          className="
            absolute bottom-1 left-1 right-1
            text-xs text-center
            text-gray-800 dark:text-gray-100
            truncate
          "
        >
          {globalAudio.file.name}
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