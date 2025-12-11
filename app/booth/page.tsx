"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";

interface Voter {
  serial_no: number; // original serial by default
  voter_id: string;
  name_marathi: string;
  relation_name_marathi: string;
  relation_type: string;
  house_no: string;
  age: number;
  gender: string;

  // optional fields added for booth logic
  booth?: number;
  boothSerial?: number;       // renumbered serial within booth
  original_serial_no?: number; // preserved original serial
}

export default function BoothWisePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [boothList, setBoothList] = useState<Voter[]>([]); // active booth voters (renumbered)
  const [filtered, setFiltered] = useState<Voter[]>([]); // search results inside booth
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [modalVoter, setModalVoter] = useState<Voter | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Restore dark mode
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

  // booth ranges
  const boothRanges: Record<number, { start: number; end: number }> = {
    1: { start: 1, end: 944 },
    2: { start: 945, end: 1923 },
    3: { start: 1924, end: 2881 },
    4: { start: 2882, end: 3826 },
  };

  // Load booth: slice + renumber
  const loadBooth = (booth: number) => {
    const { start, end } = boothRanges[booth];

    const sliced = voters.filter(
      (v) => v.serial_no >= start && v.serial_no <= end
    );

    const renumbered = sliced.map((v, i) => ({
      ...v,
      booth,
      boothSerial: i + 1,
    }));

    setBoothList(renumbered);
    setFiltered(renumbered);
    setSelectedBooth(booth);
    setSearch("");

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Search only within selected booth list
  const handleSearch = () => {
    if (!search.trim()) {
      setFiltered(boothList);
      return;
    }

    const q = search.toLowerCase();
    const res = boothList.filter((v) =>
      (v.name_marathi || "").toLowerCase().includes(q) ||
      (v.relation_name_marathi || "").toLowerCase().includes(q) ||
      (v.voter_id || "").toLowerCase().includes(q)
    );

    setFiltered(res);
  };

  // Print logic (populate #print-area-columns then window.print)
  const handlePrint = () => {
    const area = document.getElementById("print-area-columns");
    if (!area) return;

    area.innerHTML = filtered
      .map((v) => {
        const boothNum = v.booth ?? selectedBooth ?? "—";
        const boothSr = v.boothSerial ?? v.serial_no;
        return `
          <div class="print-card" style="break-inside: avoid; margin-bottom:12px; padding:10px; border:1px solid #ccc;">
            <div style="font-weight:700; margin-bottom:6px;">${v.name_marathi}</div>
            <div>घर क्रमांक: ${v.house_no} • वय: ${v.age}</div>
            <div>नाते: ${v.relation_type} ${v.relation_name_marathi ? " - " + v.relation_name_marathi : ""}</div>
            <div>Booth: ${boothNum} • Booth Sr: ${boothSr}</div>
            <div>EPIC: ${v.voter_id} • अनुक्रमांक: ${v.serial_no}</div>
          </div>
        `;
      })
      .join("");

    window.print();
  };

  // When opening modal, pass a modified object so modal shows boothSerial as serial_no
  const openVoterModal = (v: Voter) => {
    const modified: Voter = {
      ...v,
      original_serial_no: v.serial_no,
      serial_no: v.boothSerial ?? v.serial_no, // set serial_no to boothSerial for display in modal
    };
    setModalVoter(modified);
  };

  return (
    <>
      {/* Screen UI (hidden during print) */}
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

          {/* Dark Mode Toggle */}
          <div className="text-center mb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          {/* SEARCH BAR (above booth buttons as requested) */}
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

          {/* Booth Selection Buttons */}
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

          {selectedBooth && (
            <div className="text-gray-600 mb-3">
              Showing <b>{filtered.length}</b> voters from <b>Booth {selectedBooth}</b>
            </div>
          )}

          {/* Print Button */}
          {filtered.length > 0 && (
            <div className="text-right mb-4 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow"
              >
                Print Booth List
              </button>
            </div>
          )}

          {/* Voter Cards */}
          <section id="results" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
            {filtered.map((v) => (
              <div
                key={v.voter_id + "-" + (v.boothSerial ?? v.serial_no)}
                className={`p-4 rounded-xl shadow cursor-pointer ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
                onClick={() => openVoterModal(v)}
              >
                <div className="text-lg font-semibold">{v.name_marathi}</div>
                <div className="text-sm text-gray-500">
                  बूथ क्र.: {v.boothSerial} • Booth: {v.booth}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  EPIC: {v.voter_id} • अनुक्रमांक: {v.boothSerial}
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

      {/* PRINT AREA (same pattern used on Home page) */}
      <div id="print-area" className="print-only" style={{ padding: 20 }}>
        <h2 className="text-xl mb-4">
          Printed Booth List ({filtered.length}) — Booth {selectedBooth}
        </h2>

        <div id="print-area-columns" />
      </div>
    </>
  );
}
