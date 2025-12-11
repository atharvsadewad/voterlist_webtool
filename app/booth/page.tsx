"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";

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

// Booth Ranges
const boothRanges = [
  { booth: 1, start: 1, end: 944 },
  { booth: 2, start: 945, end: 1923 },
  { booth: 3, start: 1924, end: 2881 },
  { booth: 4, start: 2882, end: 3826 },
];

function getBoothNumber(serial: number) {
  const found = boothRanges.find(
    (b) => serial >= b.start && serial <= b.end
  );
  return found ? found.booth : null;
}

function getBoothWiseSerial(serial: number) {
  const booth = boothRanges.find(
    (b) => serial >= b.start && serial <= b.end
  );
  return booth ? serial - booth.start + 1 : null;
}

export default function BoothWisePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [modalVoter, setModalVoter] = useState<any | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  // Restore Dark Mode
  useEffect(() => {
    const saved = localStorage.getItem("voter_dark");
    if (saved) setDarkMode(saved === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("voter_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Load All Voters
  useEffect(() => {
    fetch(`/voters.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then(setVoters)
      .catch(() => setVoters([]));
  }, []);

  // ------------------------------
  // 🔍 GLOBAL SEARCH ACROSS ALL VOTERS
  // ------------------------------
  const handleSearch = () => {
    if (!search.trim()) {
      setFiltered([]);
      return;
    }

    const q = search.toLowerCase();

    const results = voters
      .filter(
        (v) =>
          (v.name_marathi || "").toLowerCase().includes(q) ||
          (v.relation_name_marathi || "").toLowerCase().includes(q) ||
          (v.voter_id || "").toLowerCase().includes(q)
      )
      .map((v) => ({
        ...v,
        booth: getBoothNumber(v.serial_no),
        boothSerial: getBoothWiseSerial(v.serial_no),
      }));

    setSelectedBooth(null); // Clear booth view
    setFiltered(results);
  };

  // --------------------------------
  // BOOTH-WISE LOADING (BROWSING MODE)
  // --------------------------------
  const loadBooth = (booth: number) => {
    const range = boothRanges.find((b) => b.booth === booth);
    if (!range) return;

    const sliced = voters.filter(
      (v) => v.serial_no >= range.start && v.serial_no <= range.end
    );

    const renumbered = sliced.map((v, index) => ({
      ...v,
      booth,
      boothSerial: index + 1,
    }));

    setSearch(""); // clear search
    setFiltered(renumbered);
    setSelectedBooth(booth);
  };

  // ---------------------
  // 🔶 PRINT LOGIC
  // ---------------------
  const handlePrint = () => {
    if (!selectedBooth) return alert("Select a booth first");

    const area = document.getElementById("print-area-columns");
    if (!area) return;

    area.innerHTML = filtered
      .map(
        (v) => `
        <div class="print-card">
          <div class="name">${v.name_marathi}</div>
          <div>घर क्रमांक: ${v.house_no} • वय: ${v.age}</div>
          <div>नाते: ${v.relation_type} - ${v.relation_name_marathi}</div>
          <div>Booth: ${v.booth}</div>
          <div>Booth Sr: ${v.boothSerial}</div>
          <div>EPIC: ${v.voter_id}</div>
        </div>
      `
      )
      .join("");

    window.print();
  };

  return (
    <>
      <div
        className={`print:hidden min-h-screen transition-all ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Booth Wise Voter List
          </h1>

          {/* 🌙 Dark Mode */}
          <div className="text-center mb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          {/* 🔍 GLOBAL SEARCH BAR */}
          <div className="mb-6 flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search नाव / आडनाव / EPIC…"
              className="flex-1 p-3 rounded-lg border"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Search
            </button>
          </div>

          {/* 📌 Booth Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((booth) => (
              <button
                key={booth}
                onClick={() => loadBooth(booth)}
                className={`p-4 rounded-xl shadow text-center font-semibold ${
                  selectedBooth === booth
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
              >
                Booth {booth}
              </button>
            ))}
          </div>

          {/* 🔶 Print Button (Only for booth view) */}
          {selectedBooth && filtered.length > 0 && (
            <div className="text-right mb-4">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow"
              >
                Print Booth List
              </button>
            </div>
          )}

          {/* RESULTS */}
          <section
            id="results"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10"
          >
            {filtered.map((v) => (
              <div
                key={v.voter_id + "-" + v.serial_no}
                onClick={() => setModalVoter(v)}
                className={`p-4 rounded-xl shadow cursor-pointer ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="text-lg font-semibold">{v.name_marathi}</div>
                <div className="text-sm text-gray-500">
                  Booth: {v.booth} • Sr: {v.boothSerial}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  EPIC: {v.voter_id}
                </div>
              </div>
            ))}
          </section>
        </div>

        <Modal
          isOpen={!!modalVoter}
          onClose={() => setModalVoter(null)}
          voter={modalVoter}
          darkMode={darkMode}
        />
      </div>

      {/* PRINT AREA */}
      <div id="print-area" className="print-only" style={{ padding: 20 }}>
        <h2 className="text-xl mb-4">
          Booth {selectedBooth} — Printed List ({filtered.length})
        </h2>
        <div id="print-area-columns"></div>
      </div>
    </>
  );
}
