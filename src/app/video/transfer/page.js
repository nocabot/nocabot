"use client";

import React, { useState } from "react";
import GlobalVideoUploader from "../../../components/ui/GlobalVideoUploader";

export default function VideoTransferPage() {
  // The user’s selected video file (File object)
  const [selectedFile, setSelectedFile] = useState(null);

  // Steps/states
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [shareLink, setShareLink] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Called when user picks a video from the GlobalVideoUploader
  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setErrorMsg(null);
    // Clear old link if any
    setShareLink(null);
  };

  // Main “Transfer” logic: compress → upload → share link
  const handleTransfer = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select a video file first.");
      return;
    }
    setErrorMsg(null);
    setShareLink(null);

    // 1) Compress
    setIsCompressing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s
    setIsCompressing(false);

    // 2) Upload
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s
    setIsUploading(false);

    // 3) Generate link
    // We pretend the server returned a unique ID
    const fakeId = Math.random().toString(36).substring(2, 10);
    const link = `https://server.nocabot.com/uploads/${fakeId}`;
    setShareLink(link);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setIsCompressing(false);
    setIsUploading(false);
    setShareLink(null);
    setErrorMsg(null);
  };

  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12
        rounded-md shadow
        font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Video Transfer
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload &amp; compress a single video, then get a share link (expires in 15 mins).
      </p>

      {/* Error message */}
      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* If no file is selected, show the plus-icon upload area */}
      {!selectedFile && (
        <div className="mt-6">
          <GlobalVideoUploader onFileSelected={handleFileSelected} />
        </div>
      )}

      {/* Once a file is chosen, show the Transfer UI */}
      {selectedFile && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Selected File: {selectedFile.name}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* If not yet compressing/uploading, show Transfer */}
            {!isCompressing && !isUploading && !shareLink && (
              <button
                onClick={handleTransfer}
                className="
                  rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white
                  hover:bg-indigo-500
                "
              >
                Transfer
              </button>
            )}

            {/* Show compressing / uploading states */}
            {isCompressing && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Compressing video...
              </p>
            )}
            {isUploading && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Uploading video...
              </p>
            )}

            {shareLink && (
              <button
                onClick={() => window.open(shareLink, "_blank")}
                className="
                  rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white
                  hover:bg-green-500
                "
              >
                Open Link
              </button>
            )}

            <button
              onClick={handleClear}
              className="
                rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold
                text-gray-800 dark:text-gray-100
                hover:bg-gray-400 dark:hover:bg-gray-600
              "
            >
              Clear
            </button>
          </div>

          {/* If we have a share link, display it */}
          {shareLink && (
            <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-200">
              <p className="font-medium">
                Share Link (expires in 15 mins):
              </p>
              <a
                href={shareLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {shareLink}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}