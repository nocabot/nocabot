"use client";

import React, { useState } from "react";
import { Switch } from "@headlessui/react";

// Example color variation tool, with no separate scroll container
export default function VariationsPage() {
  // "hex" or "rgb"
  const [mode, setMode] = useState("hex");

  // Hex color (without #)
  const [hexValue, setHexValue] = useState("3498db");
  // RGB color
  const [rgbValues, setRgbValues] = useState({ r: 52, g: 152, b: 219 });

  // The generated array of color strings
  const [colors, setColors] = useState([]);

  // Error for invalid input
  const [error, setError] = useState("");

  // For ephemeral “Copied!” popup
  const [copiedMessage, setCopiedMessage] = useState(null);

  const handleCopy = (colStr) => {
    navigator.clipboard.writeText(colStr).then(() => {
      setCopiedMessage(`Copied ${colStr}`);
      setTimeout(() => setCopiedMessage(null), 1500);
    });
  };

  const handleGenerate = () => {
    setError("");
    setColors([]);

    // Validate & parse to HSL
    let baseHsl;
    if (mode === "hex") {
      // Must be 3 or 6 hex digits
      if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexValue)) {
        setError("Invalid hex color. Use 3 or 6 hex digits (no #).");
        return;
      }
      try {
        baseHsl = hexToHSL("#" + hexValue);
        if (isNaN(baseHsl.h) || isNaN(baseHsl.s) || isNaN(baseHsl.l)) {
          setError("Invalid hex color. Please try again.");
          return;
        }
      } catch (e) {
        setError("Invalid hex color. Please try again.");
        return;
      }
    } else {
      // RGB mode
      const { r, g, b } = rgbValues;
      if (
        [r, g, b].some(
          (val) => isNaN(val) || val < 0 || val > 255
        )
      ) {
        setError("Invalid RGB: each must be 0–255.");
        return;
      }
      baseHsl = rgbToHSL(r, g, b);
      if (isNaN(baseHsl.h) || isNaN(baseHsl.s) || isNaN(baseHsl.l)) {
        setError("Invalid RGB color. Please try again.");
        return;
      }
    }

    // Generate up to 20 distinct L values in steps of 5, ensuring user color is included
    const allLightness = [];
    for (let l = 0; l <= 100; l += 5) {
      allLightness.push(l);
    }
    // Insert user color's L if missing
    if (!allLightness.includes(baseHsl.l)) {
      allLightness.push(baseHsl.l);
    }
    // Remove duplicates, sort ascending
    const unique = Array.from(new Set(allLightness)).sort((a, b) => a - b);

    // Trim to 20 by removing from whichever side is furthest from user’s L
    while (unique.length > 20) {
      const distLeft = Math.abs(unique[0] - baseHsl.l);
      const distRight = Math.abs(unique[unique.length - 1] - baseHsl.l);
      if (distLeft > distRight) {
        unique.shift();
      } else {
        unique.pop();
      }
    }

    // Convert each L => color string
    const finalColors = unique.map((L) => {
      if (mode === "hex") {
        return hslToHex(baseHsl.h, baseHsl.s, L);
      } else {
        const { r, g, b } = hslToRgb(baseHsl.h, baseHsl.s, L);
        return `rgb(${r}, ${g}, ${b})`;
      }
    });

    setColors(finalColors);
  };

  const handleClear = () => {
    setError("");
    setColors([]);
  };

  return (
    <div className="mx-auto mt-10 mb-10 w-full sm:w-[95%] md:w-[85%] bg-white dark:bg-gray-800 p-12 rounded-md shadow font-sans">
      {/* TITLE / SUBTITLE */}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Color Variations
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        Enter a base color in Hex or RGB, then generate distinct shades. Click any swatch to copy.
      </p>

      {/* ERROR MSG */}
      {error && (
        <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* MODE TOGGLE */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">HEX</span>
        <Switch
          checked={mode === "rgb"}
          onChange={(val) => setMode(val ? "rgb" : "hex")}
          className={`${
            mode === "rgb" ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span
            className={`${
              mode === "rgb" ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">RGB</span>
      </div>

      {/* INPUTS */}
      <div className="mt-6 flex flex-col items-center">
        {mode === "hex" ? (
          <div className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-200">
            <label>Hex Color:</label>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-semibold">#</span>
              <input
                type="text"
                value={hexValue}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "");
                  setHexValue(val.slice(0, 6));
                }}
                className="block w-36 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-blue-500"
                placeholder="3498db"
              />
            </div>
            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              3 or 6 hex digits (no “#”)
            </span>
          </div>
        ) : (
          <div className="flex gap-4">
            {["r", "g", "b"].map((c) => (
              <div
                key={c}
                className="flex flex-col text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <label>{c.toUpperCase()}:</label>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgbValues[c]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value || "0", 10);
                    if (!isNaN(val) && val >= 0 && val <= 255) {
                      setRgbValues((prev) => ({ ...prev, [c]: val }));
                    }
                  }}
                  className="mt-1 w-20 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm shadow-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={handleGenerate}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Generate
        </button>
        <button
          onClick={handleClear}
          className="rounded-md bg-gray-300 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* COLOR SWATCHES (no separate scroll container) */}
      {colors.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {colors.map((colStr) => (
            <div
              key={colStr}
              onClick={() => handleCopy(colStr)}
              className="
                relative cursor-pointer rounded-md border border-gray-200 dark:border-gray-600
                shadow-sm p-3 flex items-center justify-center text-sm font-medium
                hover:shadow-md transition
              "
              style={{ backgroundColor: colStr }}
            >
              <span style={{ color: getContrastYIQ(colStr) }}>{colStr}</span>
            </div>
          ))}
        </div>
      )}

      {/* COPIED TOAST */}
      {copiedMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white py-1 px-3 rounded-md z-50">
          {copiedMessage}
        </div>
      )}
    </div>
  );
}

/* ------------------- COLOR HELPERS ------------------- */

function hexToHSL(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((x) => x + x).join("");
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return rgbToHSL(r, g, b);
}

function rgbToHSL(r, g, b) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const cMax = Math.max(rr, gg, bb), cMin = Math.min(rr, gg, bb);
  const delta = cMax - cMin;

  let h = 0, s = 0, l = (cMax + cMin) / 2;
  if (delta !== 0) {
    if (cMax === rr) {
      h = ((gg - bb) / delta) % 6;
    } else if (cMax === gg) {
      h = (bb - rr) / delta + 2;
    } else {
      h = (rr - gg) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    s = delta / (1 - Math.abs(2 * l - 1));
  }
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  const hh = h / 360, ss = s / 100, ll = l / 100;
  let r, g, b;
  if (ss === 0) {
    r = g = b = ll;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    r = hue2rgb(p, q, hh + 1 / 3);
    g = hue2rgb(p, q, hh);
    b = hue2rgb(p, q, hh - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function rgbToHex(r, g, b) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* Decide black or white text for readability */
function getContrastYIQ(colorStr) {
  let hex = colorStr.replace("#", "");
  if (hex.startsWith("rgb")) {
    // parse rgb(...) => hex
    const nums = colorStr
      .replace(/[^\d,]/g, "")
      .split(",")
      .map(Number);
    const [r, g, b] = nums;
    const { h, s, l } = rgbToHSL(r, g, b);
    hex = hslToHex(h, s, l).slice(1); // remove #
  }
  if (hex.length === 3) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);

  const yiq = (r*299 + g*587 + b*114) / 1000;
  return (yiq >= 128) ? "#000" : "#fff";
}