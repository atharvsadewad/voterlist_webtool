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

export default function AlphabeticalPage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState("अ");
  const [query, setQuery] = useState("");

  // Marathi-aware sorting
  const collator = useMemo(() => new Intl.Collator("mr"), []);

  useEffect(() => {
    fetch("/voters.json")
      .then((r) => r.json())
      .then((data) => setVoters(data));
  }, []);

  // Filter + Sort logic
  const filtered = useMemo(() => {
    let list = voters;

    // letter filter
    list = list.filter((v) =>
      (v.name_marathi || "").trim().startsWith(selectedLetter)
    );

    // search inside the letter list
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((v) =>
        (v.name_marathi || "").toLowerCase().includes(q)
      );
    }

    // sort alphabetically in correct Marathi order
    list = [...list].sort((a, b) =>
      collator.compare(a.name_marathi, b.name_marathi)
    );

    return list;
  }, [voters, selectedLetter, query, collator]);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">

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

      {/* Search */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder={`Search in "${selectedLetter}"...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
        />
      </div>

      <div className="text-gray-600 text-sm mb-3">
        Showing <b>{filtered.length}</b> voters starting with <b>{selectedLetter}</b>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((v) => (
          <motion.div
            key={v.voter_id}
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
