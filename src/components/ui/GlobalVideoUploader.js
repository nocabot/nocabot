"use client";

import React, { useRef, useState } from "react";
import { useVideoContext } from "@/context/VideoProvider";
import { PlusIcon, XMarkIcon, VideoCameraIcon } from "@heroicons/react/20/solid";

/**
 * Single-video-file uploader with highlight on drag,
 * storing the file in global VideoContext.
 * Shows a small thumbnail if possible, or fallback icon if thumbnail fails.
 */
export default function GlobalVideoUploader() {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const { globalVideo, setVideo, clearVideo } = useVideoContext();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setThumbnailFailed(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
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
      setVideo(droppedFile);
      setThumbnailFailed(false);
    }
  };

  const handleRemove = (ev) => {
    ev.stopPropagation();
    clearVideo();
    setThumbnailFailed(false);
  };

  const handleVideoError = () => {
    // If the small thumbnail fails to load a frame, show fallback icon
    setThumbnailFailed(true);
  };

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-md border-2 border-dashed
        p-6 min-h-[300px] cursor-pointer
        bg-white dark:bg-gray-800
        text-gray-600 dark:text-gray-300
        ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
            : "border-gray-300 dark:border-gray-700"
        }
      `}
      onClick={handleUploadClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* If NO video is selected */}
      {!globalVideo && (
        <div className="pointer-events-none flex flex-col items-center justify-center text-center">
          <PlusIcon
            className={`h-10 w-10 ${
              isDragging ? "text-blue-500" : "text-[#0984e3]"
            }`}
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre">
            {isDragging
              ? "Drop your video file here!"
              : "Drag & Drop or Click to Upload\n(Single video file)"}
          </p>
        </div>
      )}

      {/* If we HAVE a globalVideo, show small box with thumbnail or fallback */}
      {globalVideo && (
        <div
          className="
            pointer-events-auto relative flex flex-col items-center
            rounded-md border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-700 p-2
            w-40 h-40
          "
          onClick={(e) => e.stopPropagation()} // don't re-trigger upload
        >
          {/* X button to remove */}
          <button
            onClick={handleRemove}
            className="
              absolute top-2 right-2 z-10
              flex h-6 w-6 items-center justify-center
              rounded-full bg-gray-200 dark:bg-gray-600
              text-gray-600 dark:text-gray-100
              hover:bg-gray-300 dark:hover:bg-gray-500
            "
          >
            <XMarkIcon className="h-4 w-4" />
          </button>

          {/* Either a small <video> thumbnail or fallback icon */}
          {!thumbnailFailed ? (
            <video
              src={globalVideo.url}
              className="w-full h-24 object-cover mb-1 pointer-events-none bg-black"
              controls={false}
              muted
              autoPlay={false}
              loop={false}
              onError={handleVideoError}
            />
          ) : (
            // Fallback icon if we can't load a thumbnail
            <div className="w-full h-24 flex items-center justify-center mb-1 bg-black">
              <VideoCameraIcon className="h-8 w-8 text-gray-200" />
            </div>
          )}

          {/* Filename below thumbnail */}
          <div className="w-full text-xs text-center text-gray-800 dark:text-gray-100 px-1 truncate">
            {globalVideo.file.name}
          </div>
        </div>
      )}

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