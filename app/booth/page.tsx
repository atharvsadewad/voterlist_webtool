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

  const loadBooth = (booth: number) => {
    const { start, end } = boothRanges[booth];

    const sliced = voters.filter(
      (v) => v.serial_no >= start && v.serial_no <= end
    );

    // Renumber serials starting from 1
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

  return (
    <div
      className={`min-h-screen transition-all ${
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
            Showing <b>{filtered.length}</b> voters from{" "}
            <b>Booth {selectedBooth}</b>
          </div>
        )}

        {/* Print Button */}
        {filtered.length > 0 && (
          <div className="text-right mb-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow"
            >
              Print Booth List
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
              onClick={() => setModalVoter(v)}
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

        {/* Print Area */}
        <div id="print-area" className="print-only">
          <h2 className="text-xl mb-4">
            Printed Booth List ({filtered.length}) — Booth {selectedBooth}
          </h2>

          <div style={{ columnCount: 2, columnGap: 18 }}>
            {filtered.map((v) => (
              <div
                key={v.voter_id}
                className="print-card"
                style={{ breakInside: "avoid" }}
              >
                <p>
                  <b>नाव:</b> {v.name_marathi}
                </p>
                <p>
                  <b>घर क्रमांक:</b> {v.house_no}
                </p>
                <p>
                  <b>नाते:</b> {v.relation_type} - {v.relation_name_marathi}
                </p>
                <p>
                  <b>वय:</b> {v.age}
                </p>
                <p>
                  <b>लिंग:</b> {v.gender}
                </p>
                <p>
                  <b>EPIC:</b> {v.voter_id}
                </p>
                <p>
                  <b>अनुक्रमांक:</b> {v.serial_no}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!modalVoter}
        onClose={() => setModalVoter(null)}
        voter={modalVoter}
        darkMode={darkMode}
      />
    </div>
  );
}
