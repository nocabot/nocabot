"use client";

import React, { useState } from "react";
import GlobalAudioUploader from "../../../components/ui/GlobalAudioUploader";

export default function AudioCompressPage() {
  console.log("AudioCompressPage rendered - Step 2 with slider & buttons!");

  // Additional states for "Compress" logic
  const [sliderValue, setSliderValue] = useState(5);
  const [isCompressing, setIsCompressing] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Dummy compress function
  const handleCompress = () => {
    setErrorMsg(null);
    setDidProcess(false);
    setIsCompressing(true);

    // Simulate server
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
      className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%]
                 bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Audio Compress - Step 2
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Now with a slider and dummy compress logic.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Uploader */}
      <div className="mt-6">
        <GlobalAudioUploader
          didProcess={didProcess}
          onDownloadOne={() => alert("Download (dummy)")}
          onNewAudio={() => {
            setErrorMsg(null);
            setDidProcess(false);
          }}
        />
      </div>

      {/* Compression Slider */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex w-full max-w-sm items-center justify-between px-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <span>Lower quality</span>
          <span>Higher quality</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value))}
          className="my-audio-slider w-full max-w-sm"
        />
        <style jsx>{`
          .my-audio-slider {
            -webkit-appearance: none;
            height: 8px;
            border-radius: 9999px;
            background: linear-gradient(to right, #b3e0ff, #0984e3, #074291);
            outline: none;
            cursor: pointer;
          }
          .my-audio-slider::-webkit-slider-thumb {
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
          .my-audio-slider::-moz-range-thumb {
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

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleCompress}
          disabled={isCompressing}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {isCompressing ? "Compressing..." : "Compress Audio"}
        </button>

        {didProcess && (
          <button
            onClick={() => alert("You could do 'Download All' if needed.")}
            className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-500"
          >
            Download
          </button>
        )}

        <button
          onClick={handleClear}
          className="rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
}