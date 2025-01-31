// src/config.js

// Existing image server:
export const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_FLASK_URL ||
  "https://6yyyiljiti56uggq6uwye2frfi0ubgtm.lambda-url.us-east-1.on.aws";

// If you have a separate remove-bg server:
export const REMOVE_BG_SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_REMOVE_BG_FLASK_URL || "https://removebg.nocabot.com";

// NEW: Audio server
export const AUDIO_SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_AUDIO_LAMBDA_URL ||
  "https://7qlljr4jexoyshvl7tigv3sxoy0akcaq.lambda-url.us-east-1.on.aws";
