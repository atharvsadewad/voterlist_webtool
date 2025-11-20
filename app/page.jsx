"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [query, setQuery] = useState("");
  const [voters, setVoters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load JSON from public/voters.json
  useEffect(() => {
    fetch("/voters.json")
      .then((res) => res.json())
      .then((data) => setVoters(data));
  }, []);

  // Filter list
  useEffect(() => {
    if (!query) return setFiltered([]);

    const q = query.trim().toLowerCase();

    const results = voters.filter((v) =>
      v.surname.toLowerCase().includes(q) ||
      v.fullname.toLowerCase().includes(q)
    );

    setFiltered(results);
  }, [query, voters]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Voter Search
      </h1>

      {/* Search bar animation */}
      <motion.input
        layout
        type="text"
        placeholder="Search surname…"
        className="w-full p-4 mb-6 rounded-xl bg-white shadow focus:ring-2
                   focus:ring-blue-500 outline-none text-gray-800"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      />

      {/* Results list */}
      <AnimatePresence>
        {filtered.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filtered.map((voter) => (
              <motion.div
                key={voter.id}
                layout
                className="p-4 bg-white rounded-xl shadow cursor-pointer border
                           hover:bg-blue-50 transition-all"
                onClick={() => setSelected(voter)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {voter.fullname}
                </h2>
                <p className="text-gray-500 text-sm">
                  House: {voter.house} • Age: {voter.age}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selected.fullname}
              </h2>

              <div className="space-y-2 text-gray-700">
                <p><b>घर क्रमांक:</b> {selected.house}</p>
                <p><b>नाते:</b> {selected.relation}</p>
                <p><b>वय:</b> {selected.age}</p>
                <p><b>EPIC:</b> {selected.epic}</p>
                <p><b>सेक्शन:</b> {selected.section}</p>
                <p><b>अ. क्र.:</b> {selected.serial}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
