"use client";

import React, { useState, useRef } from "react";
import GlobalAudioUploader from "../../../components/ui/GlobalAudioUploader";

export default function AudioResizePage() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [isTrimming, setIsTrimming] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const audioRef = useRef(null);

  // Called when user picks new audio
  const handleNewAudio = () => {
    setErrorMsg(null);
    setDidProcess(false);
    // We'll get the file from GlobalAudioUploader's single-file
    // but we need to store it here too for the audio player
  };

  // If you want to connect the file with this page's logic:
  // We can pass a callback to onNewAudio that sets local state
  // But for demonstration, let's just define a "setAudio" function
  const setAudio = (file) => {
    if (!file) {
      setAudioFile(null);
      setAudioUrl(null);
      return;
    }
    // create a local object URL
    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
    setDidProcess(false);
    setErrorMsg(null);
  };

  // For metadata loaded
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    if (!isNaN(dur) && dur > 0) {
      setDuration(dur);
      // set default endTime to the entire track
      setStartTime(0);
      setEndTime(dur);
    }
  };

  const handleTrim = () => {
    // Validate times
    if (startTime >= endTime) {
      setErrorMsg("Start time must be less than end time.");
      return;
    }
    setErrorMsg(null);
    setIsTrimming(true);
    setDidProcess(false);

    // dummy server call
    setTimeout(() => {
      setIsTrimming(false);
      setDidProcess(true);
    }, 2000);
  };

  const handleClear = () => {
    setErrorMsg(null);
    setDidProcess(false);
    setAudioFile(null);
    setAudioUrl(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
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

      {/* Uploader */}
      <div className="mt-6">
        <GlobalAudioUploader
          didProcess={didProcess}
          onDownloadOne={() => alert("Downloaded (dummy)!")}
          onNewAudio={() => {
            handleNewAudio();
          }}
        />
      </div>

      {/* If we have an audioFile, let's read it from GlobalAudioUploader's internal state.
          In reality, you would connect that with a context or pass in a callback. 
          For demonstration, let's pretend we have a function to handle it. */}
      {/* We'll display the audio only if we have a file. */}
      {audioUrl && (
        <div className="mt-6">
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full max-w-md mx-auto block"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* If we have a duration, show start/end sliders */}
      {audioUrl && duration > 0 && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-full max-w-md flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                // ensure startTime < endTime
                if (val < endTime) {
                  setStartTime(val);
                }
              }}
              className="my-range-slider"
            />
          </div>

          <div className="w-full max-w-md flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                // ensure endTime > startTime
                if (val > startTime) {
                  setEndTime(val);
                }
              }}
              className="my-range-slider"
            />
          </div>

          <style jsx>{`
            .my-range-slider {
              -webkit-appearance: none;
              height: 6px;
              border-radius: 9999px;
              background: linear-gradient(to right, #b3e0ff, #0984e3, #074291);
              outline: none;
              cursor: pointer;
              margin-top: 4px;
            }
            .my-range-slider::-webkit-slider-thumb {
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
            .my-range-slider::-moz-range-thumb {
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

      {/* Action buttons */}
      {audioFile && (
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

          {didProcess && (
            <button
              onClick={() => alert("You could do 'Download Trimmed Audio' if needed.")}
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
      )}
    </div>
  );
}