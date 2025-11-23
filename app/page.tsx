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
  photo?: string;
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [selected, setSelected] = useState<Voter | null>(null);

  // Restore dark mode
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("voter_dark") : null;
    if (saved) setDarkMode(saved === "1");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("voter_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Load voter JSON
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

    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handlePrint = () => window.print();

  const HERO_IMG = "/IMG-20251123-WA0004.jpg";
  const INSIGHTS_IMG = "/PHOTO-2025-11-22-19-17-37.jpg";

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"} min-h-screen`}>

      {/* ========================= HERO (PORTRAIT-FRIENDLY) ========================= */}
      <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">

        {/* Blurred background */}
        <img
          src={HERO_IMG}
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-70"
          alt="Hero background"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Center portrait */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={HERO_IMG}
            alt="Candidate"
            className="h-[75%] md:h-[85%] object-contain drop-shadow-2xl rounded-xl"
          />
        </div>

        {/* TEXT CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

          <div className="bg-white/80 text-gray-800 text-sm font-semibold px-4 py-1 rounded-md mb-2">
            भारतीय राष्ट्रीय काँग्रेस (महाविकास आघाडी)
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-white drop-shadow-xl">
            चंदन बसवराज पाटील (नागराळकर)
          </h1>

          <p className="text-lg md:text-2xl text-white font-semibold drop-shadow-lg mt-1">
            Ward 16 (B)
          </p>

          <button
            onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-4 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-xl hover:scale-105 transition"
          >
            शोधा (Search)
          </button>

        </div>
      </div>

      {/* ========================= MAIN ========================= */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-12">

        {/* ========================= SEARCH BAR (STICKY) ========================= */}
        <div id="search" className="sticky top-6 z-40">
          <div className={`backdrop-blur-md p-4 rounded-2xl shadow-lg ${darkMode ? "bg-black/40" : "bg-white/80"}`}>
            <div className="flex gap-3 items-center">

              <input
                className={`flex-1 p-3 rounded-xl outline-none focus:ring-2 ${
                  darkMode ? "bg-gray-800 text-white focus:ring-blue-400" : "bg-white text-gray-800 focus:ring-blue-500"
                }`}
                placeholder="Search नाव / आडनाव / EPIC..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

        {/* ========================= INSIGHTS IMAGE ========================= */}
        <section className="mt-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <img src={INSIGHTS_IMG} className="w-full rounded-xl shadow-md object-contain" alt="Insights" />
          </motion.div>
        </section>

        {/* ========================= CANDIDATE DETAILS ========================= */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Profile card */}
          <div className={`p-4 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <img src={HERO_IMG} className="w-full h-48 object-cover rounded-md mb-3" alt="" />

            <div className="text-lg font-bold">चंदन बसवराज पाटील (नागराळकर)</div>
            <div className="text-sm text-gray-500 mb-2">प्रभाग क्र. १६ — नगरसेवक पदाचे उमेदवार</div>

            <div className="flex items-center gap-2 mt-2">
              <div className="w-10 h-10 bg-white border rounded flex items-center justify-center">✋</div>
              <div className="text-sm">भारतीय राष्ट्रीय काँग्रेस (महाविकास आघाडी)</div>
            </div>

            <div className="mt-4 space-y-2">
              <a href="https://www.instagram.com/chandan_patil_nagralkar" className="underline text-blue-600" target="_blank">
                Instagram
              </a>
              <a
                href="https://www.facebook.com/ChandanBaswarajPatilNagralkar?rdid=W1DtEZUwqon0vbIY&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C1ejDxTUM%2F#"
                className="underline text-blue-600"
                target="_blank"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Description */}
          <div className={`md:col-span-2 p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-xl font-bold mb-2">उद्दिष्टे / संदेश</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              येथे प्रादेशिक व मतदारांशी संबंधित माहिती व तपशील दिलेले आहेत. कृपया अधिकृत मतदार यादी तपासा व खात्री करा.
            </p>

            <button
              onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Search Voters
            </button>
          </div>
        </section>

        {/* ========================= SEARCH RESULTS ========================= */}
        <section id="results" className="mt-10">

          {filtered.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Results: <b>{filtered.length}</b></span>

              <button onClick={handlePrint} className="px-3 py-2 bg-green-600 text-white rounded print:hidden">
                Print
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map((v) => (
                <motion.div
                  key={v.voter_id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
        </section>

        {/* ========================= FOOTER ========================= */}
        <footer className="mt-12 mb-8 text-sm text-gray-600 dark:text-gray-300">
          <div className="p-4 rounded-xl shadow bg-white/80 dark:bg-black/40">
            <p>
              सूचना: या वेबसाईटवरील मतदार माहिती कधी कधी चुकीची असू शकते.
              कृपया अधिकृत प्रकाशित मतदार यादी तपासून खात्री करा.
            </p>

            <div className="flex gap-4 mt-3">
              <a href="https://www.instagram.com/chandan_patil_nagralkar" className="underline" target="_blank">Instagram</a>
              <a
                href="https://www.facebook.com/ChandanBaswarajPatilNagralkar?rdid=W1DtEZUwqon0vbIY&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1C1ejDxTUM%2F#"
                className="underline"
                target="_blank"
              >
                Facebook
              </a>
            </div>

            <div className="text-xs text-gray-400 mt-3">
              © {new Date().getFullYear()} चंदन बसवराज पाटील (नागराळकर)
            </div>
          </div>
        </footer>

      </main>

      {/* ========================= MODAL ========================= */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`relative w-full max-w-lg p-6 rounded-xl shadow-xl ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
            >
              <h3 className="text-xl font-bold mb-3">{selected.name_marathi}</h3>

              <div className="space-y-1 text-sm">
                <p><b>घर क्रमांक:</b> {selected.house_no}</p>
                <p><b>नाते:</b> {selected.relation_type}</p>
                <p><b>नाव (नाते):</b> {selected.relation_name_marathi}</p>
                <p><b>वय:</b> {selected.age}</p>
                <p><b>लिंग:</b> {selected.gender}</p>
                <p><b>EPIC:</b> {selected.voter_id}</p>
                <p><b>अनुक्रमांक:</b> {selected.serial_no}</p>
              </div>

              <button onClick={() => setSelected(null)} className="mt-4 w-full py-2 bg-blue-600 text-white rounded">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
