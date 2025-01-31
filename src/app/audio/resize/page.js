"use client";

import React, { useState, useRef } from "react";
import { useAudioContext } from "@/context/AudioProvider";
import GlobalAudioUploader from "@/components/ui/GlobalAudioUploader";
import { AUDIO_SERVER_BASE_URL } from "@/config";

export default function AudioResizePage() {
  const { globalAudio } = useAudioContext();

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isTrimming, setIsTrimming] = useState(false);
  const [didTrim, setDidTrim] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);

  const audioRef = useRef(null);

  // Once we load the audio for the first time
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration;
    if (dur && dur > 0) {
      setDuration(dur);
      setStartTime(0);
      setEndTime(dur);
    }
  };

  const handleTrim = async () => {
    if (!globalAudio?.file) {
      setErrorMsg("Please upload an audio file first.");
      return;
    }
    if (startTime >= endTime) {
      setErrorMsg("Start time must be < end time!");
      return;
    }
    setErrorMsg(null);
    setIsTrimming(true);
    setDidTrim(false);
    setProcessedUrl(null);

    try {
      const formData = new FormData();
      formData.append("start_time", String(startTime));
      formData.append("end_time", String(endTime));
      formData.append("files", globalAudio.file);

      const res = await fetch(`${AUDIO_SERVER_BASE_URL}/audio/resize`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (!data.audios || data.audios.length === 0) {
        throw new Error("No trimmed audio returned from server.");
      }

      const b64 = data.audios[0].trimmed_b64;
      const binary = atob(b64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([array], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
      setDidTrim(true);
    } catch (err) {
      setErrorMsg(err.message || "Audio trimming failed.");
    } finally {
      setIsTrimming(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !globalAudio?.file) return;
    const origName = globalAudio.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}_trimmed.mp3`;

    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = newName;
    link.click();
  };

  const handleClearProcessed = () => {
    setErrorMsg(null);
    setProcessedUrl(null);
    setIsTrimming(false);
    setDidTrim(false);
    setStartTime(0);
    setEndTime(0);
    setDuration(0);
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%]
      bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Audio “Resize” (Trim)
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single audio file, pick your start & end times, then trim.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Uploader */}
      <div className="mt-6">
        <GlobalAudioUploader />
      </div>

      {/* Playback + sliders if we have an audio */}
      {globalAudio && (
        <>
          <div className="mt-6 text-center">
            <audio
              ref={audioRef}
              src={globalAudio.url}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full max-w-md mx-auto"
            />
          </div>

          {duration > 0 && (
            <div className="mt-6 flex flex-col items-center gap-4">
              {/* START TIME slider */}
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
                    if (val < endTime) setStartTime(val);
                  }}
                  className="my-trim-slider w-full"
                />
              </div>

              {/* END TIME slider */}
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
                    if (val > startTime) setEndTime(val);
                  }}
                  className="my-trim-slider w-full"
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
        </>
      )}

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleTrim}
          disabled={!globalAudio || isTrimming}
          className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
            !globalAudio || isTrimming
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {isTrimming ? "Trimming..." : "Trim Audio"}
        </button>

        {didTrim && processedUrl && (
          <button
            onClick={handleDownload}
            className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-500"
          >
            Download
          </button>
        )}

        {(didTrim || processedUrl) && (
          <button
            onClick={handleClearProcessed}
            className="rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Clear Processed
          </button>
        )}
      </div>
    </div>
  );
}