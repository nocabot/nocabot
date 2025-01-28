"use client";

import React, { useRef } from "react";
import { useImageContext } from "@/context/ImageProvider";
import { PlusIcon } from "@heroicons/react/20/solid";

export default function GlobalUploader({
  didProcess,
  onDownloadOne,
  onNewImages,
}) {
  const { globalImages, addImages, removeImage } = useImageContext();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    addImages(files);
    onNewImages?.();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (!droppedFiles.length) return;
    addImages(droppedFiles);
    onNewImages?.();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemove = (index, ev) => {
    ev.stopPropagation();
    removeImage(index);
    onNewImages?.();
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
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleUploadClick}
    >
      {globalImages.length === 0 && (
        <div className="pointer-events-none flex flex-col items-center justify-center text-center">
          <PlusIcon className="h-10 w-10 text-[#0984e3]" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag &amp; Drop or Click to Upload <br /> (up to 5)
          </p>
        </div>
      )}

      {globalImages.length > 0 && (
        <div className="pointer-events-none flex flex-wrap justify-center gap-4">
          {globalImages.map((img, idx) => (
            <div
              key={idx}
              className="
                relative
                h-40 w-40
                overflow-hidden
                rounded-md
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-700
                pointer-events-auto
              "
            >
              <button
                type="button"
                onClick={(ev) => handleRemove(idx, ev)}
                className="
                  absolute top-2 right-2 z-10
                  flex h-6 w-6 items-center justify-center
                  rounded-full bg-gray-200 dark:bg-gray-600
                  text-gray-600 dark:text-gray-100
                  hover:bg-gray-300 dark:hover:bg-gray-500
                "
              >
                <span className="text-base font-bold">&times;</span>
              </button>

              {didProcess && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onDownloadOne?.(idx);
                  }}
                  className="
                    absolute bottom-2 left-1/2 -translate-x-1/2
                    transform
                    rounded-md bg-green-600 px-2 py-1
                    text-xs font-medium text-white
                    hover:bg-green-500
                  "
                >
                  Download
                </button>
              )}

              <img
                src={img.url}
                alt={`uploaded-${idx}`}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}