"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Footer from "../components/Footer";

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

  // Restore dark mode
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
        v.name_marathi.toLowerCase().includes(q) ||
        v.relation_name_marathi.toLowerCase().includes(q) ||
        v.voter_id.toLowerCase().includes(q)
    );

    setFiltered(res);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 150);
  };

  // local uploaded images — preview-friendly paths
  const HERO_IMG = "/IMG-20251123-WA0004.jpg";
  const BANNER_IMG = "/banner.jpg";
  const INSIGHTS_IMG = "/PHOTO-2025-11-22-19-17-37.jpg";

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"} min-h-screen`}>
      <Navbar />

{/* ========== HERO FIXED ========== */}
<div className="relative w-full overflow-hidden pb-10">

  {/* Blurred background */}
  <img
    src={HERO_IMG}
    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/20" />

  {/* CONTENT */}
  <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-10">

    {/* TEXT LEFT */}
    <div className="flex-1 text-center md:text-left">
      <div className="bg-white/70 text-gray-700 text-sm font-semibold px-4 py-1 rounded-md inline-block mb-3">
        भारतीय राष्ट्रीय काँग्रेस (महाविकास आघाडी)
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-black drop-shadow-xl">
        चंदन बस्वराज पाटील (नागराळकर)
      </h1>

      <p className="text-xl md:text-3xl font-semibold text-white mt-2 drop-shadow-lg">
        Ward 16 (B)
      </p>

      <button
        onClick={() =>
          document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })
        }
        className="mt-5 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:scale-105 transition"
      >
        शोधा (Search)
      </button>
    </div>

    {/* IMAGE RIGHT */}
    <div className="flex-1 flex justify-center">
      <img
        src={HERO_IMG}
        className="w-full max-w-sm md:max-w-md object-contain drop-shadow-2xl rounded-xl"
      />
    </div>
  </div>
</div>



      {/* BANNER - separated cleanly, no negative margin */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-xl overflow-hidden shadow-xl"
        >
          <img src={BANNER_IMG} alt="Candidate Banner" className="w-full object-cover" />
        </motion.div>
      </div>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-10">
        {/* SEARCH — fixed for mobile: stack on small screens */}
        <div id="search" className="sticky top-6 z-40">
          <div className={`backdrop-blur-md p-4 rounded-2xl shadow-lg ${darkMode ? "bg-black/40" : "bg-white/80"}`}>
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              <input
                className={`flex-1 p-3 rounded-xl outline-none focus:ring-2 ${
                  darkMode ? "bg-gray-800 text-white focus:ring-blue-400" : "bg-white text-gray-800 focus:ring-blue-500"
                }`}
                placeholder="Search नाव / आडनाव / EPIC..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              <div className="flex gap-2 md:flex-row md:items-center">
                <button onClick={handleSearch} className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
                  Search
                </button>

                <button
                  onClick={() => {
                    setQuery("");
                    setFiltered([]);
                  }}
                  className="px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700"
                >
                  Clear
                </button>

                {/* Dark-mode toggle small */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-3 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 ml-0 md:ml-2"
                >
                  {darkMode ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </div>
        </div>

{/* ========================= RESULTS ========================= */}
<section id="results" className="mt-12">
  {filtered.length > 0 && (
    <div className="mb-4 flex items-center justify-between no-print">
      <span className="text-sm text-gray-500">
        Results: <b>{filtered.length}</b>
      </span>

      <button onClick={() => window.print()} className="px-3 py-2 bg-green-600 text-white rounded">
        Print
      </button>
    </div>
  )}

  {/* Visible grid for website */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
    <AnimatePresence>
      {filtered.map((v) => (
        <motion.div
          key={v.voter_id}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-xl shadow cursor-pointer ${darkMode ? "bg-gray-800" : "bg-white"}`}
          onClick={() => setSelected(v)}
        >
          <div className="text-lg font-semibold">{v.name_marathi}</div>
          <div className="text-sm text-gray-500">घर क्रमांक: {v.house_no} • वय: {v.age}</div>
          <div className="text-xs text-gray-400 mt-2">EPIC: {v.voter_id} • अनुक्रमांक: {v.serial_no}</div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>


{/* PRINT-ONLY 2 COLUMN DETAILS */}
<div id="print-area" className="print-only" style={{ display: "none" }}>
  {filtered.map((v) => (
    <div
      key={v.voter_id}
      className="print-card"
    >
      <p><b>नाव:</b> {v.name_marathi}</p>
      <p><b>घर क्रमांक:</b> {v.house_no}</p>
      <p><b>नाते:</b> {v.relation_type}</p>
      <p><b>नाव (नाते):</b> {v.relation_name_marathi}</p>
      <p><b>वय:</b> {v.age}</p>
      <p><b>लिंग:</b> {v.gender}</p>
      <p><b>EPIC:</b> {v.voter_id}</p>
      <p><b>अनुक्रमांक:</b> {v.serial_no}</p>
    </div>
  ))}
</div>
</section>

        {/* INSIGHTS LAST */}
        <section className="mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl shadow-xl overflow-hidden">
            <img src={INSIGHTS_IMG} className="w-full object-contain rounded-xl" />
          </motion.div>
        </section>

        <Footer />
      </main>

      {/* MODAL */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} voter={selected} darkMode={darkMode} />
    </div>
  );
} 
