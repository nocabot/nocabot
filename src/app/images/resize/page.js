// src/app/resize/page.js
"use client";

import React, { useState } from "react";
import { useImageContext } from "@/context/ImageProvider";
import GlobalUploader from "@/components/ui/GlobalUploader";
import { SERVER_BASE_URL } from "@/config";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Switch } from "@headlessui/react";

export default function ResizePage() {
  const { globalImages, setGlobalImages, clearAllImages } = useImageContext();

  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [locked, setLocked] = useState(true);
  const [ratio, setRatio] = useState(0.75);

  const [isResizing, setIsResizing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [didProcess, setDidProcess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const onChangeWidth = (val) => {
    const newW = parseInt(val || 0, 10);
    setWidth(newW);
    if (locked && newW > 0) {
      setHeight(Math.round(newW * ratio));
    }
  };

  const onChangeHeight = (val) => {
    const newH = parseInt(val || 0, 10);
    setHeight(newH);
    if (locked && newH > 0) {
      setWidth(Math.round(newH / ratio));
    }
  };

  const handleToggleLock = (checked) => {
    setLocked(checked);
    if (checked && width > 0) {
      setRatio(height / width);
    }
  };

  const handleResizeAll = async () => {
    // Clear error message when pressing the main action
    setErrorMsg(null);

    if (globalImages.length === 0) return;
    if (width < 1 || height < 1) {
      setErrorMsg("Width and Height must be greater than 0.");
      return;
    }
    setIsResizing(true);
    setDidProcess(false);

    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 3000);

    try {
      const formData = new FormData();
      formData.append("width", width.toString());
      formData.append("height", height.toString());
      globalImages.forEach((img) => {
        formData.append("images", img.file);
      });

      const res = await fetch(`${SERVER_BASE_URL}/resize`, {
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
        if (srv?.resized_b64) {
          const binary = atob(srv.resized_b64);
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
      let msg = err?.message || "Resize failed.";
      if (msg.includes("Failed to fetch") || msg.includes("Load failed")) {
        msg = "Could not connect to server. Please try again later.";
      }
      setErrorMsg(msg);
    } finally {
      setIsResizing(false);
    }
  };

  const handleDownloadOne = (index) => {
    setErrorMsg(null); // Clear error if any
    const img = globalImages[index];
    if (!img) return;
    const origName = img.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}_resized.jpg`;

    const link = document.createElement("a");
    link.href = img.url;
    link.download = newName;
    link.click();
  };

  const handleDownloadAll = async () => {
    setErrorMsg(null); // Clear error if any
    if (!didProcess || globalImages.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("resized_images");

    for (let i = 0; i < globalImages.length; i++) {
      const img = globalImages[i];
      const response = await fetch(img.url);
      const blob = await response.blob();
      const origName = img.file.name.replace(/\.[^/.]+$/, "");
      folder.file(`${origName}_resized.jpg`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "resized_images.zip");
  };

  const handleClearAll = () => {
    setErrorMsg(null);
    clearAllImages();
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%] bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Resize Images
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Set the width and height (lock ratio if you like), then resize them.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600">{errorMsg}</div>
      )}

      <div className="mt-6 flex flex-row flex-nowrap items-center justify-center gap-6">
        {/* Width */}
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <span className="font-medium mb-1 text-center">Width</span>
          <input
            type="number"
            value={width}
            onChange={(e) => onChangeWidth(e.target.value)}
            className="block w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-center text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>

        {/* Height */}
        <label className="flex flex-col text-sm text-gray-700 dark:text-gray-200">
          <span className="font-medium mb-1 text-center">Height</span>
          <input
            type="number"
            value={height}
            onChange={(e) => onChangeHeight(e.target.value)}
            className="block w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-center text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>

        {/* Lock ratio */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Lock Ratio
          </span>
          <Switch
            checked={locked}
            onChange={handleToggleLock}
            className={`${
              locked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-500"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                locked ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleResizeAll}
            disabled={isDisabled}
            className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
              isDisabled
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isResizing
              ? "Resizing..."
              : globalImages.length === 1
              ? "Resize"
              : "Resize All"}
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