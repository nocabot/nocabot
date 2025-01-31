"use client";

import React, { useState } from "react";
import { useAudioContext } from "@/context/AudioProvider";
import GlobalAudioUploader from "@/components/ui/GlobalAudioUploader";
import { AUDIO_SERVER_BASE_URL } from "@/config";

export default function AudioFrequencyPage() {
  const { globalAudio } = useAudioContext();

  const [frequency, setFrequency] = useState(440);
  const [isApplying, setIsApplying] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);

  const handleApplyFrequency = async () => {
    if (!globalAudio?.file) {
      setErrorMsg("Please upload an audio file first.");
      return;
    }
    setErrorMsg(null);
    setIsApplying(true);
    setDidProcess(false);
    setProcessedUrl(null);

    try {
      const formData = new FormData();
      formData.append("frequency", String(frequency));
      formData.append("files", globalAudio.file);

      const res = await fetch(`${AUDIO_SERVER_BASE_URL}/audio/frequency`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (!data.audios || data.audios.length === 0) {
        throw new Error("No frequency-adjusted audio returned from server.");
      }

      const b64 = data.audios[0].frequency_b64;
      const binary = atob(b64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([array], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
      setDidProcess(true);
    } catch (err) {
      setErrorMsg(err.message || "Frequency application failed.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !globalAudio?.file) return;
    const origName = globalAudio.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}_freq.mp3`;

    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = newName;
    link.click();
  };

  const handleClearProcessed = () => {
    setErrorMsg(null);
    setIsApplying(false);
    setDidProcess(false);
    setProcessedUrl(null);
    setFrequency(440);
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%]
      bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans"
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

      {/* Uploader */}
      <div className="mt-6">
        <GlobalAudioUploader />
      </div>

      {/* Playback if we have a file */}
      {globalAudio && (
        <div className="mt-6 text-center">
          <audio src={globalAudio.url} controls className="w-full max-w-md mx-auto" />
        </div>
      )}

      {/* Frequency slider if we have a file */}
      {globalAudio && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Frequency: {frequency} Hz
          </label>
          <div className="flex w-full max-w-sm items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>20 Hz</span>
            <input
              type="range"
              min={20}
              max={20000}
              step={50}
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
              className="my-freq-slider w-full"
            />
            <span>20k Hz</span>
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
      )}

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleApplyFrequency}
          disabled={!globalAudio || isApplying}
          className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
            !globalAudio || isApplying
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {isApplying ? "Applying..." : "Apply Frequency"}
        </button>

        {didProcess && processedUrl && (
          <button
            onClick={handleDownload}
            className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-500"
          >
            Download
          </button>
        )}

        {(didProcess || processedUrl) && (
          <button
            onClick={handleClearProcessed}
            className="rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold
                       text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Clear Processed
          </button>
        )}
      </div>
    </div>
  );
}