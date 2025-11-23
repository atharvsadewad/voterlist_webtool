"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* INC Hand Symbol (SVG) */}
          <div className="flex items-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            >
              <path d="M8 13V4a2 2 0 1 1 4 0v7" />
              <path d="M12 13V2a2 2 0 1 1 4 0v11" />
              <path d="M16 13V5a2 2 0 1 1 4 0v10" />
              <path d="M8 13c0 4 1 8 4 8s4-4 4-8" />
            </svg>
          </div>

          <span className="font-semibold text-gray-800 text-lg tracking-wide">
            Indian National Congress, Udgir
          </span>
        </div>

        {/* Desktop: nothing else. Mobile: hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-label="menu"
            className="p-2 rounded-md bg-white/70 shadow-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.8">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Color bar */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#138808] via-[#ffffff] to-[#ff9933]" />

      {/* Mobile slide-over menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden pointer-events-none transition-all ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        <nav
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-6 transform transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button onClick={() => setOpen(false)} className="mb-6 text-sm px-2 py-1 rounded hover:bg-gray-100">
            Close
          </button>

          <ul className="flex flex-col gap-4">
            <li>
              <a href="/" className="font-medium text-gray-800">Home</a>
            </li>
            <li>
              <a href="/gallery" className="font-medium text-gray-800">Gallery</a>
            </li>
            <li>
              <a href="/work" className="font-medium text-gray-800">Work</a>
            </li>
            <li>
              <a href="/contact" className="font-medium text-gray-800">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
