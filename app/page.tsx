"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Voter {
  serial_no: number;
  voter_id: string;
  name_marathi: string;
  relation_name_marathi: string;
  relation_type: string;
  house_no: string;
  age: number;
  gender: string;
  // optional fields may exist
  photo?: string;
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [selected, setSelected] = useState<Voter | null>(null);

  // restore dark mode
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("voter_dark") : null;
    if (saved) setDarkMode(saved === "1");
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("voter_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // load voters once
  useEffect(() => {
    fetch(`/voters.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => setVoters(d))
      .catch(() => setVoters([]));
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return setFiltered([]);
    const q = query.trim().toLowerCase();
    const res = voters.filter(
      (v) =>
        (v.name_marathi || "").toLowerCase().includes(q) ||
        (v.relation_name_marathi || "").toLowerCase().includes(q) ||
        (v.voter_id || "").toLowerCase().includes(q)
    );
    setFiltered(res);
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handlePrint = () => window.print();

  // Image paths (your uploaded files)
  const HERO_IMG = "/mnt/data/IMG-20251123-WA0004.jpg";
  const INSIGHTS_IMG = "/mnt/data/PHOTO-2025-11-22-19-17-37.jpg";

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"} min-h-screen`}>
      {/* HERO — full width poster (fit) */}
      <div className="w-full h-[340px] md:h-[420px] relative overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Hero Poster"
          className="object-cover w-full h-full"
          style={{ objectPosition: "center" }}
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-black/25" />
        {/* heading + CTA */}
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-16 gap-4">
          <div className="rounded-md px-3 py-1 bg-white/80 text-sm font-semibold text-gray-800 inline-block">
            भारतीय राष्ट्रीय काँग्रेस (महाविकास आघाडी)
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
            <span className="block">{`चंदन बसवराज पाटील (नागराळकर)`}</span>
            <span className="block text-lg md:text-2xl mt-1">ward 16 (B)</span>
          </h1>

          <div className="mt-3">
            <button
              onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
              className="px-5 py-3 rounded-full bg-white text-gray-900 font-semibold shadow hover:scale-[1.02] transition-transform"
            >
              शोधा (Search)
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-12"> 
        {/* sticky search area */}
        <div id="search" className="sticky top-6 z-40">
          <div
            className={`backdrop-blur-md p-4 rounded-2xl shadow-lg ${darkMode ? "bg-black/40" : "bg-white/80"}`}
          >
            <div className="flex gap-3 items-center">
              <input
                className={`flex-1 p-3 rounded-xl outline-none focus:ring-2 ${
                  darkMode ? "bg-gray-800 text-white focus:ring-blue-400" : "bg-white text-gray-800 focus:ring-blue-500"
                }`}
                placeholder="Search नाव / आडनाव / EPIC..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button onClick={handleSearch} className="px-5 py-3 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700">
                Search
              </button>
              <button
                onClick={() => {
                  setQuery("");
                  setFiltered([]);
                }}
                className="px-3 py-3 rounded-xl bg-gray-200 dark:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Insights */}
        <section className="mt-6 bg-transparent">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <img src={INSIGHTS_IMG} alt="Ward 16 Snapshot" className="w-full rounded-xl shadow-md object-contain" />
          </motion.div>
        </section>

        {/* Candidate details */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className={`col-span-1 rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
            <img src={HERO_IMG} alt="Candidate photo" className="w-full h-48 object-cover rounded-md mb-3" />
            <div className="text-lg font-bold">चंदन बसवराज पाटील (नागराळकर)</div>
            <div className="text-sm text-gray-500 mb-2">प्रभाग क्र. १६ — नगरसेवक पदाचे उमेदवार</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-10 h-10 rounded bg-white flex items-center justify-center border">
                {/* party symbol — using a simple hand emoji since we don't have asset */}
                ✋
              </div>
              <div className="text-sm">भारतीय राष्ट्रीय काँग्रेस (महाविकास आघाडी)</div>
            </div>

            <div className="mt-4 space-y-2">
              <a
                href="https://www.instagram.com/chandan_patil_nagralkar"
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-blue-600 underline"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/ChandanBaswarajPatilNagralkar?rdid=W1DtEZUwqon0vbIY&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C1ejDxTUM%2F#"
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-blue-600 underline"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* description / CTA */}
          <div className={`md:col-span-2 rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
            <h3 className="text-xl font-bold mb-2">उद्दिष्टे / संदेश</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              येथे प्रादेशिक व मतदारांशी संबंधित माहिती आणि तपशील दिलेले आहेत. कृपया अधिकृत मतदार यादी तपासा व खात्री करा.
            </p>
            <div className="mt-4">
              <button
                onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Search Voters
              </button>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section id="results" className="mt-8">
          {filtered.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Results: <strong>{filtered.length}</strong>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-3 py-2 rounded bg-green-600 text-white print:hidden">
                  Print
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map((v) => (
                <motion.div
                  key={v.voter_id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"} cursor-pointer`}
                  onClick={() => setSelected(v)}
                >
                  <div className="font-semibold text-lg">{v.name_marathi}</div>
                  <div className="text-sm text-gray-500">घर क्रमांक: {v.house_no} • वय: {v.age}</div>
                  <div className="text-xs mt-2 text-gray-400">EPIC: {v.voter_id} • अनुक्रमांक: {v.serial_no}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Disclaimer + Footer */}
        <footer className="mt-12 mb-8 text-sm text-gray-600 dark:text-gray-300">
          <div className="rounded-xl p-4 bg-white/80 dark:bg-black/40 shadow">
            <p className="mb-2">
              सूचित: या वेबसाईटवरील मतदार माहिती कधी कधी चुकीची असू शकते. कृपया अधिकृत प्रकाशित मतदार यादी
              तपासून खात्री करा.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/chandan_patil_nagralkar" target="_blank" rel="noreferrer" className="underline">
                Instagram
              </a>
              <a href="https://www.facebook.com/ChandanBaswarajPatilNagralkar?rdid=W1DtEZUwqon0vbIY&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C1ejDxTUM%2F#" target="_blank" rel="noreferrer" className="underline">
                Facebook
              </a>
            </div>
            <div className="text-xs text-gray-400 mt-3">
              © {new Date().getFullYear()} चंदन बसवराज पाटील (नागराळकर)
            </div>
          </div>
        </footer>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
            <motion.div className={`relative max-w-lg w-full rounded-xl p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-bold mb-2">{selected.name_marathi}</h3>
              <div className="text-sm space-y-1">
                <div><b>घर क्रमांक:</b> {selected.house_no}</div>
                <div><b>नाते:</b> {selected.relation_type}</div>
                <div><b>नाव (नाते):</b> {selected.relation_name_marathi}</div>
                <div><b>वय:</b> {selected.age}</div>
                <div><b>लिंग:</b> {selected.gender}</div>
                <div><b>EPIC:</b> {selected.voter_id}</div>
                <div><b>अनुक्रमांक:</b> {selected.serial_no}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setSelected(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
