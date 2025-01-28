"use client";

import React, { useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

/**
 * Single-audio-file uploader with a plus icon in the empty state.
 */
export default function GlobalAudioUploader({
  didProcess,
  onDownloadOne,
  onNewAudio,
}) {
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setAudioFile(dropped);
      onNewAudio?.();
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemove = (ev) => {
    ev.stopPropagation();
    setAudioFile(null);
    onNewAudio?.();
  };

  return (
    <div
      className="
        relative flex items-center justify-center
        rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800
        p-6
        text-gray-600 dark:text-gray-300
        min-h-[300px]
      "
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {!audioFile && (
        <div className="pointer-events-none flex flex-col items-center justify-center text-center">
          <PlusIcon className="h-10 w-10 text-[#0984e3]" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag &amp; Drop or Click to Upload
            <br />
            (Single audio file)
          </p>
        </div>
      )}

      {audioFile && (
        <div
          className="
            pointer-events-auto relative
            h-40 w-40
            overflow-hidden
            rounded-md border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-700
            flex flex-col items-center justify-center p-2
          "
        >
          <button
            type="button"
            onClick={handleRemove}
            className="
              absolute top-2 right-2 z-10
              flex h-6 w-6 items-center justify-center
              rounded-full bg-gray-200 dark:bg-gray-600
              text-gray-600 dark:text-gray-100
              hover:bg-gray-300 dark:hover:bg-gray-500
            "
          >
            &times;
          </button>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {audioFile.name}
          </p>

          {didProcess && (
            <button
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                onDownloadOne?.();
              }}
              className="
                mt-4 rounded-md bg-green-600 px-2 py-1
                text-xs font-medium text-white
                hover:bg-green-500
              "
            >
              Download
            </button>
          )}
        </div>
      )}

      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}