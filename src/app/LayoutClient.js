"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageProvider } from "../context/ImageProvider";
import { AuroraText } from "../components/ui/AuroraText";
import { FlickeringGrid } from "../components/magicui/flickering-grid";

import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  HomeIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  PuzzlePieceIcon,
  SwatchIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Adjust your topLevelNav
const topLevelNav = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Images",
    href: "#",
    icon: PhotoIcon,
    subItems: [
      { name: "Compress", href: "/images/compress" },
      { name: "Resize", href: "/images/resize" },
      { name: "Convert", href: "/images/convert" },
      { name: "Remove BG", href: "/images/remove-bg" },
      { name: "Favicons", href: "/images/favicons" },
      { name: "App Icon", href: "/images/app-icon" },
    ],
  },
  {
    name: "Color",
    href: "#",
    icon: SwatchIcon,
    subItems: [
      { name: "Palettes", href: "/color/palettes" },
      { name: "Variations", href: "/color/variations" },
    ],
  },
  {
    // Turn "Apps" into a dropdown, so we can list multiple sub tools
    name: "Apps",
    href: "#",
    icon: PuzzlePieceIcon,
    subItems: [
      { name: "Meme Maker", href: "/apps/meme-maker" },
      { name: "Chicago Street Cleaning", href: "/apps/chicago-street-cleaning" },
      { name: "Score Keeper", href: "/apps/score-keeper" },
    ],
  },
  {
    name: "Video",
    href: "#",
    icon: VideoCameraIcon,
    subItems: [
      { name: "Compress", href: "/video/compress" },
      { name: "Convert", href: "/video/convert" },
      { name: "Resize", href: "/video/resize" },
      { name: "Transfer", href: "/video/transfer" },
    ],
  },
  {
    name: "Audio",
    href: "#",
    icon: MusicalNoteIcon,
    subItems: [
      { name: "Compress", href: "/audio/compress" },
      { name: "Convert", href: "/audio/convert" },
      { name: "Resize", href: "/audio/resize" },
      { name: "Frequency", href: "/audio/frequency" },
    ],
  },
  {
    name: "Finance",
    href: "#",
    icon: CurrencyDollarIcon,
    subItems: [
      { name: "Compound Interest", href: "/finance/compound-interest" },
      { name: "Income Tax", href: "/finance/income-tax" },
      { name: "Amortization", href: "/finance/amortization" }, // <-- new
    ],
  },
];

export default function LayoutClient({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const pathname = usePathname();

  useEffect(() => {
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

  if (!initialized) return null;

  return (
    <ImageProvider>
      <div className="flex min-h-screen w-full flex-col text-gray-800 dark:text-gray-200">
        {/* MOBILE TOP BAR */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-50"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link href="/" className="block">
            <AuroraText className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Nocabot
            </AuroraText>
          </Link>
        </div>

        {/* DESKTOP SIDEBAR + MAIN */}
        <div className="relative flex flex-1">
          {/* Flickering grid background */}
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

          {/* LEFT SIDEBAR (Desktop) */}
          <aside className="hidden md:flex md:flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 w-48">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-center">
              <Link href="/">
                <AuroraText className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">
                  Nocabot
                </AuroraText>
              </Link>
            </div>
            <nav className="flex-1 overflow-y-auto">
              {topLevelNav.map((item, idx) => {
                const Icon = item.icon;
                const hasSub = !!item.subItems;
                const isActive = hasSub
                  ? item.subItems.some((sub) => sub.href === pathname)
                  : item.href === pathname;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveIndex(hasSub ? idx : -1)}
                    onMouseLeave={() => setActiveIndex(-1)}
                  >
                    <Link
                      href={item.href !== "#" ? item.href : "/"}
                      className={`
                        flex items-center justify-between gap-2 px-4 py-3
                        hover:bg-gray-50 dark:hover:bg-gray-800
                        transition-colors
                        ${isActive ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {hasSub && <ChevronRightIcon className="h-4 w-4 opacity-60" />}
                    </Link>
                  </div>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 rounded-md bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </aside>

          {/* 2ND COLUMN (Desktop hover) */}
          {activeIndex > -1 &&
            topLevelNav[activeIndex].subItems &&
            topLevelNav[activeIndex].subItems.length > 0 && (
              <aside
                className="z-50 absolute top-0 left-48 bottom-0 w-56 bg-white dark:bg-gray-900 shadow-xl dark:shadow-black/50 rounded-r-md overflow-y-auto hidden md:flex md:flex-col"
                onMouseEnter={() => setActiveIndex(activeIndex)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    {topLevelNav[activeIndex].name}
                  </span>
                </div>
                <nav className="flex-1">
                  {topLevelNav[activeIndex].subItems.map((sub) => {
                    const isSubActive = sub.href === pathname;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`
                          block px-4 py-2 text-sm transition-colors
                          hover:bg-gray-50 dark:hover:bg-gray-800
                          ${isSubActive ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
                        `}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </nav>
              </aside>
            )}

          {/* MAIN CONTENT: 90% width even on mobile */}
          <main
            className="
              w-[90%] mx-auto p-4
              flex-1 overflow-auto
              bg-white dark:bg-gray-900 transition-colors
            "
          >
            {children}
          </main>
        </div>

        {/* MOBILE OFF-CANVAS SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 max-w-full bg-white dark:bg-gray-900 flex flex-col shadow-xl dark:shadow-black/50">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <AuroraText className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">
                  Nocabot
                </AuroraText>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto">
                {topLevelNav.map((item, idx) => {
                  const Icon = item.icon;
                  const hasSub = !!item.subItems;
                  const isExpanded = expandedIndex === idx;
                  // active if sub link or direct link
                  const isActive = hasSub
                    ? item.subItems.some((sub) => sub.href === pathname)
                    : item.href === pathname;

                  if (!hasSub) {
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-2 px-4 py-3
                          hover:bg-gray-50 dark:hover:bg-gray-800
                          transition-colors
                          ${isActive ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  } else {
                    return (
                      <div key={item.name}>
                        <div
                          className={`
                            flex items-center justify-between px-4 py-3 cursor-pointer
                            hover:bg-gray-50 dark:hover:bg-gray-800
                            transition-colors
                            ${isActive ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
                          `}
                          onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </div>
                          <ChevronRightIcon
                            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </div>
                        {isExpanded && (
                          <div className="ml-8 border-l border-gray-100 dark:border-gray-800">
                            {item.subItems.map((sub) => {
                              const isSubActive = sub.href === pathname;
                              return (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`
                                    block pl-4 pr-2 py-2 text-sm
                                    hover:bg-gray-50 dark:hover:bg-gray-800
                                    transition-colors
                                    ${
                                      isSubActive
                                        ? "bg-gray-50 dark:bg-gray-800 font-semibold"
                                        : ""
                                    }
                                  `}
                                >
                                  {sub.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
              </nav>
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={toggleDarkMode}
                  className="
                    w-full flex items-center justify-center gap-2
                    rounded-md bg-gray-200 dark:bg-gray-800
                    px-3 py-2 text-sm font-semibold
                    text-gray-800 dark:text-gray-200
                    hover:bg-gray-300 dark:hover:bg-gray-700
                    transition-colors
                  "
                >
                  {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ImageProvider>
  );
}