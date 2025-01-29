"use client";

import React, { useState, useRef } from "react";
import GlobalAudioUploader from "../../../components/ui/GlobalAudioUploader";

export default function AudioFrequencyPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const [frequency, setFrequency] = useState(440); // default “middle A”
  const [isApplying, setIsApplying] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const audioRef = useRef(null);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setDidProcess(false);
    setErrorMsg(null);

    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleApplyFrequency = () => {
    if (!selectedFile) return;
    setErrorMsg(null);
    setIsApplying(true);
    setDidProcess(false);

    // Dummy server call
    setTimeout(() => {
      setIsApplying(false);
      setDidProcess(true);
    }, 2000);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setFrequency(440);
    setIsApplying(false);
    setDidProcess(false);
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
        Audio Frequency
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single audio file, pick a frequency (Hz), then apply.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* If no file yet, show the plus icon uploader */}
      {!selectedFile && (
        <div className="mt-6">
          <GlobalAudioUploader onFileSelected={handleFileSelected} />
        </div>
      )}

      {/* Once user selected a file, show the <audio> player + frequency slider */}
      {selectedFile && (
        <div className="mt-6">
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              className="w-full max-w-md mx-auto block"
            >
              Your browser does not support the audio element.
            </audio>
          )}

          {/* Frequency slider */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Frequency: {frequency} Hz
            </label>
            <div className="w-full max-w-sm flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">20Hz</span>
              <input
                type="range"
                min={20}
                max={20000}
                step={50}
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
                className="my-freq-slider w-full"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">20kHz</span>
            </div>
            <style jsx>{`
              .my-freq-slider {
                -webkit-appearance: none;
                height: 8px;
                border-radius: 9999px;
                background: linear-gradient(to right, #b3e0ff, #0984e3, #074291);
                outline: none;
                cursor: pointer;
              }
              .my-freq-slider::-webkit-slider-thumb {
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
              .my-freq-slider::-moz-range-thumb {
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
              onClick={handleApplyFrequency}
              disabled={isApplying}
              className="
                rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white
                hover:bg-indigo-500
              "
            >
              {isApplying ? "Applying..." : "Apply Frequency"}
            </button>

            {didProcess && (
              <button
                onClick={() => alert("Downloaded with new frequency (dummy)!")}
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
      )}
    </div>
  );
}