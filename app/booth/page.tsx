"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";

interface Voter {
  serial_no: number;          // original serial
  voter_id: string;
  name_marathi: string;
  relation_name_marathi: string;
  relation_type: string;
  house_no: string;
  age: number;
  gender: string;

  // added for booth logic
  booth?: number;
  boothSerial?: number;       // renumbered booth serial
}

export default function BoothWisePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [boothList, setBoothList] = useState<Voter[]>([]); // active booth voters (renumbered)
  const [filtered, setFiltered] = useState<Voter[]>([]); // search results inside booth
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [modalVoter, setModalVoter] = useState<Voter | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode restore
  useEffect(() => {
    const saved = localStorage.getItem("voter_dark");
    if (saved) setDarkMode(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("voter_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Load voters
  useEffect(() => {
    fetch(`/voters.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then(setVoters)
      .catch(() => setVoters([]));
  }, []);

  // Booth ranges
  const boothRanges: Record<number, { start: number; end: number }> = {
    1: { start: 1, end: 944 },
    2: { start: 945, end: 1923 },
    3: { start: 1924, end: 2881 },
    4: { start: 2882, end: 3826 },
  };

  // LOAD BOOTH → slice + renumber correctly
  const loadBooth = (booth: number) => {
    const { start, end } = boothRanges[booth];

    const sliced = voters.filter(
      (v) => v.serial_no >= start && v.serial_no <= end
    );

    // RENNUMBER STARTING FROM 1
    const renumbered = sliced.map((v, i) => ({
      ...v,
      booth,
      boothSerial: i + 1, // very important
    }));

    setBoothList(renumbered);
    setFiltered(renumbered);
    setSelectedBooth(booth);
    setSearch("");
  };

  // SEARCH only inside selected booth
  const handleSearch = () => {
    if (!search.trim()) return setFiltered(boothList);

    const q = search.toLowerCase();

    const res = boothList.filter((v) =>
      (v.name_marathi || "").toLowerCase().includes(q)
    );

    setFiltered(res);
  };

  return (
    <>
      <div
        className={`print:hidden min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Booth Wise Voter List
          </h1>

          {/* Dark mode */}
          <div className="text-center mb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          {/* SEARCH BAR */}
          {selectedBooth && (
            <div className="max-w-md mx-auto mb-6 flex gap-2">
              <input
                className="flex-1 p-3 border rounded-lg text-black"
                placeholder="Search inside this booth…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Search
              </button>
            </div>
          )}

          {/* Booth buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((b) => (
              <button
                key={b}
                onClick={() => loadBooth(b)}
                className={`p-4 rounded-xl shadow text-center font-semibold ${
                  selectedBooth === b
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
              >
                Booth {b}
              </button>
            ))}
          </div>

          {selectedBooth && (
            <div className="text-gray-600 mb-3">
              Showing <b>{filtered.length}</b> voters from <b>Booth {selectedBooth}</b>
            </div>
          )}

          {/* VOTER CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
            {filtered.map((v) => (
              <div
                key={v.voter_id}
                className={`p-4 rounded-xl shadow cursor-pointer ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
                onClick={() => setModalVoter(v)}
              >
                <div className="font-semibold text-lg">{v.name_marathi}</div>
                <div className="text-sm text-gray-500">
                  बूथ क्र.: {v.boothSerial} • Booth: {v.booth}
                </div>
                <div className="text-xs text-gray-400">
                  EPIC: {v.voter_id}
                </div>
              </div>
            ))}
          </section>

          <Modal
            isOpen={!!modalVoter}
            onClose={() => setModalVoter(null)}
            voter={modalVoter}
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
}
