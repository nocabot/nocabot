"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowsPointingInIcon,
  ScissorsIcon,
  ArrowsRightLeftIcon,
  PhotoIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  SwatchIcon,
  PaintBrushIcon,
  PaperAirplaneIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { AuroraText } from "@/components/ui/AuroraText";

/**
 * Example color combos for icons in light/dark mode:
 *   iconBg: "bg-blue-50 dark:bg-blue-900"
 *   iconFg: "text-blue-700 dark:text-white"
 */

// IMAGES
const imagesActions = [
  {
    title: "Compress",
    href: "/images/compress",
    description: "Reduce file sizes while retaining quality.",
    icon: ArrowsPointingInIcon,
    iconBg: "bg-blue-50 dark:bg-blue-900",
    iconFg: "text-blue-700 dark:text-white",
  },
  {
    title: "Resize",
    href: "/images/resize",
    description: "Change dimensions or aspect ratios.",
    icon: ScissorsIcon,
    iconBg: "bg-green-50 dark:bg-green-900",
    iconFg: "text-green-700 dark:text-white",
  },
  {
    title: "Convert",
    href: "/images/convert",
    description: "Switch between PNG, JPG, GIF, and more.",
    icon: ArrowsRightLeftIcon,
    iconBg: "bg-amber-50 dark:bg-amber-900",
    iconFg: "text-amber-700 dark:text-white",
  },
  {
    title: "Remove BG",
    href: "/images/remove-bg",
    description: "Automatically remove backgrounds.",
    icon: PhotoIcon,
    iconBg: "bg-pink-50 dark:bg-pink-900",
    iconFg: "text-pink-700 dark:text-white",
  },
  {
    title: "Favicons",
    href: "/images/favicons",
    description: "Generate 16×16, 32×32, and .ico favicons.",
    icon: GlobeAltIcon,
    iconBg: "bg-purple-50 dark:bg-purple-900",
    iconFg: "text-purple-700 dark:text-white",
  },
  {
    title: "App Icon",
    href: "/images/app-icon",
    description: "Turn any image into a 1024×1024 app icon.",
    icon: DevicePhoneMobileIcon,
    iconBg: "bg-orange-50 dark:bg-orange-900",
    iconFg: "text-orange-700 dark:text-white",
  },
];

// VIDEO
const videoActions = [
  {
    title: "Compress",
    href: "/video/compress",
    description: "Compress large video files to smaller size.",
    icon: ArrowsPointingInIcon,
    iconBg: "bg-blue-50 dark:bg-blue-900",
    iconFg: "text-blue-700 dark:text-white",
  },
  {
    title: "Convert",
    href: "/video/convert",
    description: "Change video formats (MP4, MOV, etc.).",
    icon: ArrowsRightLeftIcon,
    iconBg: "bg-green-50 dark:bg-green-900",
    iconFg: "text-green-700 dark:text-white",
  },
  {
    title: "Resize",
    href: "/video/resize",
    description: "Trim or crop video to custom dimensions.",
    icon: ScissorsIcon,
    iconBg: "bg-amber-50 dark:bg-amber-900",
    iconFg: "text-amber-700 dark:text-white",
  },
  {
    title: "Transfer",
    href: "/video/transfer",
    description: "Generate a share link that expires in 15 mins.",
    icon: PaperAirplaneIcon,
    iconBg: "bg-pink-50 dark:bg-pink-900",
    iconFg: "text-pink-700 dark:text-white",
  },
];

// AUDIO
const audioActions = [
  {
    title: "Compress",
    href: "/audio/compress",
    description: "Lower audio file size while retaining quality.",
    icon: ArrowsPointingInIcon,
    iconBg: "bg-blue-50 dark:bg-blue-900",
    iconFg: "text-blue-700 dark:text-white",
  },
  {
    title: "Convert",
    href: "/audio/convert",
    description: "Switch between MP3, WAV, FLAC, etc.",
    icon: ArrowsRightLeftIcon,
    iconBg: "bg-green-50 dark:bg-green-900",
    iconFg: "text-green-700 dark:text-white",
  },
  {
    title: "Resize",
    href: "/audio/resize",
    description: "Trim audio start/end times easily.",
    icon: ScissorsIcon,
    iconBg: "bg-amber-50 dark:bg-amber-900",
    iconFg: "text-amber-700 dark:text-white",
  },
  {
    title: "Frequency",
    href: "/audio/frequency",
    description: "Adjust frequency/pitch (example).",
    icon: AdjustmentsHorizontalIcon,
    iconBg: "bg-pink-50 dark:bg-pink-900",
    iconFg: "text-pink-700 dark:text-white",
  },
];

// COLOR
const colorActions = [
  {
    title: "Palettes",
    href: "/color/palettes",
    description: "Explore & copy color palettes.",
    icon: PaintBrushIcon,
    iconBg: "bg-purple-50 dark:bg-purple-900",
    iconFg: "text-purple-700 dark:text-white",
  },
  {
    title: "Variations",
    href: "/color/variations",
    description: "Generate tints & shades from any color.",
    icon: SwatchIcon,
    iconBg: "bg-orange-50 dark:bg-orange-900",
    iconFg: "text-orange-700 dark:text-white",
  },
];

// Helper to render each section
function ActionSection({ title, items, subtitle }) {
  return (
    <section className="mt-10">
      <AuroraText className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </AuroraText>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {subtitle}
      </p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((action) => (
          <div
            key={action.title}
            className="
              group relative bg-white dark:bg-gray-800 p-6
              rounded-md shadow
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-colors
            "
          >
            <div
              className={`
                inline-flex h-12 w-12 items-center justify-center
                rounded-lg
                ${action.iconBg} ${action.iconFg}
                ring-4 ring-white dark:ring-gray-800
              `}
            >
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <Link href={action.href}>
                <span className="absolute inset-0" aria-hidden="true" />
                {action.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {action.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div
      className="
        mx-auto mt-10 mb-10
        w-full sm:w-[95%] md:w-[85%]
        p-12
        rounded-md
        shadow
        font-sans
        bg-white/90 dark:bg-gray-800/90
      "
    >
      {/* Title & Subtitle */}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        Welcome to{" "}
        <AuroraText className="inline-block text-3xl text-gray-800 dark:text-gray-100">
          Nocabot
        </AuroraText>
      </h1>
      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        100% free and ad-free, with no sign-ups required. We never store your data
        longer than it takes to process your request.
      </p>

      {/* IMAGES */}
      <ActionSection
        title="Images"
        items={imagesActions}
        subtitle="Instantly transform your images with these quick tools:"
      />

      {/* VIDEO */}
      <ActionSection
        title="Video"
        items={videoActions}
        subtitle="Manage and optimize video files for easier sharing:"
      />

      {/* AUDIO */}
      <ActionSection
        title="Audio"
        items={audioActions}
        subtitle="Convert, compress, or trim audio with ease:"
      />

      {/* COLOR */}
      <ActionSection
        title="Color"
        items={colorActions}
        subtitle="Generate palettes or create tints & shades in seconds:"
      />
    </div>
  );
}