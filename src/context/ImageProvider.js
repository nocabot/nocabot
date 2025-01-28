"use client";

import React, { createContext, useContext, useState } from "react";

// This context will hold a global array of images, just the "raw" info:
//   { file: File, url: string }
// We won't store "compressedUrl", "convertedUrl", etc. in here—
// that will be local state on each page. This way, whenever you navigate
// to a new page, you can re-initialize that page’s local states from these
// raw images (so they appear as if newly uploaded).

const ImageContext = createContext();

export function ImageProvider({ children }) {
  // Global list of images that persist when navigating:
  // These are just "file" & "url".
  const [globalImages, setGlobalImages] = useState([]);

  // Helper to add images (limited to 5).
  const addImages = (files) => {
    // Convert each File to { file, url }:
    const newItems = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    // Combine with existing:
    const combined = [...globalImages, ...newItems];
    // Slice to max 5
    if (combined.length > 5) {
      alert("We only accept up to 5 images at a time.");
    }
    setGlobalImages(combined.slice(0, 5));
  };

  // Remove one image by index
  const removeImage = (index) => {
    const updated = globalImages.filter((_, i) => i !== index);
    setGlobalImages(updated);
  };

  // Clear all images
  const clearAllImages = () => {
    setGlobalImages([]);
  };

  return (
    <ImageContext.Provider
      value={{
        globalImages,
        addImages,
        removeImage,
        clearAllImages,
        setGlobalImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext() {
  return useContext(ImageContext);
}