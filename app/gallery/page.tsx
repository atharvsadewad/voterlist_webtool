"use client";

import Navbar from "../components/Navbar";

export default function GalleryPage() {
  const images = Array.from({ length: 7 }, (_, i) => `/gallery${i + 1}.jpg`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Gallery ${idx + 1}`}
              className="w-full mb-4 rounded-xl shadow-md hover:scale-[1.02] transition"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
