"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

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
  const [voters, setVoters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("अ");
  const [query, setQuery] = useState("");
  const [booth, setBooth] = useState(""); // booth filter later

  // for correct Marathi sorting
  const collator = useMemo(() => new Intl.Collator("mr"), []);

  useEffect(() => {
    fetch("/voters.json")
      .then((r) => r.json())
      .then((data) => setVoters(data));
  }, []);

  // booth range logic (client will give actual ranges)
  const boothRanges = {
    "1": { start: 1, end: 850 },
    "2": { start: 851, end: 1650 },
    "3": { start: 1651, end: 2500 },
    "4": { start: 2501, end: 3500 }
  };

  // Filtered & sorted voters
  const filtered = useMemo(() => {
    let list = voters;

    // Filter by Marathi letter
    list = list.filter((v) =>
      (v.name_marathi || "").trim().startsWith(selectedLetter)
    );

    // Optional booth filter
    if (booth && boothRanges[booth]) {
      const { start, end } = boothRanges[booth];
      list = list.filter(
        (v) => v.serial_no >= start && v.serial_no <= end
      );
    }

    // Search inside alphabetical list
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((v) =>
        (v.name_marathi || "").toLowerCase().includes(q)
      );
    }

    // Sort alphabetically (correct Marathi order)
    list = [...list].sort((a, b) =>
      collator.compare(a.name_marathi, b.name_marathi)
    );

    return list;
  }, [voters, selectedLetter, query, booth, collator]);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Marathi Alphabetical Voter List
      </h1>

      {/* Letter Navigation */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {LETTERS.map((l) => (
          <button
            key={l}
            onClick={() => {
              setSelectedLetter(l);
              setQuery("");
            }}
            className={`px-3 py-1 rounded-md text-sm font-semibold border ${
              selectedLetter === l
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Booth filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* Booth dropdown */}
        <select
          value={booth}
          onChange={(e) => setBooth(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="">All Booths</option>
          <option value="1">Booth 1</option>
          <option value="2">Booth 2</option>
          <option value="3">Booth 3</option>
          <option value="4">Booth 4</option>
        </select>

        {/* Search field */}
        <input
          type="text"
          placeholder={`Search in "${selectedLetter}"...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
        />
      </div>

      {/* Result Count */}
      <div className="text-gray-600 text-sm mb-3">
        Showing <b>{filtered.length}</b> voters starting with <b>{selectedLetter}</b>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((v, i) => (
          <motion.div
            key={v.voter_id + i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-4 rounded-xl shadow bg-white"
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
    </div>
  );
}
