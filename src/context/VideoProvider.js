"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * Holds a single "globalVideo" object:
 *   { file: File, url: string }
 * so that uploading a video on one page keeps it for other video pages.
 */
const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [globalVideo, setGlobalVideo] = useState(null);

  // Called when user selects/drops a new video
  const setVideo = (file) => {
    setGlobalVideo({
      file,
      url: URL.createObjectURL(file),
    });
  };

  // Clears out the stored video
  const clearVideo = () => {
    setGlobalVideo(null);
  };

  return (
    <VideoContext.Provider value={{ globalVideo, setVideo, clearVideo }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  return useContext(VideoContext);
}