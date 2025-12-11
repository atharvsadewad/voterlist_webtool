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
  booth?: number;
  boothSerial?: number;
}

export default function BoothWisePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filtered, setFiltered] = useState<Voter[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<number | null>(null);
  const [modalVoter, setModalVoter] = useState<Voter | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Booth Ranges
  const boothRanges: Record<number, { start: number; end: number }> = {
    1: { start: 1, end: 944 },
    2: { start: 945, end: 1923 },
    3: { start: 1924, end: 2881 },
    4: { start: 2882, end: 3826 },
  };

  // Helper — Get booth number from original serial number
  const getBoothNumber = (serial: number): number => {
    if (serial >= 1 && serial <= 944) return 1;
    if (serial >= 945 && serial <= 1923) return 2;
    if (serial >= 1924 && serial <= 2881) return 3;
    if (serial >= 2882 && serial <= 3826) return 4;
    return 0;
  };

  // Helper — compute booth-wise serial number
  const getBoothWiseSerial = (serial: number): number => {
    const booth = getBoothNumber(serial);
    const range = boothRanges[booth];
    return serial - range.start + 1;
  };

  // Load voters for selected booth
  const loadBooth = (booth: number) => {
    setSearchQuery(""); // reset search within booth

    const { start, end } = boothRanges[booth];

    const sliced = voters.filter(
      (v) => v.serial_no >= start && v.serial_no <= end
    );

    const renumbered = sliced.map((v, index) => ({
      ...v,
      booth: booth,
      boothSerial: index + 1,
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

  // 🔍 Search across ALL voters (not only the booth list)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      if (selectedBooth) loadBooth(selectedBooth);
      return;
    }

    const q = searchQuery.toLowerCase();

    const results = voters
      .filter(
        (v) =>
          v.name_marathi.toLowerCase().includes(q) ||
          v.relation_name_marathi.toLowerCase().includes(q) ||
          v.voter_id.toLowerCase().includes(q)
      )
      .map((v) => ({
        ...v,
        booth: getBoothNumber(v.serial_no),
        boothSerial: getBoothWiseSerial(v.serial_no),
      }));

    setSelectedBooth(null); // switch to search mode
    setFiltered(results);

    setTimeout(
      () => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }),
      150
    );
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
      {/* UI (Hidden During Print) */}
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

          {/* 🔍 Search Box */}
          <div className="max-w-md mx-auto mb-6">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full p-3 rounded-lg border"
              placeholder="Search voter by name / EPIC…"
            />
            <button
              onClick={handleSearch}
              className="mt-2 w-full p-3 bg-blue-600 text-white rounded-lg"
            >
              Search
            </button>
          </div>

          {/* Booth Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

          {/* Showing count */}
          {filtered.length > 0 && (
            <div className="text-gray-600 mb-3">
              Showing <b>{filtered.length}</b>{" "}
              {selectedBooth ? (
                <>voters from <b>Booth {selectedBooth}</b></>
              ) : (
                "search results"
              )}
            </div>
          )}

          {/* Print Button */}
          {filtered.length > 0 && (
            <div className="text-right mb-4 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow"
              >
                Print List
              </button>
            </div>
          )}

          {/* Voter Cards */}
          <section
            id="results"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10"
          >
            {filtered.map((v) => (
              <div
                key={v.voter_id + "-" + v.serial_no}
                className={`p-4 rounded-xl shadow cursor-pointer ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
                onClick={() =>
                  setModalVoter({
                    ...v,
                    serial_no: v.boothSerial || v.serial_no, // FIXED
                  })
                }
              >
                <div className="text-lg font-semibold">{v.name_marathi}</div>
                <div className="text-sm text-gray-500">
                  Booth: {v.booth} • Booth Sr:{" "}
                  {v.boothSerial ?? getBoothWiseSerial(v.serial_no)}
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
          Printed List ({filtered.length})
        </h2>

        <div id="print-area-columns"></div>
      </div>
    </>
  );
}
