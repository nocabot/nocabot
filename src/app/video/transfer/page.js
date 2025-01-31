"use client";

import React, { useState } from "react";
import { useVideoContext } from "@/context/VideoProvider";
import GlobalVideoUploader from "@/components/ui/GlobalVideoUploader";

export default function VideoTransferPage() {
  const { globalVideo, clearVideo } = useVideoContext();

  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleTransfer = async () => {
    if (!globalVideo) {
      setErrorMsg("Please upload a video file first.");
      return;
    }
    setErrorMsg(null);
    setShareLink(null);

    // 1) Compress
    setIsCompressing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsCompressing(false);

    // 2) Upload
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsUploading(false);

    // 3) Fake share link
    const fakeId = Math.random().toString(36).substr(2, 8);
    setShareLink(`https://server.nocabot.com/uploads/${fakeId}`);
  };

  const handleClear = () => {
    setErrorMsg(null);
    setIsCompressing(false);
    setIsUploading(false);
    setShareLink(null);
    clearVideo();
  };

  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12 rounded-md shadow
        font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Video Transfer
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Compress &amp; upload a single video, then get a share link.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Uploader */}
      <div className="mt-6">
        <GlobalVideoUploader />
      </div>

      {/* Actions */}
      {globalVideo && (
        <div className="mt-6 flex flex-col items-center gap-4">
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

          {isCompressing && (
            <p className="text-sm text-gray-600 dark:text-gray-300">Compressing video...</p>
          )}
          {isUploading && (
            <p className="text-sm text-gray-600 dark:text-gray-300">Uploading video...</p>
          )}

          {shareLink && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => window.open(shareLink, "_blank")}
                className="
                  rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white
                  hover:bg-green-500
                "
              >
                Open Link
              </button>
              <p className="text-xs text-gray-700 dark:text-gray-200 break-all max-w-xs text-center">
                Expires in 15 mins: <br />
                <a
                  href={shareLink}
                  className="text-blue-600 dark:text-blue-400 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {shareLink}
                </a>
              </p>
            </div>
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
      )}
    </div>
  );
}