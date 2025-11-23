"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";

// Standard Marathi alphabet
const LETTERS = [
  "अ","आ","इ","ई","उ","ऊ","ए","ऐ","ओ","औ","अं","अः",
  "क","ख","ग","घ","ङ",
  "च","छ","ज","झ","ञ",
  "ट","ठ","ड","ढ","ण",
  "त","थ","द","ध","न",
  "प","फ","ब","भ","म",
  "य","र","ल","व",
  "श","ष","स","ह","ळ",
  "क्ष","ज्ञ"
];

export default function AlphabeticalPage() {
  const [voters, setVoters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState("अ");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [modalVoter, setModalVoter] = useState<any | null>(null);

  const collator = useMemo(() => new Intl.Collator("mr"), []);

  useEffect(() => {
    fetch("/voters.json?t=" + Date.now())
      .then((r) => r.json())
      .then((data) => setVoters(data));
  }, []);

  // FILTER + SORT LOGIC
  const filtered = useMemo(() => {
    let list = voters;

    if (!showAll) {
      list = list.filter((v) =>
        (v.name_marathi || "").trim().startsWith(selectedLetter)
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((v) =>
        (v.name_marathi || "").toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) =>
      collator.compare(a.name_marathi, b.name_marathi)
    );
  }, [voters, selectedLetter, query, showAll, collator]);

  return (
    <div className="min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Marathi Alphabetical Voter List
        </h1>

        {/* LETTER BUTTONS */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => {
                setSelectedLetter(l);
                setShowAll(false);
                setQuery("");
              }}
              className={`px-3 py-1 rounded-md text-sm font-semibold border ${
                selectedLetter === l && !showAll
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* SHOW FULL LIST BUTTON */}
        <div className="text-center mb-8">
          <button
            onClick={() => {
              setShowAll(true);
              setQuery("");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Show Full Alphabetical List
          </button>
        </div>

        {/* SEARCH BOX */}
        <div className="mb-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder={
              showAll ? "Search full list…" : `Search in "${selectedLetter}"…`
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* PRINT BUTTON */}
        {filtered.length > 0 && (
          <div className="text-right mb-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700"
            >
              Print List
            </button>
          </div>
        )}

        {/* RESULT COUNT */}
        <div className="text-gray-600 text-sm mb-3">
          Showing <b>{filtered.length}</b> results{" "}
          {showAll ? "(A → ज्ञ)" : `starting with "${selectedLetter}"`}
        </div>

        {/* RESULTS GRID */}
        <div
          id="alphabet-grid"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10 print:grid print:grid-cols-3"
        >
          {filtered.map((voter) => (
            <motion.div
              key={voter.voter_id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              onClick={() => setModalVoter(voter)}
              className="p-4 rounded-xl shadow bg-white cursor-pointer print:border print:shadow-none print:p-2"
            >
              <div className="font-semibold text-lg">{voter.name_marathi}</div>
              <div className="text-sm text-gray-500">
                घर क्रमांक: {voter.house_no} • वय: {voter.age}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                EPIC: {voter.voter_id} • अनुक्रमांक: {voter.serial_no}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={!!modalVoter}
        onClose={() => setModalVoter(null)}
        voter={modalVoter}
        darkMode={false}
      />
    </div>
  );
}
