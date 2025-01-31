"use client";

import React, { useState } from "react";
import { useAudioContext } from "@/context/AudioProvider";
import GlobalAudioUploader from "@/components/ui/GlobalAudioUploader";
import { AUDIO_SERVER_BASE_URL } from "@/config";

export default function AudioConvertPage() {
  const { globalAudio } = useAudioContext();

  const [targetFormat, setTargetFormat] = useState("mp3");
  const [isConverting, setIsConverting] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);

  const handleConvert = async () => {
    if (!globalAudio?.file) {
      setErrorMsg("Please upload an audio file first.");
      return;
    }
    setErrorMsg(null);
    setDidProcess(false);
    setIsConverting(true);
    setProcessedUrl(null);

    try {
      const formData = new FormData();
      formData.append("target_format", targetFormat);
      formData.append("files", globalAudio.file);

      const res = await fetch(`${AUDIO_SERVER_BASE_URL}/audio/convert`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (!data.audios || data.audios.length === 0) {
        throw new Error("No converted audio returned from server.");
      }

      const b64 = data.audios[0].converted_b64;
      const binary = atob(b64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      // Basic guess for mime type
      let mimeType = "audio/mpeg";
      if (targetFormat === "wav") mimeType = "audio/wav";
      else if (targetFormat === "ogg") mimeType = "audio/ogg";
      else if (targetFormat === "flac") mimeType = "audio/flac";
      else if (targetFormat === "aac") mimeType = "audio/aac";

      const blob = new Blob([array], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);

      setDidProcess(true);
    } catch (err) {
      setErrorMsg(err.message || "Audio conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !globalAudio?.file) return;
    const origName = globalAudio.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}_converted.${targetFormat}`;

    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = newName;
    link.click();
  };

  const handleClearProcessed = () => {
    setErrorMsg(null);
    setProcessedUrl(null);
    setIsConverting(false);
    setDidProcess(false);
    setTargetFormat("mp3");
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%]
      bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Audio Convert
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload a single audio file, choose a new format, then convert.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Format dropdown */}
      <div className="mt-6 flex items-center justify-center">
        <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Convert to:
        </label>
        <select
          value={targetFormat}
          onChange={(e) => {
            setTargetFormat(e.target.value);
            setDidProcess(false);
            setErrorMsg(null);
            setProcessedUrl(null);
          }}
          className="
            rounded-md border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700
            px-3 py-1 text-sm shadow-sm
            text-gray-800 dark:text-gray-100
          "
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
          <option value="ogg">OGG</option>
          <option value="flac">FLAC</option>
          <option value="aac">AAC</option>
        </select>
      </div>

      {/* Uploader */}
      <div className="mt-6">
        <GlobalAudioUploader />
      </div>

      {globalAudio && (
        <div className="mt-6 text-center">
          <audio src={globalAudio.url} controls className="w-full max-w-md mx-auto" />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleConvert}
          disabled={!globalAudio || isConverting}
          className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
            !globalAudio || isConverting
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {isConverting ? "Converting..." : "Convert Audio"}
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