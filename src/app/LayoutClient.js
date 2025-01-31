"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Import all three providers
import { ImageProvider } from "@/context/ImageProvider";
import { AudioProvider } from "@/context/AudioProvider";
import { VideoProvider } from "@/context/VideoProvider";

import { AuroraText } from "@/components/ui/AuroraText";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

// Icons
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  HomeIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  SwatchIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Define top-level nav items
const topLevelNav = [
  { name: "Home", href: "/", icon: HomeIcon },
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
    name: "Color",
    href: "#",
    icon: SwatchIcon,
    subItems: [
      { name: "Palettes", href: "/color/palettes" },
      { name: "Variations", href: "/color/variations" },
    ],
  },
  { name: "About", href: "/about", icon: InformationCircleIcon },
];

export default function LayoutClient({ children }) {
  // Mobile menu open or closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark mode & cookie banner states
  const [darkMode, setDarkMode] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  // Desktop hover sub-menu
  const [activeIndex, setActiveIndex] = useState(-1);
  // Mobile expand/collapse sub-menu
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const pathname = usePathname();

  // On mount, read localStorage for cookie consent & dark mode
  useEffect(() => {
    let isDark = false;
    const cookieConsent = localStorage.getItem("cookieConsent"); // "true", "false", or null

    if (cookieConsent === "true") {
      // If accepted => read dark mode
      const storedDarkMode = localStorage.getItem("nocabotDarkMode") === "true";
      isDark = storedDarkMode;
      setCookiesAccepted(true);
    } else if (cookieConsent === "false") {
      // If declined => force false
      isDark = false;
      setCookiesAccepted(false);
    } else {
      // No consent => show banner
      setShowCookieBanner(true);
    }

    if (isDark) {
      document.documentElement.classList.add("dark");
    }
    setDarkMode(isDark);
    setInitialized(true);
  }, []);

  // Toggle dark mode. Store preference only if cookies accepted
  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    if (cookiesAccepted) {
      localStorage.setItem("nocabotDarkMode", nextVal ? "true" : "false");
    }
    if (nextVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Accept cookies => store 'true'
  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setCookiesAccepted(true);
    setShowCookieBanner(false);
  };

  // Reject cookies => store 'false'
  const handleRejectCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setCookiesAccepted(false);
    setShowCookieBanner(false);
  };

  if (!initialized) return null; // Prevent mismatch

  return (
    // Wrap in all providers: Image, Audio, Video
    <ImageProvider>
      <AudioProvider>
        <VideoProvider>
          <div className="flex min-h-screen w-full text-gray-800 dark:text-gray-200">
            {/* FIXED SIDEBAR (desktop) */}
            <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-48 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
              {/* Brand at top */}
              <div className="shrink-0 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-center">
                <Link href="/">
                  <AuroraText className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">
                    Nocabot
                  </AuroraText>
                </Link>
              </div>

              {/* Top-level nav */}
              <nav className="flex-1 overflow-y-auto">
                {topLevelNav.map((item, idx) => {
                  const Icon = item.icon;
                  const hasSub = !!item.subItems;
                  // Active if direct link or one sub item matches pathname
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
                          transition-colors
                          hover:bg-gray-50 dark:hover:bg-gray-800
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

              {/* Dark Mode button pinned at bottom */}
              <div className="shrink-0 p-4 border-t border-gray-100 dark:border-gray-800">
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
            </aside>

            {/* 2ND COLUMN (desktop hover sub-menu) */}
            {activeIndex > -1 &&
              topLevelNav[activeIndex].subItems &&
              topLevelNav[activeIndex].subItems.length > 0 && (
                <aside
                  className="
                    z-50 hidden md:flex flex-col fixed top-0 left-48 bottom-0 w-56
                    bg-white dark:bg-gray-900 shadow-xl dark:shadow-black/50
                    rounded-r-md overflow-y-auto
                  "
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

            {/* MOBILE TOP BAR */}
            <div className="md:hidden absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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

            {/* MAIN CONTENT + flickering grid */}
            <main className="flex-1 ml-48 relative transition-colors">
              {/* Flickering grid behind everything */}
              <div className="pointer-events-none absolute inset-0 -z-10">
                <FlickeringGrid
                  className="w-full h-full"
                  squareSize={4}
                  gridGap={6}
                  color="#6B7280"
                  maxOpacity={0.06}
                  flickerChance={0.1}
                />
              </div>

              <div className="p-4 max-w-7xl mx-auto">{children}</div>
            </main>

            {/* MOBILE SIDEBAR OFF-CANVAS */}
            <MobileSidebar
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              topLevelNav={topLevelNav}
              expandedIndex={expandedIndex}
              setExpandedIndex={setExpandedIndex}
              toggleDarkMode={toggleDarkMode}
              darkMode={darkMode}
            />
          </div>

          {/* COOKIE BANNER, if needed */}
          {showCookieBanner && (
            <CookieBanner onAccept={handleAcceptCookies} onReject={handleRejectCookies} />
          )}
        </VideoProvider>
      </AudioProvider>
    </ImageProvider>
  );
}

/** MOBILE SIDEBAR */
function MobileSidebar({
  mobileMenuOpen,
  setMobileMenuOpen,
  topLevelNav,
  expandedIndex,
  setExpandedIndex,
  toggleDarkMode,
  darkMode,
}) {
  const pathname = usePathname();

  if (!mobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className="relative w-64 max-w-full bg-white dark:bg-gray-900 flex flex-col shadow-xl dark:shadow-black/50">
        {/* Mobile Header */}
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

        {/* Mobile Nav */}
        <nav className="flex-1 overflow-y-auto">
          {topLevelNav.map((item, idx) => {
            const Icon = item.icon;
            const hasSub = !!item.subItems;
            const isExpanded = expandedIndex === idx;

            // Determine if top-level is active
            const isActive = hasSub
              ? item.subItems.some((sub) => sub.href === pathname)
              : item.href === pathname;

            if (!hasSub) {
              // direct link
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
              // Submenu
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
                        const subActive = sub.href === pathname;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`
                              block pl-4 pr-2 py-2 text-sm
                              hover:bg-gray-50 dark:hover:bg-gray-800
                              transition-colors
                              ${subActive ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
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

        {/* Dark Mode on mobile */}
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
  );
}

/** COOKIE BANNER */
function CookieBanner({ onAccept, onReject }) {
  return (
    <div
      className="
        fixed inset-x-0 bottom-0 z-[9999]
        flex flex-col md:flex-row items-start md:items-center
        justify-between gap-4
        bg-white dark:bg-gray-800
        p-6 ring-1 ring-gray-900/10 dark:ring-gray-700/30
        text-gray-900 dark:text-gray-100
      "
    >
      <p className="max-w-xl text-sm">
        This website stores a local preference for dark mode.
        Accepting cookies/prefs is optional but recommended.
        See our{" "}
        <a
          href="#"
          className="font-semibold text-indigo-600 dark:text-indigo-400 underline"
        >
          cookie policy
        </a>.
      </p>
      <div className="flex flex-none items-center gap-x-5">
        <button
          type="button"
          onClick={onAccept}
          className="
            rounded-md bg-gray-900 text-white
            px-3 py-2 text-sm font-semibold
            hover:bg-gray-700 dark:hover:bg-gray-600
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-gray-900
          "
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={onReject}
          className="text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
          Reject all
        </button>
      </div>
    </div>
  );
}