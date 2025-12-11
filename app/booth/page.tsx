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

  // Added to fix TypeScript errors
  booth?: number;
  boothSerial?: number;
}

export default function BoothWisePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [modalVoter, setModalVoter] = useState<Voter | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Restore Dark Mode
  useEffect(() => {
    const saved = localStorage.getItem("voter_dark");
    if (saved) setDarkMode(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("voter_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Load Voter Data
  useEffect(() => {
    fetch(`/voters.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => setVoters(data))
      .catch(() => setVoters([]));
  }, []);

  // Booth ranges
  const boothRanges: Record<number, { start: number; end: number }> = {
    1: { start: 1, end: 944 },
    2: { start: 945, end: 1923 },
    3: { start: 1924, end: 2881 },
    4: { start: 2882, end: 3826 },
  };

  const getBoothNumber = (serial: number): number => {
    if (serial <= 944) return 1;
    if (serial <= 1923) return 2;
    if (serial <= 2881) return 3;
    return 4;
  };

  const getBoothWiseSerial = (serial: number): number => {
    const booth = getBoothNumber(serial);
    const { start } = boothRanges[booth];
    return serial - start + 1;
  };

  // Load Selected Booth
  const loadBooth = (booth: number) => {
    const { start, end } = boothRanges[booth];

    const sliced = voters.filter(
      (v) => v.serial_no >= start && v.serial_no <= end
    );

    const renumbered = sliced.map((v, index) => ({
      ...v,
      booth,
      boothSerial: index + 1,
    }));

    setSelectedBooth(booth);
    setFiltered(renumbered);
  };

  // Search inside current booth
  const handleSearch = () => {
    if (!selectedBooth) return;

    const q = search.trim().toLowerCase();
    if (!q) {
      loadBooth(selectedBooth);
      return;
    }

    const boothList = filtered.length > 0 ? filtered : voters;

    const results = boothList.filter((v) => {
      const name = (v.name_marathi || "").toLowerCase();
      const rel = (v.relation_name_marathi || "").toLowerCase();
      const id = (v.voter_id || "").toLowerCase();
      return (
        name.includes(q) ||
        rel.includes(q) ||
        id.includes(q)
      );
    });

    setFiltered(results);
  };

  // PRINT HANDLER
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
      {/* SCREEN UI (HIDDEN DURING PRINT) */}
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

          {/* Mode Toggle */}
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
            <div className="max-w-md mx-auto mb-6">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={`Search inside Booth ${selectedBooth}...`}
                className="w-full p-3 rounded-xl border bg-white text-gray-800"
              />
              <button
                onClick={handleSearch}
                className="mt-2 w-full py-3 bg-blue-600 text-white rounded-xl"
              >
                Search
              </button>
            </div>
          )}

          {/* Booth selection */}
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
              Showing <b>{filtered.length}</b> voters from Booth{" "}
              <b>{selectedBooth}</b>
            </div>
          )}

          {/* Print button */}
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

          {/* VOTER CARDS */}
          <section
            id="results"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10"
          >
            {filtered.map((v) => (
              <div
                key={v.voter_id}
                onClick={() => setModalVoter(v)}
                className={`p-4 rounded-xl shadow cursor-pointer ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="text-lg font-semibold">{v.name_marathi}</div>
                <div className="text-sm text-gray-500">
                  घर क्रमांक: {v.house_no} • वय: {v.age}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  EPIC: {v.voter_id} • अनुक्रमांक: {v.serial_no}
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

      {/* PRINT AREA */}
      <div id="print-area" className="print-only" style={{ padding: 20 }}>
        <h2 className="text-xl mb-4">
          Printed Booth List ({filtered.length}) — Booth {selectedBooth}
        </h2>
        <div id="print-area-columns"></div>
      </div>
    </>
  );
}
