"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full backdrop-blur bg-white/80 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

        {/* LEFT LOGO + TEXT */}
        <div className="flex items-center gap-3">
          <Image
            src="/navbar.jpg"
            width={42}
            height={42}
            alt="INC"
            className="rounded-full border shadow-sm"
          />

          {/* MOBILE = "INC", DESKTOP = full text */}
          <span className="font-semibold text-gray-800 text-lg md:hidden">
            INC
          </span>

          <span className="hidden md:block font-semibold text-gray-800 text-lg whitespace-nowrap">
            Indian National Congress, Udgir
          </span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="/" className="hover:text-green-700">Home</a>
          <a href="/alphabetical" className="hover:text-green-700">Alphabetical</a>
          <a href="/gallery" className="hover:text-green-700">Gallery</a>
          <a href="/work" className="hover:text-green-700">Work</a>
          <a href="/contact" className="hover:text-green-700">Contact</a>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setOpen(!open)}
        >
          <svg
            width="26"
            height="26"
            fill="none"
            stroke="black"
            strokeWidth="2"
          >
            <path d="M4 7h18M4 13h18M4 19h18" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-inner animate-slideDown">
          <a
            href="/"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 border-b text-gray-800"
          >
            Home
          </a>

          <a
            href="/alphabetical"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 border-b text-gray-800"
          >
            Alphabetical
          </a>

          <a
            href="/gallery"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 border-b text-gray-800"
          >
            Gallery
          </a>

          <a
            href="/work"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 border-b text-gray-800"
          >
            Work
          </a>

          <a
            href="/contact"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-gray-800"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
