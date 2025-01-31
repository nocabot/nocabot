"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * A global audio context that stores exactly one audio file:
 *   { file: File, url: string } or null if none
 */

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [globalAudio, setGlobalAudio] = useState(null);

  /**
   * Overwrite or clear the global audio
   * If 'file' is null => clear
   */
  const setAudio = (file) => {
    // If we had an existing file, revoke its URL
    if (globalAudio?.url) {
      URL.revokeObjectURL(globalAudio.url);
    }
    if (!file) {
      setGlobalAudio(null);
      return;
    }
    // Create a fresh object URL
    const newUrl = URL.createObjectURL(file);
    setGlobalAudio({ file, url: newUrl });
  };

  const clearAudio = () => {
    if (globalAudio?.url) {
      URL.revokeObjectURL(globalAudio.url);
    }
    setGlobalAudio(null);
  };

  return (
    <AudioContext.Provider value={{ globalAudio, setAudio, clearAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

/** Hook to access the global audio. */
export function useAudioContext() {
  return useContext(AudioContext);
}