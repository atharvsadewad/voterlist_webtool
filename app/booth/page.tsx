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

export default function BoothWisePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [modalVoter, setModalVoter] = useState<Voter | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");

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
      .then((data) => setVoters(data))
      .catch(() => setVoters([]));
  }, []);

  // Booth Slicing Logic
  const boothRanges: Record<number, { start: number; end: number }> = {
    1: { start: 1, end: 944 },
    2: { start: 945, end: 1923 },
    3: { start: 1924, end: 2881 },
    4: { start: 2882, end: 3826 },
  };

  const getBoothNumber = (serial: number) => {
    for (const booth in boothRanges) {
      const { start, end } = boothRanges[Number(booth)];
      if (serial >= start && serial <= end) return Number(booth);
    }
    return null;
  };

  const getBoothWiseSerial = (serial: number) => {
    const booth = getBoothNumber(serial);
    if (!booth) return null;
    return serial - boothRanges[booth].start + 1;
  };

  const loadBooth = (booth: number) => {
    const { start, end } = boothRanges[booth];

    const sliced = voters.filter(
      (v) => v.serial_no >= start && v.serial_no <= end
    );

    const renumbered = sliced.map((v, index) => ({
      ...v,
      serial_no: index + 1,
    }));

    setSelectedBooth(booth);
    setFiltered(renumbered);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 150);
  };

  // 🔍 NEW: GLOBAL SEARCH ACROSS ALL VOTERS
  const handleSearch = () => {
    if (!query.trim()) return setFiltered([]);

    const q = query.toLowerCase();

    const results = voters.filter(
      (v) =>
        v.name_marathi.toLowerCase().includes(q) ||
        v.relation_name_marathi.toLowerCase().includes(q) ||
        v.voter_id.toLowerCase().includes(q)
    );

    // Add booth & booth-serial info
    const enhanced = results.map((v) => {
      const booth = getBoothNumber(v.serial_no);
      const boothSerial = getBoothWiseSerial(v.serial_no);
      return { ...v, booth, boothSerial };
    });

    setSelectedBooth(null); // we're in GLOBAL search mode now
    setFiltered(enhanced);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 150);
  };

  // PRINT LOGIC
  const handlePrint = () => {
    const area = document.getElementById("print-area-columns");
    if (!area) return;

    area.innerHTML = filtered
      .map(
        (v) => `
        <div class="print-card">
          <div class="name">${v.name_marathi}</div>
          <div>घर क्रमांक: ${v.house_no} • वय: ${v.age}</div>
          <div>नाते: ${v.relation_type} - ${v.relation_name_marathi}</div>
          <div>Booth: ${v.booth ?? getBoothNumber(v.serial_no)}</div>
          <div>Booth Sr: ${v.boothSerial ?? getBoothWiseSerial(v.serial_no)}</div>
          <div>EPIC: ${v.voter_id} • अनुक्रमांक: ${v.serial_no}</div>
        </div>
      `
      )
      .join("");

    window.print();
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

          {/* 🌙 Dark Mode Toggle */}
          <div className="text-center mb-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          {/* 🔍 GLOBAL SEARCH BAR */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search name / EPIC / relation..."
                className={`w-full p-3 rounded-xl border ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-3 rounded-xl bg-blue-600 text-white"
              >
                Search
              </button>
            </div>
          </div>

          {/* Booth Selection */}
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
              Showing <b>{filtered.length}</b> voters from{" "}
              <b>Booth {selectedBooth}</b>
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
                  घर क्रमांक: {v.house_no} • वय: {v.age}
                </div>

                {/* NEW DETAILS */}
                <div className="text-xs text-gray-400 mt-1">
                  Booth: <b>{v.booth ?? getBoothNumber(v.serial_no)}</b> • Booth Sr:{" "}
                  <b>{v.boothSerial ?? getBoothWiseSerial(v.serial_no)}</b>
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  EPIC: {v.voter_id} • अनुक्रमांक: {v.serial_no}
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
          Printed Booth List ({filtered.length})
        </h2>

        <div id="print-area-columns"></div>
      </div>
    </>
  );
}
