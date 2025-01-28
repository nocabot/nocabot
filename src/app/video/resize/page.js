"use client";

import React, { useState, useRef } from "react";
import GlobalVideoUploader from "../../../components/ui/GlobalVideoUploader";

export default function VideoResizePage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const [isTrimming, setIsTrimming] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const videoRef = useRef(null);

  // If hooking to global context, you'd connect it similarly.
  // We'll just show local usage as an example.

  const handleNewVideo = () => {
    setErrorMsg(null);
    setDidProcess(false);
    // We'll get the file from GlobalVideoUploader's single-file
  };

  const setVideo = (file) => {
    if (!file) {
      setVideoFile(null);
      setVideoUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setErrorMsg(null);
    setDidProcess(false);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (!isNaN(dur) && dur > 0) {
      setDuration(dur);
      setStartTime(0);
      setEndTime(dur);
    }
  };

  const handleTrim = () => {
    if (startTime >= endTime) {
      setErrorMsg("Start time must be less than end time.");
      return;
    }
    setErrorMsg(null);
    setIsTrimming(true);
    setDidProcess(false);

    // Spoof server call
    setTimeout(() => {
      setIsTrimming(false);
      setDidProcess(true);
    }, 2000);
  };

  const handleClear = () => {
    setErrorMsg(null);
    setDidProcess(false);
    setVideoFile(null);
    setVideoUrl(null);
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
        Video “Resize” (Trim)
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single video file, pick your start &amp; end times, then trim.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Uploader */}
      <div className="mt-6">
        <GlobalVideoUploader
          didProcess={didProcess}
          onDownloadOne={() => alert("Downloaded (dummy)!")}
          onNewVideo={() => {
            handleNewVideo();
          }}
        />
      </div>

      {/* If we have a videoUrl, show the <video> */}
      {videoUrl && (
        <div className="mt-6 flex justify-center">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            onLoadedMetadata={handleLoadedMetadata}
            className="max-w-full max-h-[400px]"
          >
            Your browser does not support the video element.
          </video>
        </div>
      )}

      {/* Sliders for start/end if we have duration */}
      {videoUrl && duration > 0 && (
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

      {/* Buttons if file is present */}
      {videoFile && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleTrim}
            disabled={isTrimming}
            className="
              rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white
              hover:bg-indigo-500
            "
          >
            {isTrimming ? "Trimming..." : "Trim Video"}
          </button>

          {didProcess && (
            <button
              onClick={() => alert("Download trimmed video (dummy)!")}
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