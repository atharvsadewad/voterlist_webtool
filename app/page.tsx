"use client";

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
        (v.name_marathi || "").toLowerCase().includes(q) ||
        (v.relation_name_marathi || "").toLowerCase().includes(q) ||
        (v.voter_id || "").toLowerCase().includes(q)
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
  const SNAPSHOT_IMG = "/snapshot-ward16.png"; // replace with actual file if different

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen`}>
      <Navbar />

      {/* ========== HERO (Option C: Tricolor Gradient) ========== */}
      <header className="relative w-full overflow-hidden pb-10 bg-gradient-to-br from-orange-500 via-white to-green-600">
        <div className="absolute inset-0 bg-white/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-white/70 text-gray-700 text-sm font-semibold px-4 py-1 rounded-md mb-3">
              भारतीय राष्ट्रीय काँग्रेस (महाविकास आघाडी)
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-black drop-shadow-xl">
              चंदन बस्वराज पाटील (नागराळकर)
            </h1>

            <p className="text-xl md:text-3xl font-semibold text-white mt-2 drop-shadow-lg">Ward 16 (B)</p>

            <div className="mt-5 flex justify-center md:justify-start gap-3">
              <button
                onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:scale-105 transition"
              >
                शोधा (Search)
              </button>

              <a
                href="/alphabetical"
                className="px-5 py-3 rounded-full bg-white/30 border border-white/40 text-white font-semibold shadow hover:opacity-90 transition flex items-center gap-2"
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

      {/* ========== Dashboard / Feature Grid (below search) ========== */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
        {/* SEARCH BOX */}
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

        {/* ===== Dashboard quick-feature tiles (mobile-first, tappable) ===== */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/alphabetical"
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-start gap-3 shadow hover:shadow-lg transition"
            >
              <div className="p-2 rounded-md bg-orange-50 group-hover:bg-orange-100">
                <LucideList size={22} className="text-orange-600" />
              </div>
              <div className="font-semibold">Alphabetical</div>
              <div className="text-xs text-gray-500">Browse voters A → ज्ञ</div>
            </a>

            <a
              href="/gallery"
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-start gap-3 shadow hover:shadow-lg transition"
            >
              <div className="p-2 rounded-md bg-indigo-50 group-hover:bg-indigo-100">
                <LucideImage size={22} className="text-indigo-600" />
              </div>
              <div className="font-semibold">Gallery</div>
              <div className="text-xs text-gray-500">Photos & banners</div>
            </a>

            <a
              href="/work"
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-start gap-3 shadow hover:shadow-lg transition"
            >
              <div className="p-2 rounded-md bg-emerald-50 group-hover:bg-emerald-100">
                <LucideBriefcase size={22} className="text-emerald-600" />
              </div>
              <div className="font-semibold">Work</div>
              <div className="text-xs text-gray-500">Projects & events</div>
            </a>

            <a
              href="/contact"
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-start gap-3 shadow hover:shadow-lg transition"
            >
              <div className="p-2 rounded-md bg-sky-50 group-hover:bg-sky-100">
                <LucidePhone size={22} className="text-sky-600" />
              </div>
              <div className="font-semibold">Contact</div>
              <div className="text-xs text-gray-500">Get in touch</div>
            </a>
          </div>
        </section>

        {/* ===== Secondary feature row (Dashboard / Share / Print) ===== */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">आपल्या प्रभागाची माहिती (Ward 16 Overview)</h3>
                <p className="text-sm text-gray-500">Snapshot from final electoral roll — quick glance</p>
              </div>

              <div className="flex gap-2 items-center">
                <a href={SNAPSHOT_IMG} target="_blank" rel="noreferrer" className="text-sm underline">
                  Open image
                </a>
              </div>
            </div>

            <div className="mt-4">
              <img src={SNAPSHOT_IMG} alt="Ward 16 Overview" className="w-full object-cover rounded-lg shadow-md" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-md">
                <LucideBar size={18} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-sm font-semibold">Ward Stats</div>
                <div className="text-xs text-gray-500">Total voters, booths, snapshot</div>
              </div>
            </div>

            <div className="flex-1">
              <div className="text-2xl font-bold">3,826</div>
              <div className="text-xs text-gray-500">Total Registered Voters</div>
            </div>

            <div className="flex gap-2">
              <a href="/alphabetical" className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md flex items-center justify-center gap-2">
                <LucideList size={14} /> Open Alphabetical
              </a>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md flex items-center gap-2"
              >
                <LucideShare size={14} /> Print / Share
              </button>
            </div>
          </motion.div>
        </section>

        {/* ========== Results / Search output ========== */}
        <section id="results" className="mt-8">
          {filtered.length > 0 && (
            <div className="mb-4 flex items-center justify-between no-print">
              <span className="text-sm text-gray-500">Results: <b>{filtered.length}</b></span>

              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-3 py-2 bg-green-600 text-white rounded">
                  Print
                </button>
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
                viewport={{ once: true }}
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

        {/* INSIGHTS IMAGE (kept above footer) */}
        <section className="mt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-center">Insights</h3>
              <img src={INSIGHTS_IMG} alt="Insights" className="w-full object-contain rounded-xl" />
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>

      {/* MODAL */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} voter={selected} darkMode={darkMode} />
    </div>
  );
}
