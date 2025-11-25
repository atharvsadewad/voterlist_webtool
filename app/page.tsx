"use client";
import TranslitSearch from "../components/TranslitSearch";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Image as LucideImage,
  List as LucideList,
  Phone as LucidePhone,
  Briefcase as LucideBriefcase,
  BarChart2 as LucideBar,
  Share2 as LucideShare,
} from "lucide-react";

import Modal from "../components/Modal";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface Voter {
  serial_no: number;
  voter_id: string;
  name_marathi: string;
  relation_name_marathi: string;
  relation_type: string;
  house_no: string;
  age: number;
  gender: string;
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [selected, setSelected] = useState<Voter | null>(null);

  // Restore Dark Mode
  useEffect(() => {
    const saved = localStorage.getItem("voter_dark");
    if (saved) setDarkMode(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("voter_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Load voters data
  useEffect(() => {
    fetch(`/voters.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then(setVoters)
      .catch(() => setVoters([]));
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return setFiltered([]);
    const q = query.toLowerCase();
    const res = voters.filter(
      (v) =>
        (v.name_marathi || "").toLowerCase().includes(q) ||
        (v.relation_name_marathi || "").toLowerCase().includes(q) ||
        (v.voter_id || "").toLowerCase().includes(q)
    );
    setFiltered(res);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // ⭐ FIXED PRINT FUNCTION (ONLY CHANGE)
  const handlePrint = () => {
    const container = document.getElementById("print-area-columns");
    if (!container) return;

    container.innerHTML = filtered
      .map((v) => {
        return `
        <div class="print-card">
          <div class="name" style="font-weight:700;font-size:14px;margin-bottom:6px;">
            ${v.name_marathi}
          </div>
          <div class="meta">घर क्रमांक: ${v.house_no} • वय: ${v.age}</div>
          <div class="meta">नाते: ${v.relation_type} - ${v.relation_name_marathi}</div>
          <div class="meta" style="margin-top:6px;">
            EPIC: ${v.voter_id} • अनुक्रमांक: ${v.serial_no}
          </div>
        </div>`;
      })
      .join("");

    window.print();
  };

  // Images
  const HERO_IMG = "/IMG-20251123-WA0004.jpg";
  const BANNER_IMG = "/banner.jpg";
  const INSIGHTS_IMG = "/PHOTO-2025-11-22-19-17-37.jpg";
  const SNAPSHOT_IMG = "/snapshot-ward16.png";

  return (
    <div className={`min-h-screen transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />

      {/* HERO */}
      <header
        className={`relative w-full overflow-hidden pb-10 transition-all duration-300 ${
          darkMode ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900" : "bg-gradient-to-br from-orange-500 via-white to-green-600"
        }`}
      >
        <div className={`${darkMode ? "bg-black/20" : "bg-white/10"} absolute inset-0`} />
        <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className={`inline-block text-sm font-semibold px-4 py-1 rounded-md mb-3 ${darkMode ? "bg-white/20 text-white" : "bg-white/70 text-gray-700"}`}>
              भारतीय राष्ट्रीय काँग्रेस (महाविकास आघाडी)
            </div>

            <h1 className={`text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-xl ${darkMode ? "text-white" : "text-black"}`}>
              चंदन बस्वराज पाटील (नागराळकर)
            </h1>

            <p className="text-xl md:text-3xl font-semibold mt-2 drop-shadow-lg text-white">Ward 16 (B)</p>

            <div className="mt-5 flex justify-center md:justify-start gap-3">
              <button
                onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:scale-105 transition"
              >
                शोधा (Search)
              </button>

              <a
                href="/alphabetical"
                className={`px-5 py-3 rounded-full border font-semibold flex items-center gap-2 transition ${
                  darkMode ? "bg-white/20 border-white/30 text-white hover:bg-white/30" : "bg-white/30 border-white/40 text-white hover:opacity-90"
                }`}
              >
                <LucideList size={16} /> Alphabetical
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <img src={HERO_IMG} alt="Hero" className="w-full max-w-sm md:max-w-md object-contain drop-shadow-2xl rounded-xl" />
          </div>
        </div>
      </header>

      {/* BANNER */}
      <div className="max-w-5xl mx-auto px-4 mt-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-xl overflow-hidden shadow-xl">
          <img src={BANNER_IMG} className="w-full object-cover" alt="Banner" />
        </motion.div>
      </div>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* SEARCH */}
        <div id="search" className="sticky top-6 z-40 mt-4">
          <div className={`backdrop-blur-xl p-4 rounded-2xl shadow-lg border transition-all ${darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              <TranslitSearch
  voters={voters}
  onSearch={(results) => {
    setFiltered(results);
    setTimeout(
      () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
      150
    );
  }}
  placeholder="Search नाव / आडनाव / EPIC..."
/>

              <div className="flex gap-2">
                <button onClick={handleSearch} className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">Search</button>

                <button onClick={() => { setQuery(""); setFiltered([]); }} className={`px-4 py-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>Clear</button>

                <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-3 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  {darkMode ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/alphabetical" className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col gap-3">
              <div className="p-2 bg-orange-50 rounded-md"><LucideList size={22} className="text-orange-600" /></div>
              <div className="font-semibold">Alphabetical</div>
              <div className="text-xs text-gray-500">Browse voters A → ज्ञ</div>
            </a>

            <a href="/gallery" className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col gap-3">
              <div className="p-2 bg-indigo-50 rounded-md"><LucideImage size={22} className="text-indigo-600" /></div>
              <div className="font-semibold">Gallery</div>
              <div className="text-xs text-gray-500">Photos & banners</div>
            </a>

            <a href="/work" className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col gap-3">
              <div className="p-2 bg-emerald-50 rounded-md"><LucideBriefcase size={22} className="text-emerald-600" /></div>
              <div className="font-semibold">Work</div>
              <div className="text-xs text-gray-500">Projects & events</div>
            </a>

            <a href="/contact" className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col gap-3">
              <div className="p-2 bg-sky-50 rounded-md"><LucidePhone size={22} className="text-sky-600" /></div>
              <div className="font-semibold">Contact</div>
              <div className="text-xs text-gray-500">Get in touch</div>
            </a>
          </div>
        </section>

        {/* Ward Snapshot & Stats */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">आपल्या प्रभागाची माहिती (Ward 16 Overview)</h3>
                <p className="text-sm text-gray-500">Snapshot from electoral roll</p>
              </div>
              <a href={SNAPSHOT_IMG} className="text-sm underline" target="_blank" rel="noreferrer">Open image</a>
            </div>

            <div className="mt-4">
              <img src={SNAPSHOT_IMG} className="w-full rounded-lg shadow-md" alt="Ward snapshot" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-md"><LucideBar size={20} className="text-yellow-600" /></div>
              <div>
                <div className="font-semibold">Ward Stats</div>
                <p className="text-xs text-gray-500">Total voters & overview</p>
              </div>
            </div>

            <div className="text-2xl font-bold">3,826</div>
            <p className="text-xs text-gray-500">Registered Voters</p>

            <div className="flex gap-2 mt-auto">
              <a href="/alphabetical" className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md flex items-center gap-1 justify-center">
                <LucideList size={14} /> Alphabetical
              </a>

              <button
                onClick={handlePrint}
                className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md flex items-center gap-1"
              >
                <LucideShare size={14} /> Print
              </button>
            </div>
          </motion.div>
        </section>

        {/* Search results */}
        <section id="results" className="mt-10">
          {filtered.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Results: <b>{filtered.length}</b></span>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-3 py-2 bg-green-600 text-white rounded">Print</button>
                <a href="/alphabetical" className="px-3 py-2 bg-white border rounded">Open alphabetical</a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((v) => (
              <motion.div
                key={v.voter_id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelected(v)}
                className={`p-4 rounded-xl shadow cursor-pointer ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="text-lg font-semibold">{v.name_marathi}</div>
                <div className="text-sm text-gray-500">घर क्रमांक: {v.house_no} • वय: {v.age}</div>
                <div className="text-xs text-gray-400 mt-2">EPIC: {v.voter_id} • अनुक्रमांक: {v.serial_no}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ⭐ FIXED PRINT AREA (2-column correct print layout) */}
        <div id="print-area" className="print-only">
          <div id="print-area-columns"></div>
        </div>

        <Footer />
      </main>

      {/* MODAL */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} voter={selected} darkMode={darkMode} />
    </div>
  );
}
