"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

export default function GalleryPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("voter_dark");
    if (saved) setDarkMode(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("voter_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Auto-load your files gallery1.jpg ... gallery7.jpg
  const images = Array.from({ length: 7 }, (_, i) => `/gallery${i + 1}.jpg`);

  return (
    <div
      className={`min-h-screen transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ✅ Navbar added properly */}
      <Navbar />

      <div className="px-4 py-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold">Gallery</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-700"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        {/* Gallery Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {images.map((src, index) => (
            <div
              key={index}
              className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-lg hover:scale-[1.02] transition"
            >
              <img
                src={src}
                className="w-full object-cover rounded-lg"
                alt={`Gallery ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
