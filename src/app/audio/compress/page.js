"use client";

import React from "react";
import GlobalAudioUploader from "../../../components/ui/GlobalAudioUploader";

export default function AudioCompressPage() {
  console.log("AudioCompressPage rendered!");

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%]
      bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Minimal Audio Compress
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Testing to see if we get “Unexpected EOF”...
      </p>

      <div className="mt-6">
        <GlobalAudioUploader
          didProcess={false}
          onDownloadOne={() => alert("Download")}
          onNewAudio={() => console.log("New Audio Selected")}
        />
      </div>
    </div>
  );
}