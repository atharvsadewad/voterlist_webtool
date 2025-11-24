"use client";

import Navbar from "../../components/Navbar";

export default function GalleryPage() {
  const images = Array.from({ length: 7 }, (_, i) => `/gallery${i + 1}.jpg`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>

        <div className="grid grid-cols-1 gap-6">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full rounded-xl shadow-lg object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
