"use client";

import React, { useState, useRef } from "react";
import { useImageContext } from "@/context/ImageProvider";
import { REMOVE_BG_SERVER_BASE_URL } from "@/config";
import GlobalUploader from "@/components/ui/GlobalUploader";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function RemoveBGPage() {
  const { globalImages, setGlobalImages, clearAllImages } = useImageContext();

  const [errorMsg, setErrorMsg] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [didProcess, setDidProcess] = useState(false);

  // Reference to an AbortController so we can cancel the fetch
  const abortControllerRef = useRef(null);

  const handleRemoveBgAll = async () => {
    setErrorMsg(null);
    if (globalImages.length === 0) return;

    setDidProcess(false);
    setIsRemoving(true);
    setIsDisabled(true);

    // Create an AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const formData = new FormData();
      globalImages.forEach((img) => {
        formData.append("images", img.file);
      });

      const res = await fetch(`${REMOVE_BG_SERVER_BASE_URL}/remove-bg`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (!data.images) {
        throw new Error("No images returned from server");
      }

      // Convert each returned base64 PNG to a Blob URL
      const updated = globalImages.map((img, idx) => {
        const srv = data.images[idx];
        if (srv?.removed_b64) {
          const binary = atob(srv.removed_b64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "image/png" });
          const newUrl = URL.createObjectURL(blob);

          return {
            ...img,
            url: newUrl,
            file: new File(
              [blob],
              img.file.name.replace(/\.[^/.]+$/, "") + "_bgremoved.png",
              { type: "image/png" }
            ),
          };
        }
        return img;
      });

      setGlobalImages(updated);
      setDidProcess(true);
    } catch (err) {
      // If user clicked "Cancel", we get an AbortError. 
      // We do NOT show an error message in that case
      if (err.name !== "AbortError") {
        let msg = err?.message || "Background removal failed.";
        if (msg.includes("Failed to fetch") || msg.includes("Load failed")) {
          msg = "Could not connect to the server. Please try again later.";
        }
        // Hide the raw HTML for 502 or bad gateway
        if (msg.includes("502") || msg.includes("Bad Gateway") || msg.includes("<html>")) {
          msg = "Server is busy or unreachable. Please try again later.";
        }

        setErrorMsg(msg);
      }
    } finally {
      setIsRemoving(false);
      setIsDisabled(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsRemoving(false);
    setIsDisabled(false);
  };

  const handleDownloadOne = (index) => {
    setErrorMsg(null);
    const img = globalImages[index];
    if (!img) return;

    const origName = img.file.name.replace(/\.[^/.]+$/, "");
    const newName = `${origName}.png`;

    const link = document.createElement("a");
    link.href = img.url;
    link.download = newName;
    link.click();
  };

  const handleDownloadAll = async () => {
    setErrorMsg(null);
    if (!didProcess || globalImages.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("bg_removed_images");

    for (let i = 0; i < globalImages.length; i++) {
      const img = globalImages[i];
      const response = await fetch(img.url);
      const blob = await response.blob();
      const origName = img.file.name.replace(/\.[^/.]+$/, "");
      folder.file(`${origName}.png`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "bg_removed_images.zip");
  };

  const handleClearAll = () => {
    setErrorMsg(null);
    clearAllImages();
    setDidProcess(false);
  };

  // Render text for single/multiple images
  const removeButtonText = isRemoving
    ? globalImages.length === 1
      ? "Removing background..."
      : "Removing backgrounds..."
    : globalImages.length === 1
    ? "Remove Background"
    : "Remove Backgrounds";

  return (
    <div className="relative mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%] bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Remove Background
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Automatically remove backgrounds for up to 5 images.
      </p>

      {errorMsg && (
        <div className="mt-4 text-center text-sm text-red-600">
          {errorMsg}
        </div>
      )}

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
            onClick={handleRemoveBgAll}
            disabled={isDisabled}
            className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
              isDisabled
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {removeButtonText}
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

      {/* Pop-up overlay for removing background */}
      {isRemoving && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md text-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {globalImages.length === 1
                ? "Removing background..."
                : "Removing backgrounds..."}
            </p>

            <div className="mt-6 flex flex-col items-center space-y-4">
              {/* SPINNER */}
              <div className="flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>

              <button
                onClick={handleCancel}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}