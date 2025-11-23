"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";

// Marathi Letters
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
      .then((data) => setVoters(data))
      .catch(() => setVoters([]));
  }, []);

  // FILTER + SORT
  const filtered = useMemo(() => {
    let list = voters || [];

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
      collator.compare(a.name_marathi || "", b.name_marathi || "")
    );
  }, [voters, selectedLetter, query, showAll, collator]);

  // PRINT (same logic as home page)
  const handlePrint = () => {
    const printArea = document.getElementById("print-area");
    if (!printArea) return;

    // Build full card HTML for print
    printArea.innerHTML = filtered
      .map((v) => {
        const name = v.name_marathi || "";
        const house = v.house_no || "NA";
        const age = v.age || "NA";
        const relationType = v.relation_type || "";
        const relationName = v.relation_name_marathi || "";
        const epic = v.voter_id || "";
        const serial = v.serial_no || "";

        return `
          <div class="print-card">
            <div class="name" style="font-weight:700;font-size:14px;margin-bottom:6px;">${name}</div>
            <div class="meta">घर क्रमांक: ${house} • वय: ${age}</div>
            <div class="meta">नाते: ${relationType} ${relationName ? `- ${relationName}` : ""}</div>
            <div class="meta" style="margin-top:6px;">EPIC: ${epic} • अनुक्रमांक: ${serial}</div>
          </div>
        `;
      })
      .join("");

    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Marathi Alphabetical Voter List
        </h1>

        {/* Letters */}
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

        {/* Full list button */}
        <div className="text-center mb-6">
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

        {/* Search */}
        <div className="mb-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder={showAll ? "Search full list…" : `Search in "${selectedLetter}"…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Print button */}
        {filtered.length > 0 && (
          <div className="text-right mb-4 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700"
            >
              Print List
            </button>
          </div>
        )}

        <div className="text-gray-600 text-sm mb-3">
          Showing <b>{filtered.length}</b> results{" "}
          {showAll ? "(A → ज्ञ)" : `starting with "${selectedLetter}"`}
        </div>

        {/* On-screen result cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
          {filtered.map((v) => (
            <motion.div
              key={v.voter_id + "-" + v.serial_no}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
              onClick={() => setModalVoter(v)}
              className="p-4 rounded-xl shadow bg-white cursor-pointer"
            >
              <div className="font-semibold text-lg">{v.name_marathi}</div>
              <div className="text-sm text-gray-500">
                घर क्रमांक: {v.house_no} • वय: {v.age}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                EPIC: {v.voter_id} • अनुक्रमांक: {v.serial_no}
              </div>
            </motion.div>
          ))}
        </div>

        {/* HIDDEN PRINT AREA (your CSS controls it) */}
        <div id="print-area" className="print-only"></div>
      </div>

      <Modal
        isOpen={!!modalVoter}
        onClose={() => setModalVoter(null)}
        voter={modalVoter}
        darkMode={false}
      />
    </div>
  );
}
