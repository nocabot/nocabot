"use client";

import React, { useState, useRef } from "react";
import GlobalAudioUploader from "../../../components/ui/GlobalAudioUploader";

export default function AudioResizePage() {
  const [selectedFile, setSelectedFile] = useState(null);   // the actual File
  const [audioUrl, setAudioUrl] = useState(null);           // object URL
  const [duration, setDuration] = useState(0);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [isTrimming, setIsTrimming] = useState(false);
  const [didTrim, setDidTrim] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const audioRef = useRef(null);

  // Called from the uploader when the user picks a file
  const handleFileSelected = (file) => {
    setErrorMsg(null);
    setDidTrim(false);
    setSelectedFile(file);

    // create an object URL to play
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
  };

  // When audio metadata is loaded, we get its duration
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    if (!isNaN(dur) && dur > 0) {
      setDuration(dur);
      setStartTime(0);
      setEndTime(dur);
    }
  };

  // "Trim" is a dummy server call
  const handleTrim = () => {
    if (!selectedFile) return;
    if (startTime >= endTime) {
      setErrorMsg("Start time must be less than end time!");
      return;
    }
    setErrorMsg(null);
    setIsTrimming(true);
    setDidTrim(false);

    // Fake server call
    setTimeout(() => {
      setIsTrimming(false);
      setDidTrim(true);
    }, 2000);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setIsTrimming(false);
    setDidTrim(false);
    setErrorMsg(null);
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
        Audio “Resize” (Trim)
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single audio file, pick your start &amp; end times, then trim.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* If we haven't selected a file, show the GlobalAudioUploader.
          If we have selectedFile, we can still show the player below. */}
      {!selectedFile && (
        <div className="mt-6">
          <GlobalAudioUploader onFileSelected={handleFileSelected} />
        </div>
      )}

      {/* Once we have a file, show the player and the trim UI */}
      {selectedFile && (
        <div className="mt-6">
          {/* We could hide the uploader if you prefer, or keep it: 
              We'll hide it to match "once you have a file, you see the trimming UI" */}
          {/* AUDIO PLAYER */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full max-w-md mx-auto block"
            >
              Your browser does not support the audio element.
            </audio>
          )}

          {duration > 0 && (
            <div className="mt-6 flex flex-col items-center gap-4">
              {/* START TIME */}
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Start Time: {startTime.toFixed(2)}s
                </label>
                <input
                  type="range"
                  min={0}
                  max={endTime}
                  step={0.01}
                  value={startTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val < endTime) {
                      setStartTime(val);
                    }
                  }}
                  className="my-trim-slider"
                />
              </div>

              {/* END TIME */}
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  End Time: {endTime.toFixed(2)}s
                </label>
                <input
                  type="range"
                  min={startTime}
                  max={duration}
                  step={0.01}
                  value={endTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (val > startTime) {
                      setEndTime(val);
                    }
                  }}
                  className="my-trim-slider"
                />
              </div>

              <style jsx>{`
                .my-trim-slider {
                  -webkit-appearance: none;
                  height: 6px;
                  border-radius: 9999px;
                  background: linear-gradient(to right, #b3e0ff, #0984e3, #074291);
                  outline: none;
                  cursor: pointer;
                  margin-top: 4px;
                }
                .my-trim-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 16px;
                  width: 16px;
                  background: #ffffff;
                  border: 2px solid #0984e3;
                  border-radius: 9999px;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                  cursor: pointer;
                  margin-top: -5px;
                }
                .my-trim-slider::-moz-range-thumb {
                  height: 16px;
                  width: 16px;
                  background: #ffffff;
                  border: 2px solid #0984e3;
                  border-radius: 9999px;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                  cursor: pointer;
                }
              `}</style>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleTrim}
              disabled={isTrimming}
              className="
                rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white
                hover:bg-indigo-500
              "
            >
              {isTrimming ? "Trimming..." : "Trim Audio"}
            </button>

            {didTrim && (
              <button
                onClick={() => alert("Download trimmed audio (dummy)!")}
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