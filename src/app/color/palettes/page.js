"use client";

import React, { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/20/solid";

/**
 * 10 category “themes”, each with 8 colors.
 * You can edit the colors to your liking.
 */
const CATEGORIES = [
  {
    name: "Autumn",
    colors: ["#8B4513", "#CD853F", "#D2691E", "#FF7F50", "#F4A460", "#C04000", "#DC143C", "#B22222"],
  },
  {
    name: "Spring",
    colors: ["#FFC0CB", "#FFD700", "#7FFFD4", "#ADFF2F", "#FFA07A", "#BA55D3", "#40E0D0", "#98FB98"],
  },
  {
    name: "Summer",
    colors: ["#00BFFF", "#FF6347", "#FFDAB9", "#4682B4", "#87CEFA", "#20B2AA", "#FFA500", "#FFFACD"],
  },
  {
    name: "Power",
    colors: ["#FF0000", "#FF8C00", "#FFEE00", "#01FF00", "#00F7FF", "#012FFF", "#9A00FF", "#FF00CD"],
  },
  {
    name: "Pastel",
    colors: ["#FFB5E8", "#FFCBC1", "#C7CEEA", "#B5EAD7", "#E2F0CB", "#FBE4F0", "#F3C7F1", "#CDEFFF"],
  },
  {
    name: "Vibrant",
    colors: ["#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#43A047", "#FDD835"],
  },
  {
    name: "Earth",
    colors: ["#A0522D", "#CD853F", "#F4A460", "#DEB887", "#556B2F", "#6B8E23", "#808000", "#8F9779"],
  },
  {
    name: "Neon",
    colors: ["#39FF14", "#CCFF00", "#FFEA00", "#FF9100", "#FF3131", "#FF6EC7", "#FF00BF", "#9400FF"],
  },
  {
    name: "Twilight",
    colors: ["#0F0524", "#2D1B4A", "#2B1934", "#542E71", "#7668A6", "#8960AB", "#9E5A63", "#B8C5D6"],
  },
  {
    name: "Minimalist",
    colors: ["#FFFFFF", "#F2F2F2", "#DFDFDF", "#C7C7C7", "#B0B0B0", "#999999", "#666666", "#2F2F2F"],
  },
];

export default function PalettesPage() {
  // The current category selected
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  // For ephemeral “Copied!” feedback
  const [copiedColor, setCopiedColor] = useState(null);

  // Handle copying a color to clipboard
  const handleCopy = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 1500);
    });
  };

  // Called when user changes the dropdown
  const handleCategoryChange = (e) => {
    const newCatName = e.target.value;
    const found = CATEGORIES.find((cat) => cat.name === newCatName);
    setSelectedCategory(found || CATEGORIES[0]);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Color Palettes</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Explore curated palettes by theme. Click any swatch to copy its color.
      </p>

      {/* Theme dropdown */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Select a theme:
        </label>
        <select
          className="
            mt-1 block w-60 rounded-md border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm
            focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-gray-100
          "
          value={selectedCategory.name}
          onChange={handleCategoryChange}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Swatches */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
        {selectedCategory.colors.map((color) => {
          const isCopied = color === copiedColor;

          return (
            <div
              key={color}
              onClick={() => handleCopy(color)}
              className="
                group relative flex h-20 cursor-pointer items-center justify-center
                rounded-md border border-gray-200 dark:border-gray-700 p-3
                hover:shadow-md transition
              "
              style={{ backgroundColor: color }}
            >
              {/* Copy icon in top-right */}
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

              {/* Color text in center, black/white for contrast */}
              <span className="text-sm font-medium" style={{ color: getContrastYIQ(color) }}>
                {color}
              </span>
            </div>
          );
        })}
      </div>

      {/* Copied toast */}
      {copiedColor && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white py-1 px-3 rounded-md z-50">
          Copied {copiedColor}
        </div>
      )}
    </div>
  );
}

/** 
 * Decide whether to render text as black or white, 
 * based on color brightness 
 */
function getContrastYIQ(hexColor) {
  let c = hexColor.replace("#", "");
  if (c.length === 3) {
    c = c[0]+c[0] + c[1]+c[1] + c[2]+c[2]; // expand #abc => #aabbcc
  }
  const r = parseInt(c.substring(0,2),16);
  const g = parseInt(c.substring(2,4),16);
  const b = parseInt(c.substring(4,6),16);

  const yiq = (r*299 + g*587 + b*114) / 1000;
  return (yiq >= 128) ? "#000" : "#fff";
}