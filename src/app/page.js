"use client";

import Link from "next/link";
import { AuroraText } from "@/components/ui/AuroraText";
import {
  ArrowsPointingInIcon,
  ScissorsIcon,
  ArrowsRightLeftIcon,
  PhotoIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  FaceSmileIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const actions = [
  {
    title: "Compress Images",
    href: "/compress",
    icon: ArrowsPointingInIcon,
    iconFg: "text-purple-700 dark:text-white",
    iconBg: "bg-purple-50 dark:bg-purple-900",
    description: "Reduce file sizes while retaining quality for faster load times.",
  },
  {
    title: "Resize Images",
    href: "/resize",
    icon: ScissorsIcon,
    iconFg: "text-rose-700 dark:text-white",
    iconBg: "bg-rose-50 dark:bg-rose-900",
    description: "Quickly change dimensions or aspect ratios to fit any usage scenario.",
  },
  {
    title: "Convert Images",
    href: "/convert",
    icon: ArrowsRightLeftIcon,
    iconFg: "text-sky-700 dark:text-white",
    iconBg: "bg-sky-50 dark:bg-sky-900",
    description: "Switch between PNG, JPG, GIF, WebP, and more with a single click.",
  },
  {
    title: "Remove Background",
    href: "/remove-bg",
    icon: PhotoIcon,
    iconFg: "text-indigo-700 dark:text-white",
    iconBg: "bg-indigo-50 dark:bg-indigo-900",
    description: "Automatically remove backgrounds.",
  },
  {
    title: "Generate Favicons",
    href: "/favicons",
    icon: GlobeAltIcon,
    iconFg: "text-green-700 dark:text-white",
    iconBg: "bg-green-50 dark:bg-green-900",
    description: "Create multiple favicon sizes (.ico) for perfect branding.",
  },
  {
    title: "App Icon",
    href: "/app-icon",
    icon: DevicePhoneMobileIcon,
    iconFg: "text-yellow-700 dark:text-white",
    iconBg: "bg-yellow-50 dark:bg-yellow-900",
    description: "Transform any image into a 1024×1024 compressed app icon.",
  },
  {
    title: "Meme Maker (Coming Soon)",
    href: "/meme",
    icon: FaceSmileIcon,
    iconFg: "text-pink-700 dark:text-white",
    iconBg: "bg-pink-50 dark:bg-pink-900",
    description: "Create fun memes with base images, overlays, and text (not yet active).",
  },
  {
    title: "About",
    href: "/about",
    icon: InformationCircleIcon,
    iconFg: "text-gray-700 dark:text-white",
    iconBg: "bg-gray-50 dark:bg-gray-900",
    description: "Important disclaimers and info about Nocabot.",
  },
];

export default function HomePage() {
  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12
        rounded-md
        dark:border-gray-700
        shadow
        font-sans
      "
    >
      <h1 className="text-3xl font-bold tracking-tight text-center text-gray-800 dark:text-gray-100">
        Welcome to <AuroraText className="text-3xl">Nocabot</AuroraText>
      </h1>

      <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
        A suite of easy-to-use image tools for every workflow.
      </p>

      <div
        className="
          mt-8
          divide-y divide-gray-200 dark:divide-gray-700
          overflow-hidden
          rounded-lg
          bg-gray-100 dark:bg-gray-700
          shadow dark:shadow-black/50
          sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0
        "
      >
        {actions.map((action, idx) => (
          <div
            key={action.title}
            className={classNames(
              idx === 0 ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none" : "",
              idx === 1 ? "sm:rounded-tr-lg" : "",
              idx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
              idx === actions.length - 1
                ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                : "",
              "group relative bg-white dark:bg-gray-800 p-6 " +
                "focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 " +
                "border-b last:border-none border-gray-200 dark:border-gray-700 sm:border-b-0 sm:border-r"
            )}
          >
            <div>
              <span
                className={classNames(
                  action.iconBg,
                  action.iconFg,
                  "inline-flex rounded-lg p-3 ring-4 ring-white dark:ring-gray-800"
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-8">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                <Link href={action.href} className="focus:outline-none">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {action.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </div>

            {/* The diagonal arrow in top-right corner */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}