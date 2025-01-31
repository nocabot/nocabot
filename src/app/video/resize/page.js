"use client";

import React, { useState, useRef, useEffect } from "react";
import { useVideoContext } from "@/context/VideoProvider";
import GlobalVideoUploader from "@/components/ui/GlobalVideoUploader";

export default function VideoResizePage() {
  const { globalVideo } = useVideoContext();

  // Refs + State
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);         // total length
  const [currentTime, setCurrentTime] = useState(0);   // current playback time
  const [isPlaying, setIsPlaying] = useState(false);

  const [startTime, setStartTime] = useState(0);       // user-chosen in-point
  const [endTime, setEndTime] = useState(0);           // user-chosen out-point
  const [isTrimming, setIsTrimming] = useState(false);
  const [didTrim, setDidTrim] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);

  // When metadata is loaded, store duration and default end to full length
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (dur && dur > 0) {
      setDuration(dur);
      setEndTime(dur); // default end is full length
    }
  };

  // Keep track of the current playback time
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  // Play/Pause toggle
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Scrub the timeline => update video currentTime
  const handleScrub = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  // Mark the start (in) point
  const handleSetStart = () => {
    if (currentTime >= endTime) {
      setErrorMsg("Start time must be less than end time!");
      return;
    }
    setErrorMsg(null);
    setStartTime(currentTime);
  };

  // Mark the end (out) point
  const handleSetEnd = () => {
    if (currentTime <= startTime) {
      setErrorMsg("End time must be greater than start time!");
      return;
    }
    setErrorMsg(null);
    setEndTime(currentTime);
  };

  // Fake "Trim" action
  const handleTrim = () => {
    if (!globalVideo?.file) {
      setErrorMsg("Please upload a video first.");
      return;
    }
    if (startTime >= endTime) {
      setErrorMsg("Invalid in/out points.");
      return;
    }
    setErrorMsg(null);
    setIsTrimming(true);
    setDidTrim(false);

    setTimeout(() => {
      setIsTrimming(false);
      setDidTrim(true);
    }, 2000);
  };

  // Clear all states
  const handleClear = () => {
    setErrorMsg(null);
    setIsTrimming(false);
    setDidTrim(false);
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    // If you want to also remove from global context => `clearVideo()`
  };

  // If globalVideo is removed, pause the video
  useEffect(() => {
    if (!globalVideo && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [globalVideo]);

  // Calculate marker positions as percentages
  const startMarkerLeft = duration > 0 ? (startTime / duration) * 100 : 0;
  const endMarkerLeft = duration > 0 ? (endTime / duration) * 100 : 0;

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
        Video Trimmer
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single video, pick your start/end points, then trim.
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

      {/* Show trimmer UI if we have a loaded video */}
      {globalVideo?.url && (
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Video element (no default controls) */}
          <video
            ref={videoRef}
            src={globalVideo.url}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            className="max-w-full max-h-[360px] border border-gray-300 dark:border-gray-700 rounded-md"
            controls={false}
          >
            Your browser does not support video playback.
          </video>

          {/* Playback controls + timeline */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="
                rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white 
                hover:bg-indigo-500
              "
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            {/* Time scrubber + markers */}
            <div className="relative flex flex-col items-center">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Current: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
              </label>
              <div className="relative w-64">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.01}
                  value={currentTime}
                  onChange={handleScrub}
                  className="w-full"
                />
                {/* Start marker */}
                {duration > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-green-600"
                    style={{ left: `${startMarkerLeft}%` }}
                  />
                )}
                {/* End marker */}
                {duration > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-red-600"
                    style={{ left: `${endMarkerLeft}%` }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* In/Out set + Display times + Trim action */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSetStart}
                className="
                  rounded-md bg-gray-200 dark:bg-gray-700 
                  px-4 py-2 text-sm font-semibold 
                  text-gray-700 dark:text-gray-100 
                  hover:bg-gray-300 dark:hover:bg-gray-600
                "
              >
                Set Start (In)
              </button>
              <button
                onClick={handleSetEnd}
                className="
                  rounded-md bg-gray-200 dark:bg-gray-700 
                  px-4 py-2 text-sm font-semibold 
                  text-gray-700 dark:text-gray-100 
                  hover:bg-gray-300 dark:hover:bg-gray-600
                "
              >
                Set End (Out)
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>In:</strong> {startTime.toFixed(2)}s &nbsp;/&nbsp;
              <strong>Out:</strong> {endTime.toFixed(2)}s
            </p>

            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={handleTrim}
                disabled={isTrimming}
                className={`
                  rounded-md px-6 py-2 text-sm font-semibold text-white
                  ${
                    isTrimming
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }
                `}
              >
                {isTrimming ? "Trimming..." : "Trim Video"}
              </button>

              {didTrim && (
                <button
                  onClick={() => alert("Download trimmed result (dummy)!")}
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
        </div>
      )}
    </div>
  );
}