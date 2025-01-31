"use client";

import React, { useState } from "react";
import { useAudioContext } from "@/context/AudioProvider";
import GlobalAudioUploader from "@/components/ui/GlobalAudioUploader";
import { AUDIO_SERVER_BASE_URL } from "@/config";

export default function AudioCompressPage() {
  const { globalAudio } = useAudioContext(); // read the single audio from context

  const [sliderValue, setSliderValue] = useState(5);
  const [isCompressing, setIsCompressing] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);

  const handleCompress = async () => {
    if (!globalAudio?.file) {
      setErrorMsg("Please upload an audio file first.");
      return;
    }
    setErrorMsg(null);
    setDidProcess(false);
    setIsCompressing(true);
    setProcessedUrl(null);

    try {
      const formData = new FormData();
      formData.append("compression_level", String(Math.round(sliderValue)));
      formData.append("files", globalAudio.file);

      const res = await fetch(`${AUDIO_SERVER_BASE_URL}/audio/compress`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (!data.audios || data.audios.length === 0) {
        throw new Error("No compressed audio returned from server.");
      }

      const b64 = data.audios[0].compressed_b64;
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
      setErrorMsg(err.message || "Audio compression failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !globalAudio?.file) return;
    const origName = globalAudio.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}_compressed.mp3`;

    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = newName;
    link.click();
  };

  const handleClearProcessed = () => {
    setErrorMsg(null);
    setProcessedUrl(null);
    setIsCompressing(false);
    setDidProcess(false);
    setSliderValue(5);
  };

  return (
    <div className="
      mx-auto mt-10 mb-10 w-full
      sm:w-[95%] md:w-[85%]
      bg-white dark:bg-gray-800
      p-12 rounded-md shadow
      font-sans
    ">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Audio Compress
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single audio file, adjust compression, then compress.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Slider */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex w-full max-w-sm items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Min</span>
          <input
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={sliderValue}
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            className="my-audio-slider w-full"
          />
          <span>Max</span>
        </div>
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

      {/* GlobalAudioUploader */}
      <div className="mt-6">
        <GlobalAudioUploader />
      </div>

      {/* If there's a file, show a playback bar below */}
      {globalAudio && (
        <div className="mt-6 text-center">
          <audio src={globalAudio.url} controls className="w-full max-w-md mx-auto" />
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleCompress}
          disabled={!globalAudio || isCompressing}
          className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
            isCompressing || !globalAudio
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {isCompressing ? "Compressing..." : "Compress"}
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
            className="rounded-md bg-gray-300 dark:bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Clear Processed
          </button>
        )}
      </div>
    </div>
  );
}