"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const IMAGES = [
  "/mnt/data/IMG-20251123-WA0010.jpg",
  "/mnt/data/IMG-20251123-WA0004.jpg",
  "/mnt/data/PHOTO-2025-11-22-19-17-37.jpg",
];

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Gallery</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMAGES.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="rounded overflow-hidden shadow">
              <img src={src} className="w-full h-44 object-cover" />
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
