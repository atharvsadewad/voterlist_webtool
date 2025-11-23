"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/navbar.jpg"
            alt="INC Udgir"
            className="h-10 w-auto object-contain"
          />

          <span className="hidden sm:block font-semibold text-gray-800 text-lg tracking-wide">
            Indian National Congress, Udgir
          </span>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="hover:text-blue-600 font-medium">Home</a>
          <a href="/gallery" className="hover:text-blue-600 font-medium">Gallery</a>
          <a href="/work" className="hover:text-blue-600 font-medium">Work</a>
          <a href="/contact" className="hover:text-blue-600 font-medium">Contact</a>
        </nav>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-label="menu"
            className="p-2 rounded-md bg-white/60 shadow"
          >
            <svg width="24" height="24" stroke="#222" strokeWidth="1.8">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Congress color underline */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#138808] via-white to-[#ff9933]" />

      {/* MOBILE MENU (Slide-in) */}
      <div
        className={`fixed inset-0 z-40 md:hidden pointer-events-none transition ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
      >
        {/* overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* slide menu */}
        <nav
          className={`absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl transform transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            className="mb-6 px-3 py-1 rounded hover:bg-gray-100 text-sm"
          >
            Close
          </button>

          <ul className="flex flex-col gap-6 text-lg">
            <li><a href="/" onClick={() => setOpen(false)}>Home</a></li>
            <li><a href="/gallery" onClick={() => setOpen(false)}>Gallery</a></li>
            <li><a href="/work" onClick={() => setOpen(false)}>Work</a></li>
            <li><a href="/contact" onClick={() => setOpen(false)}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
