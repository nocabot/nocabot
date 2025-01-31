"use client";

import React, { useState } from "react";
import { useImageContext } from "@/context/ImageProvider";
import { SERVER_BASE_URL } from "@/config";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import GlobalUploader from "@/components/ui/GlobalUploader";

export default function CompressPage() {
  const { globalImages, setGlobalImages, clearAllImages } = useImageContext();

  const [sliderValue, setSliderValue] = useState(5);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCompressAll = async () => {
    setErrorMsg(null);

    if (globalImages.length === 0) return;
    setDidProcess(false);
    setIsCompressing(true);
    setIsDisabled(true);

    // Re-enable button after a short delay to prevent double-click spam
    setTimeout(() => setIsDisabled(false), 3000);

    try {
      const formData = new FormData();
      formData.append("compression_level", Math.round(sliderValue).toString());
      globalImages.forEach((img) => formData.append("images", img.file));

      const res = await fetch(`${SERVER_BASE_URL}/compress`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
      const data = await res.json();
      if (!data.images) {
        throw new Error("No images returned from server");
      }

      // Update images with compressed versions
      const updated = globalImages.map((img, idx) => {
        const srv = data.images[idx];
        if (srv?.compressed_b64) {
          const binary = atob(srv.compressed_b64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "image/jpeg" });
          const newUrl = URL.createObjectURL(blob);

          return {
            ...img,
            url: newUrl,
            file: new File([blob], img.file.name, { type: "image/jpeg" }),
          };
        }
        return img;
      });

      setGlobalImages(updated);
      setDidProcess(true);
    } catch (err) {
      let msg = err?.message || "Compression failed.";
      if (msg.includes("Failed to fetch") || msg.includes("Load failed")) {
        msg = "Could not connect to server. Please try again later.";
      }
      setErrorMsg(msg);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownloadOne = (index) => {
    setErrorMsg(null);
    const img = globalImages[index];
    if (!img) return;
    const origName = img.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}_compressed.jpg`;

    const link = document.createElement("a");
    link.href = img.url;
    link.download = newName;
    link.click();
  };

  const handleDownloadAll = async () => {
    setErrorMsg(null);
    if (!didProcess || globalImages.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("compressed_images");

    for (let i = 0; i < globalImages.length; i++) {
      const img = globalImages[i];
      const response = await fetch(img.url);
      const blob = await response.blob();
      const origName = img.file.name.replace(/\.[^/.]+$/, "");
      folder.file(`${origName}_compressed.jpg`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "compressed_images.zip");
  };

  const handleClearAll = () => {
    setErrorMsg(null);
    clearAllImages();
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%] bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Compress Images
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload up to 5 images, adjust the slider, then compress.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600">{errorMsg}</div>
      )}

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex w-full max-w-sm items-center justify-between px-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <span>Smaller file size</span>
          <span>Larger file size</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={0.1}
          value={sliderValue}
          onChange={(e) => setSliderValue(parseFloat(e.target.value))}
          className="my-slider w-full max-w-sm"
        />
        <style jsx>{`
          .my-slider {
            -webkit-appearance: none;
            height: 8px;
            border-radius: 9999px;
            background: linear-gradient(to right, #b3e0ff, #0984e3, #074291);
            outline: none;
            cursor: pointer;
          }
          .my-slider::-webkit-slider-thumb {
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
          .my-slider::-moz-range-thumb {
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

      <div className="mt-6">
        <GlobalUploader
          didProcess={didProcess}
          onDownloadOne={handleDownloadOne}
          onNewImages={() => {
            setErrorMsg(null);
            setDidProcess(false);
          }}
        />
      </div>

      {globalImages.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleCompressAll}
            disabled={isDisabled}
            className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
              isDisabled
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isCompressing
              ? "Compressing..."
              : globalImages.length === 1
              ? "Compress"
              : "Compress All"}
          </button>

          {didProcess && (
            <button
              onClick={handleDownloadAll}
              className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-500"
            >
              Download All
            </button>
          )}

          <button
            onClick={handleClearAll}
            className="rounded-md bg-gray-300 dark:bg-gray-600 px-6 py-2 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}