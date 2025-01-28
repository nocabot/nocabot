"use client";

import React, { useState } from "react";
import GlobalVideoUploader from "../../../components/ui/GlobalVideoUploader";

export default function VideoCompressPage() {
  const [sliderValue, setSliderValue] = useState(5);
  const [isCompressing, setIsCompressing] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCompress = () => {
    setErrorMsg(null);
    setDidProcess(false);
    setIsCompressing(true);

    // Simulate a server call
    setTimeout(() => {
      setIsCompressing(false);
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
        Video Compress
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single video file, adjust compression, then compress.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Slider at top (like audio compress) */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex w-full max-w-sm items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Min</span>
          <input
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={sliderValue}
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            className="my-video-slider w-full"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">Max</span>
        </div>
        <style jsx>{`
          .my-video-slider {
            -webkit-appearance: none;
            height: 8px;
            border-radius: 9999px;
            background: linear-gradient(to right, #b3e0ff, #0984e3, #074291);
            outline: none;
            cursor: pointer;
          }
          .my-video-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            background: #ffffff;
            border: 2px solid #0984e3;
            border-radius: 9999px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            margin-top: -6px;
          }
          .my-video-slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            background: #ffffff;
            border: 2px solid #0984e3;
            border-radius: 9999px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* Uploader (video) */}
      <div className="mt-6">
        <GlobalVideoUploader
          didProcess={didProcess}
          onDownloadOne={() => alert("Downloaded (dummy)")}
          onNewVideo={() => {
            setErrorMsg(null);
            setDidProcess(false);
          }}
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleCompress}
          disabled={isCompressing}
          className="
            rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white
            hover:bg-indigo-500
          "
        >
          {isCompressing ? "Compressing..." : "Compress"}
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