"use client";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">

        {/* INC Hand Symbol (SVG) */}
        <div className="flex items-center">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0ea5e9"   /* Congress Blue */
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

        {/* Text */}
        <span className="font-semibold text-gray-800 text-lg tracking-wide">
          Indian National Congress, Udgir
        </span>
      </div>

      {/* Congress color bar */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#138808] via-[#ffffff] to-[#ff9933]" />
    </header>
  );
}
