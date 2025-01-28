"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HomeIcon,
  ArrowsPointingInIcon,
  ScissorsIcon,
  ArrowsRightLeftIcon,
  PhotoIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  FaceSmileIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

import { ImageProvider } from "@/context/ImageProvider";
import { AuroraText } from "@/components/ui/AuroraText";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

// MAIN NAV
const featuresNav = [
  { name: "Home", href: "/", icon: <HomeIcon className="h-6 w-6" /> },
  { name: "Compress", href: "/compress", icon: <ArrowsPointingInIcon className="h-6 w-6" /> },
  { name: "Resize", href: "/resize", icon: <ScissorsIcon className="h-6 w-6" /> },
  { name: "Convert", href: "/convert", icon: <ArrowsRightLeftIcon className="h-6 w-6" /> },
  { name: "Remove BG", href: "/remove-bg", icon: <PhotoIcon className="h-6 w-6" /> },
];

// SPECIALTY
const specialtyNav = [
  { name: "Favicons", href: "/favicons", icon: <GlobeAltIcon className="h-6 w-6" /> },
  { name: "App Icon", href: "/app-icon", icon: <DevicePhoneMobileIcon className="h-6 w-6" /> },
  { name: "Meme Maker", href: "/meme", icon: <FaceSmileIcon className="h-6 w-6" /> },
];

// OTHER
const otherNav = [
  { name: "About", href: "/about", icon: <InformationCircleIcon className="h-6 w-6" /> },
];

/** The sidebar nav content */
function SidebarContent({ onLinkClick, darkMode, toggleDarkMode }) {
  return (
    <div className="flex flex-col px-4 py-6">
      {/* Brand at top */}
      <Link href="/" onClick={onLinkClick} className="block text-center">
        <AuroraText className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          Nocabot
        </AuroraText>
      </Link>

      {/* Features section */}
      <ul className="mt-8 space-y-1">
        {featuresNav.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className="
                group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                text-gray-700 dark:text-gray-200
                hover:bg-blue-50 dark:hover:bg-gray-700
                hover:text-blue-600 dark:hover:text-white
              "
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* Specialty section */}
      <div className="mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
        Specialty
      </div>
      <ul className="space-y-1">
        {specialtyNav.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className="
                group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                text-gray-700 dark:text-gray-200
                hover:bg-blue-50 dark:hover:bg-gray-700
                hover:text-blue-600 dark:hover:text-white
              "
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* Other section */}
      <div className="mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
        Other
      </div>
      <ul className="space-y-1">
        {otherNav.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className="
                group flex gap-x-3 rounded-md p-2 text-sm font-semibold
                text-gray-700 dark:text-gray-200
                hover:bg-blue-50 dark:hover:bg-gray-700
                hover:text-blue-600 dark:hover:text-white
              "
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Extra spacing, then Dark Mode button */}
      <div className="mt-8 pt-2">
        <button
          onClick={toggleDarkMode}
          className="
            mt-4 flex w-full items-center justify-center gap-2
            rounded-md border border-gray-200 dark:border-gray-700
            bg-gray-100 dark:bg-gray-800
            px-3 py-2 text-sm font-semibold
            text-gray-800 dark:text-gray-200
            hover:bg-gray-50 dark:hover:bg-gray-700
          "
        >
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}

/** The overall layout client that includes the sidebar + mobile nav + flickering grid. */
export default function LayoutClient({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // On mount, read if .dark is present
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
    setInitialized(true);
  }, []);

  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    if (nextVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("nocabotDarkMode", nextVal ? "true" : "false");
  };

  if (!initialized) {
    // Avoid hydration mismatch by not rendering until we've read localStorage
    return null;
  }

  return (
    <ImageProvider>
      {/* 
        Use min-h-screen so the entire page can grow as needed, 
        removing the separate scroll for the sidebar. 
      */}
      <div className="min-h-screen w-full flex flex-col text-gray-800 dark:text-gray-200">
        {/* Top area is a flex row: sidebar on the left, main area on the right */}
        <div className="flex-1 flex flex-row">
          {/* DESKTOP SIDEBAR (hidden on mobile) */}
          <aside className="hidden md:block md:w-64 md:flex-shrink-0 md:bg-white md:dark:bg-gray-900 md:border-r md:border-gray-200 md:dark:border-gray-700">
            <SidebarContent
              onLinkClick={() => {}}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </aside>

          {/* MAIN AREA with flickering grid behind */}
          <div className="relative flex-1 bg-transparent">
            {/* Flickering grid as background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="w-full h-full opacity-20">
                <FlickeringGrid
                  className="w-full h-full"
                  squareSize={4}
                  gridGap={6}
                  color="#6B7280"
                  maxOpacity={0.35}
                  flickerChance={0.1}
                />
              </div>
            </div>

            {/* MOBILE TOP BAR (keep border here) */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-50"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <Link href="/" className="block">
                <AuroraText className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                  Nocabot
                </AuroraText>
              </Link>
            </div>

            {/* MAIN CONTENT SCROLLS */}
            <div className="p-2 min-h-[calc(100vh-4rem)] w-[90%] mx-auto md:w-full">
              {children}
            </div>
          </div>
        </div>

        {/* MOBILE OFF-CANVAS SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              {/*
                Remove the border-b here so we don't get an extra line
                under "Nocabot" in the open sidebar.
              */}
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-50"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1">
                <SidebarContent
                  onLinkClick={() => setMobileMenuOpen(false)}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ImageProvider>
  );
}