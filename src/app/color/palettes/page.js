"use client";

import React, { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/20/solid";

/**
 * 10 categories, each with 16 colors.
 * The user must select a theme from a dropdown to see the squares.
 */

const CATEGORIES = [
  {
    name: "Autumn",
    colors: [
      "#8B4513","#CD853F","#D2691E","#FF7F50","#F4A460","#C04000","#DC143C","#B22222",
      "#AE6707","#DB8745","#F6A162","#B63A10","#5F2500","#E57A3C","#FFC49B","#FFA500",
    ],
  },
  {
    name: "Spring",
    colors: [
      "#FFC0CB","#FFD700","#7FFFD4","#ADFF2F","#FFA07A","#BA55D3","#40E0D0","#98FB98",
      "#F5F5DC","#FFDAB9","#FDBCB4","#D8BFD8","#E6E6FA","#FFFACD","#FFE4E1","#FFF8DC",
    ],
  },
  {
    name: "Summer",
    colors: [
      "#00BFFF","#FF6347","#FFDAB9","#4682B4","#87CEFA","#20B2AA","#FFA500","#FFFACD",
      "#FFBF00","#F9844A","#FC5A8D","#FFB7C5","#BFDCFE","#E0E5FF","#009FFF","#00FA9A",
    ],
  },
  {
    name: "Power",
    colors: [
      "#FF0000","#FF8C00","#FFEE00","#01FF00","#00F7FF","#012FFF","#9A00FF","#FF00CD",
      "#FF1493","#FF4500","#FF69B4","#7FFF00","#7FFFD4","#0000FF","#D300FF","#FF00FF",
    ],
  },
  {
    name: "Pastel",
    colors: [
      "#FFB5E8","#FFCBC1","#C7CEEA","#B5EAD7","#E2F0CB","#FBE4F0","#F3C7F1","#CDEFFF",
      "#EFD0FF","#FFD1DC","#FFD8BE","#FCF4A3","#E0BBE4","#FDE2E4","#BEE7E8","#C6F1D6",
    ],
  },
  {
    name: "Vibrant",
    colors: [
      "#E53935","#D81B60","#8E24AA","#5E35B1","#3949AB","#1E88E5","#43A047","#FDD835",
      "#FF6F00","#F4511E","#FB8C00","#FF5252","#E040FB","#7C4DFF","#2196F3","#4CAF50",
    ],
  },
  {
    name: "Earth",
    colors: [
      "#A0522D","#CD853F","#F4A460","#DEB887","#556B2F","#6B8E23","#808000","#8F9779",
      "#8B4513","#5F2500","#7F6A4C","#7D7F2A","#C9D179","#4E3B24","#765C48","#6F7760",
    ],
  },
  {
    name: "Neon",
    colors: [
      "#39FF14","#CCFF00","#FFEA00","#FF9100","#FF3131","#FF6EC7","#FF00BF","#9400FF",
      "#01F9C6","#D0FF14","#FBFF00","#FF8ED6","#FB36FF","#FAED27","#7DF9FF","#E1FF00",
    ],
  },
  {
    name: "Twilight",
    colors: [
      "#0F0524","#2D1B4A","#2B1934","#542E71","#7668A6","#8960AB","#9E5A63","#B8C5D6",
      "#3B2E5A","#534B8F","#1C0C34","#35063E","#2A213A","#432C53","#4A3C5C","#7E5E60",
    ],
  },
  {
    name: "Minimalist",
    colors: [
      "#FFFFFF","#F2F2F2","#DFDFDF","#C7C7C7","#B0B0B0","#999999","#666666","#2F2F2F",
      "#BEBEBE","#F8F8F8","#B5B5B5","#D5D5D5","#E8E8E8","#CCCCCC","#919191","#7D7D7D",
    ],
  },
];

export default function PalettesPage() {
  // The user must pick a theme first; default is empty => no display
  const [selectedCategory, setSelectedCategory] = useState("");
  const [copiedColor, setCopiedColor] = useState(null);

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 1500);
    });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const currentCategory = CATEGORIES.find((cat) => cat.name === selectedCategory);

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%] bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans">
      {/* TITLE / SUBTITLE */}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Color Palettes
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Explore curated palettes by theme. Click any swatch to copy its color.
      </p>

      {/* THEME DROPDOWN */}
      <div className="mt-6 flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Select a theme:
        </label>
        <select
          className="
            mt-2 block w-60 rounded-md border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm
            focus:outline-none focus:ring-1 focus:ring-blue-500
            dark:text-gray-100
          "
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">-- Pick a theme --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* SHOW SWATCHES ONLY IF A CATEGORY IS SELECTED */}
      {currentCategory && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
          {currentCategory.colors.map((color) => {
            const isCopied = color === copiedColor;
            return (
              <div
                key={color}
                onClick={() => handleCopy(color)}
                className="
                  relative flex h-20 cursor-pointer items-center justify-center
                  rounded-md border border-gray-200 dark:border-gray-700 p-3
                  hover:shadow-md transition
                "
                style={{ backgroundColor: color }}
              >
                <div
                  className="
                    absolute top-1 right-1 p-1 rounded-full
                    bg-white/60 dark:bg-black/40
                  "
                >
                  {isCopied ? (
                    <CheckIcon className="h-4 w-4 text-green-700 dark:text-green-200" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4 text-gray-800 dark:text-gray-200" />
                  )}
                </div>
                <span className="text-sm font-medium" style={{ color: getContrastYIQ(color) }}>
                  {color}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* COPIED TOAST */}
      {copiedColor && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white py-1 px-3 rounded-md z-50">
          Copied {copiedColor}
        </div>
      )}
    </div>
  );
}

// Black/white contrast function
function getContrastYIQ(hexColor) {
  let c = hexColor.replace("#", "");
  if (c.length === 3) {
    c = c[0]+c[0] + c[1]+c[1] + c[2]+c[2];
  }
  const r = parseInt(c.substring(0,2),16);
  const g = parseInt(c.substring(2,4),16);
  const b = parseInt(c.substring(4,6),16);

  const yiq = (r*299 + g*587 + b*114) / 1000;
  return (yiq >= 128) ? "#000" : "#fff";
}