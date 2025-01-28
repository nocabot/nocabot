// src/config.js

// In production, you might set NEXT_PUBLIC_FLASK_URL in .env
// so you can switch easily, e.g. NEXT_PUBLIC_FLASK_URL=https://api.yourdomain.com
// If none is set, default to localhost

// export const SERVER_BASE_URL =
//   process.env.NEXT_PUBLIC_FLASK_URL || "http://localhost:5000";

  export const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_FLASK_URL || "https://api.nocabot.com";

  // src/config.js

// Add a separate remove-bg server if you want a different domain
// export const REMOVE_BG_SERVER_BASE_URL =
// process.env.NEXT_PUBLIC_REMOVE_BG_FLASK_URL || "http://localhost:5000";

export const REMOVE_BG_SERVER_BASE_URL =
process.env.NEXT_PUBLIC_REMOVE_BG_FLASK_URL || "https://removebg.nocabot.com";
