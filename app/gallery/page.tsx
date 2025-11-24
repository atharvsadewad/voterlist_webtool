"use client";

import Navbar from "../../components/Navbar";

export default function GalleryPage() {
  const images = Array.from({ length: 7 }, (_, i) => `/gallery${i + 1}.jpg`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>

        <div className="flex flex-col gap-6">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Gallery ${index + 1}`}
              className="w-full rounded-xl shadow-md object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
