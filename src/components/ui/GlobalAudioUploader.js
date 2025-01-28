"use client";

import React, { useRef, useState } from "react";

/**
 * Minimal single-audio-file uploader
 */
export default function GlobalAudioUploader({
  didProcess,
  onDownloadOne,
  onNewAudio,
}) {
  console.log("GlobalAudioUploader rendered");

  const [audioFile, setAudioFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      onNewAudio?.();
    }
  };

  return (
    <div
      className="
        relative flex items-center justify-center
        rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800
        p-6
        text-gray-600 dark:text-gray-300
        min-h-[150px]
      "
      onClick={handleClick}
    >
      {!audioFile && (
        <div className="pointer-events-none text-sm text-center">
          <p>Click or drop 1 audio file here</p>
        </div>
      )}
      {audioFile && (
        <div className="pointer-events-auto flex flex-col items-center p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-800 dark:text-gray-100">{audioFile.name}</p>
        </div>
      )}
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleChange}
      />
    </div>
  );
}