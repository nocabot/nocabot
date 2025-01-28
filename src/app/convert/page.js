// src/app/convert/page.js
"use client";

import React, { useState } from "react";
import { useImageContext } from "@/context/ImageProvider";
import GlobalUploader from "@/components/ui/GlobalUploader";
import { SERVER_BASE_URL } from "@/config";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ConvertPage() {
  const { globalImages, setGlobalImages, clearAllImages } = useImageContext();
  const [targetFormat, setTargetFormat] = useState("png");
  const [isConverting, setIsConverting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleConvertAll = async () => {
    setErrorMsg(null);

    if (globalImages.length === 0) return;
    setIsConverting(true);
    setDidProcess(false);

    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 3000);

    try {
      const formData = new FormData();
      formData.append("target_format", targetFormat);
      globalImages.forEach((img) => formData.append("images", img.file));

      const res = await fetch(`${SERVER_BASE_URL}/convert`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
      const data = await res.json();
      if (!data.images) {
        throw new Error("No images returned from server.");
      }

      const updated = globalImages.map((img, idx) => {
        const srv = data.images[idx];
        if (srv?.converted_b64) {
          const binary = atob(srv.converted_b64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: `image/${targetFormat}` });
          const newUrl = URL.createObjectURL(blob);

          return {
            ...img,
            url: newUrl,
            file: new File([blob], img.file.name, {
              type: `image/${targetFormat}`,
            }),
          };
        }
        return img;
      });

      setGlobalImages(updated);
      setDidProcess(true);
    } catch (err) {
      let msg = err?.message || "Conversion failed.";
      if (msg.includes("Failed to fetch") || msg.includes("Load failed")) {
        msg = "Could not connect to server. Please try again later.";
      }
      setErrorMsg(msg);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadOne = (index) => {
    setErrorMsg(null);
    const img = globalImages[index];
    if (!img) return;
    const origName = img.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}_converted.${targetFormat}`;

    const link = document.createElement("a");
    link.href = img.url;
    link.download = newName;
    link.click();
  };

  const handleDownloadAll = async () => {
    setErrorMsg(null);
    if (!didProcess || globalImages.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("converted_images");

    for (let i = 0; i < globalImages.length; i++) {
      const img = globalImages[i];
      const response = await fetch(img.url);
      const blob = await response.blob();
      const origName = img.file.name.replace(/\.[^/.]+$/, "");
      folder.file(`${origName}_converted.${targetFormat}`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "converted_images.zip");
  };

  const handleClearAll = () => {
    setErrorMsg(null);
    clearAllImages();
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%] bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Convert Images
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Upload up to 5 images and choose a new format to convert them.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600">{errorMsg}</div>
      )}

      <div className="mt-6 flex justify-center">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Convert to:
          <select
            value={targetFormat}
            onChange={(e) => {
              setTargetFormat(e.target.value);
              setDidProcess(false);
              setErrorMsg(null);
            }}
            className="
              rounded-md border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              px-3 py-1 text-sm shadow-sm
              font-sans                 /* Force your Geist or default sans */
            "
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="gif">GIF</option>
            <option value="webp">WEBP</option>
            <option value="bmp">BMP</option>
            <option value="tiff">TIFF</option>
          </select>
        </label>
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
            onClick={handleConvertAll}
            disabled={isDisabled}
            className={`
              rounded-md px-6 py-2 text-sm font-semibold text-white
              ${
                isDisabled
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }
            `}
          >
            {isConverting
              ? "Converting..."
              : globalImages.length === 1
              ? "Convert"
              : "Convert All"}
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