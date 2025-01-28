"use client";

export default function AboutPage() {
  return (
    <div
      className="
        mx-auto mt-10 mb-10 w-full
        sm:w-[95%] md:w-[85%]
        bg-white dark:bg-gray-800
        p-12
        rounded-md
        border border-gray-200 dark:border-gray-700
        shadow dark:shadow-black/50
        font-sans
      "
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
        About
      </h1>
      <p className="mt-1 text-sm text-center text-gray-600 dark:text-gray-400">
        Important to read before using Nocabot
      </p>

      <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-left">
        <p>
          Nocabot is provided as-is with no warranties. By using our service, you
          acknowledge that we are not liable for any direct or indirect damages
          related to your usage. We do not store or retain any images uploaded
          by users. All processing happens temporarily on our server, and images
          are returned immediately.
        </p>
        <p className="mt-4">
          Rest assured that your data is safe with us. We do not log or save your
          images or associated data. Nocabot is a small, independent company that
          does not accept advertisements or payments at this time. Our goal is
          simply to provide quick and easy image transformations for everyone.
        </p>
      </div>
    </div>
  );
}