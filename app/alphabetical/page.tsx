"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";

// Marathi alphabet buttons (official order you had)
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
  const [voters, setVoters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState("अ");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [modalVoter, setModalVoter] = useState<any | null>(null);

  // collator for Marathi alphabetical sorting
  const collator = useMemo(() => new Intl.Collator("mr"), []);

  // ref to print grid content
  const printGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/voters.json?t=" + Date.now())
      .then((r) => r.json())
      .then((data) => setVoters(data))
      .catch(() => setVoters([]));
  }, []);

  // FILTER + SORT
  const filtered = useMemo(() => {
    let list = voters || [];

    if (!showAll) {
      list = list.filter((v) =>
        (v.name_marathi || "").trim().startsWith(selectedLetter)
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((v) =>
        (v.name_marathi || "").toLowerCase().includes(q)
      );
    }

    // stable sort using Marathi collator
    return [...list].sort((a, b) =>
      collator.compare(a.name_marathi || "", b.name_marathi || "")
    );
  }, [voters, selectedLetter, query, showAll, collator]);

  // print helper: open new window with only printable markup (avoids blank pages)
  const handlePrint = () => {
    const el = printGridRef.current;
    if (!el) {
      window.print(); // fallback
      return;
    }

    // Grab markup and inline minimal print styles so it prints consistently
    const printHTML = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Print - Voter List</title>
          <style>
            /* Page reset */
            html,body{margin:0;padding:12px;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
            /* Grid: 3 columns for print */
            .print-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
            }
            /* Card style like on-site */
            .print-card {
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              padding: 10px;
              box-shadow: none;
              background: #fff;
              font-size: 12px;
              line-height: 1.15;
              min-height: 70px;
            }
            .print-card .name { font-weight: 700; font-size: 13px; margin-bottom:6px; }
            .meta { color: #4b5563; font-size: 11px; }
            /* Make sure no nav/controls printed */
            @media print {
              body { margin:0; }
            }
            /* Scale down on narrower paper */
            @media (max-width:900px) {
              .print-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width:600px) {
              .print-grid { grid-template-columns: repeat(1, 1fr); }
            }
          </style>
        </head>
        <body>
          <h2 style="margin:0 0 12px 0;font-size:16px;">Voter list — ${showAll ? "Full" : `Starting with: ${selectedLetter}`}</h2>
          <div class="print-grid">
            ${el.innerHTML}
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      alert("Unable to open print window. Please allow popups.");
      return;
    }
    w.document.open();
    w.document.write(printHTML);
    w.document.close();

    // wait a tick for layout to settle, then print
    w.focus();
    setTimeout(() => {
      w.print();
      // do not auto-close — let user save/cancel. close would sometimes cancel print on some browsers.
      // w.close();
    }, 350);
  };

  // Render small card markup for print cloning (keeps same markup as on-screen)
  const renderCardInner = (voter: any) => {
    // safe fields fallback
    const name = voter.name_marathi || voter.fullname || "";
    const house = voter.house_no || voter.house || "NA";
    const age = voter.age || "NA";
    const relationType = voter.relation_type || voter.relation || "";
    const relationName = voter.relation_name_marathi || voter.relation_name || "";
    const epic = voter.voter_id || voter.epic || "";
    const serial = voter.serial_no || voter.serial || "";

    // HTML snippet used for print window (must be plain HTML)
    return `
      <div class="print-card">
        <div class="name">${escapeHtml(name)}</div>
        <div class="meta">घर क्रमांक: ${escapeHtml(String(house))} • वय: ${escapeHtml(String(age))}</div>
        <div class="meta">नाते: ${escapeHtml(relationType)} ${relationName ? " - " + escapeHtml(relationName) : ""}</div>
        <div class="meta" style="margin-top:6px;color:#6b7280;">EPIC: ${escapeHtml(epic)} • अनुक्रमांक: ${escapeHtml(String(serial))}</div>
      </div>
    `;
  };

  // helper to escape HTML for print HTML injection
  function escapeHtml(str: string) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page-specific navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Marathi Alphabetical Voter List</h1>

        {/* letters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => {
                setSelectedLetter(l);
                setShowAll(false);
                setQuery("");
              }}
              className={`px-3 py-1 rounded-md text-sm font-semibold border ${
                selectedLetter === l && !showAll ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <button
            onClick={() => {
              setShowAll(true);
              setQuery("");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Show Full Alphabetical List
          </button>
        </div>

        <div className="mb-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder={showAll ? "Search full list…" : `Search in "${selectedLetter}"…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* print button */}
        {filtered.length > 0 && (
          <div className="text-right mb-4 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700"
            >
              Print List
            </button>
          </div>
        )}

        <div className="text-gray-600 text-sm mb-3">
          Showing <b>{filtered.length}</b> results {showAll ? "(A → ज्ञ)" : `starting with "${selectedLetter}"`}
        </div>

        {/* On-screen results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
          {filtered.map((voter) => (
            <motion.div
              key={(voter.voter_id || voter.epic || Math.random()) + "-" + (voter.serial_no || "")}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
              onClick={() => setModalVoter(voter)}
              className="p-4 rounded-xl shadow bg-white cursor-pointer"
            >
              <div className="font-semibold text-lg">{voter.name_marathi || voter.fullname}</div>
              <div className="text-sm text-gray-500">घर क्रमांक: {voter.house_no || voter.house} • वय: {voter.age || "NA"}</div>
              <div className="text-xs text-gray-400 mt-2">EPIC: {voter.voter_id || voter.epic} • अनुक्रमांक: {voter.serial_no || voter.serial}</div>
            </motion.div>
          ))}
        </div>

        {/* Hidden print grid container (we clone the innerHTML when printing) */}
        <div style={{display:"none"}}>
          <div
            id="print-grid-clone"
            ref={printGridRef}
            // populate innerHTML programmatically to avoid React escaping difficulties
            dangerouslySetInnerHTML={{
              __html: filtered.map((v) => renderCardInner(v)).join("")
            }}
          />
        </div>
      </div>

      {/* Modal (share/close) */}
      <Modal
        isOpen={!!modalVoter}
        onClose={() => setModalVoter(null)}
        voter={modalVoter}
        darkMode={false}
      />
    </div>
  );
}
