"use client";

import React, { useState } from "react";
import GlobalVideoUploader from "../../../components/ui/GlobalVideoUploader";

export default function VideoConvertPage() {
  const [targetFormat, setTargetFormat] = useState("mp4");
  const [isConverting, setIsConverting] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleConvert = () => {
    setErrorMsg(null);
    setDidProcess(false);
    setIsConverting(true);

    // Spoof server call
    setTimeout(() => {
      setIsConverting(false);
      setDidProcess(true);
    }, 2000);
  };

  const handleClear = () => {
    setErrorMsg(null);
    setDidProcess(false);
  };

  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12
        rounded-md
        shadow
        font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Video Convert
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single video file and choose a new format to convert.
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

      {/* Uploader */}
      <div className="mt-6">
        <GlobalVideoUploader
          didProcess={didProcess}
          onDownloadOne={() => alert("Downloaded (dummy)!")}
          onNewVideo={() => {
            setErrorMsg(null);
            setDidProcess(false);
          }}
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleConvert}
          disabled={isConverting}
          className="
            rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white
            hover:bg-indigo-500
          "
        >
          {isConverting ? "Converting..." : "Convert Video"}
        </button>

        {didProcess && (
          <button
            onClick={() => alert("You could do 'Download All' if needed.")}
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
            rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold
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