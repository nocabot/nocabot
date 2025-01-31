"use client";

import React, { useState } from "react";
import { useVideoContext } from "@/context/VideoProvider";
import GlobalVideoUploader from "@/components/ui/GlobalVideoUploader";

export default function VideoConvertPage() {
  const { globalVideo, clearVideo } = useVideoContext();

  const [targetFormat, setTargetFormat] = useState("mp4");
  const [isConverting, setIsConverting] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleConvert = () => {
    if (!globalVideo) {
      setErrorMsg("Please upload a video file first.");
      return;
    }
    setErrorMsg(null);
    setDidProcess(false);
    setIsConverting(true);

    // Fake server
    setTimeout(() => {
      setIsConverting(false);
      setDidProcess(true);
    }, 2000);
  };

  const handleClear = () => {
    setErrorMsg(null);
    setDidProcess(false);
    setTargetFormat("mp4");
    clearVideo();
  };

  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12 rounded-md shadow font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Video Convert
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single video, choose a new format to convert.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Format dropdown */}
      <div className="mt-6 flex items-center justify-center">
        <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Convert to:
        </label>
        <select
          value={targetFormat}
          onChange={(e) => {
            setTargetFormat(e.target.value);
            setDidProcess(false);
            setErrorMsg(null);
          }}
          className="
            rounded-md border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700
            px-3 py-1 text-sm shadow-sm
            text-gray-800 dark:text-gray-100
          "
        >
          <option value="mp4">MP4</option>
          <option value="mov">MOV</option>
          <option value="avi">AVI</option>
          <option value="mkv">MKV</option>
          <option value="webm">WEBM</option>
        </select>
      </div>

      <div className="mt-6">
        <GlobalVideoUploader />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleConvert}
          disabled={isConverting}
          className={`
            rounded-md px-6 py-2 text-sm font-semibold text-white
            ${
              isConverting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }
          `}
        >
          {isConverting ? "Converting..." : "Convert Video"}
        </button>

        {didProcess && (
          <button
            onClick={() => alert("Download the converted video (dummy).")}
            className="
              rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white
              hover:bg-green-500
            "
          >
            Download
          </button>
        )}

        <button
          onClick={handleClear}
          className="
            rounded-md bg-gray-300 dark:bg-gray-700
            px-6 py-2 text-sm font-semibold
            text-gray-800 dark:text-gray-100
            hover:bg-gray-400 dark:hover:bg-gray-600
          "
        >
          Clear
        </button>
      </div>
    </div>
  );
}