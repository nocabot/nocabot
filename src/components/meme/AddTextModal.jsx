"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function AddTextModal({ open, onClose, onConfirm }) {
  const [textValue, setTextValue] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("system-ui");

  useEffect(() => {
    if (open) {
      setTextValue("");
      setTextColor("#000000");
      setFontFamily("system-ui");
    }
  }, [open]);

  if (!open) return null;

  const handleDone = () => {
    const trimmed = textValue.trim();
    if (!trimmed) return;
    onConfirm({ text: trimmed, color: textColor, font: fontFamily });
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="
          w-80 rounded-md bg-white dark:bg-gray-800
          p-6 shadow-lg dark:shadow-black/60
          text-gray-800 dark:text-gray-100
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">Add Text</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col text-sm">
            <span>Text:</span>
            <input
              type="text"
              className="
                mt-1 block w-full rounded-md border border-gray-300
                dark:border-gray-700 bg-white dark:bg-gray-900
                px-2 py-1 text-sm
              "
              placeholder="Your meme text..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span>Color:</span>
            <input
              type="color"
              className="mt-1 h-8 w-16 p-0 border-none"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span>Font:</span>
            <select
              className="
                mt-1 block w-full rounded-md border border-gray-300
                dark:border-gray-700 bg-white dark:bg-gray-900
                px-2 py-1 text-sm
              "
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="system-ui">System UI</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1
              text-sm font-semibold text-gray-700 dark:text-gray-100
              hover:bg-gray-300 dark:hover:bg-gray-600
            "
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="
              rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold
              text-white hover:bg-indigo-500
            "
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}