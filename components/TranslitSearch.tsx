"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Voter = {
  voter_id?: string;
  name_marathi?: string;
  relation_name_marathi?: string;
  house_no?: string;
  age?: number | string;
  serial_no?: string | number;
};

export default function TranslitSearch({
  voters,
  onSearch,
  placeholder = "Search नाव / आडनाव / EPIC...",
}: {
  voters: Voter[];
  onSearch: (results: Voter[]) => void;
  placeholder?: string;
}) {
  const [typed, setTyped] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- A small transliteration helper (english -> approximate marathi) ---
  // This is small but effective for quick matches. Expand mapping as needed.
  const transliterate = (src: string) => {
    src = src.trim().toLowerCase();

    if (!src) return "";

    // Basic consonant + vowel map (extend as desired)
    const map: { [k: string]: string } = {
      a: "अ",
      aa: "आ",
      ā: "आ",
      i: "इ",
      ii: "ई",
      ee: "ई",
      u: "उ",
      uu: "ऊ",
      e: "ए",
      ai: "ऐ",
      o: "ओ",
      au: "औ",
      k: "क",
      kh: "ख",
      g: "ग",
      gh: "घ",
      nG: "ङ",
      c: "च",
      ch: "छ",
      j: "ज",
      jh: "झ",
      ny: "ञ",
      t: "ट",
      th: "ठ",
      d: "ड",
      dh: "ढ",
      n: "न",
      p: "प",
      ph: "फ",
      b: "ब",
      bh: "भ",
      m: "म",
      y: "य",
      r: "र",
      l: "ल",
      v: "व",
      s: "स",
      sh: "श",
      shh: "ष",
      h: "ह",
      ksh: "क्ष",
      gy: "ज्ञ",
    };

    // naive algorithm: try greedy matches from start
    let out = "";
    let i = 0;
    while (i < src.length) {
      // try 3,2,1 char matches (greedy)
      let matched = false;
      for (let len = 3; len >= 1; len--) {
        const slice = src.slice(i, i + len);
        if (slice.length === 0) continue;
        if (map[slice]) {
          out += map[slice];
          i += len;
          matched = true;
          break;
        }
      }
      if (!matched) {
        // if letter not in map, convert single char roughly:
        const ch = src[i];
        // consonant fallback: add char as-is (not ideal but harmless)
        // small vowel heuristics
        if ("aeiou".includes(ch)) {
          out += map[ch] ?? "";
        } else {
          // map consonant to itself in dev-only fallback: attempt to pick best single mapping
          out += map[ch] ?? "";
        }
        i++;
      }
    }
    return out;
  };

  // Produce suggestions (Marathi names that start with translit OR contain typed english as substring)
  useEffect(() => {
    if (!typed.trim()) {
      setSuggestions([]);
      return;
    }

    const t = typed.trim();
    const translit = transliterate(t);

    // Score function for sorting suggestions
    const score = (name: string) => {
      const lname = name.toLowerCase();
      const tLower = t.toLowerCase();

      let s = 0;
      if (translit && name.startsWith(translit)) s += 100;
      if (lname.startsWith(tLower)) s += 80;
      if (name.includes(translit)) s += 40;
      if (lname.includes(tLower)) s += 30;
      if (name === translit) s += 200;
      return s;
    };

    // Collect candidate Marathi names (unique)
    const namesSet = new Set<string>();
    voters.forEach((v) => {
      if (v.name_marathi) namesSet.add(v.name_marathi);
      if (v.relation_name_marathi) namesSet.add(v.relation_name_marathi);
    });

    const candidates = Array.from(namesSet);
    // Filter: keep those matching approximate translit OR english substring match
    const filteredCandidates = candidates
      .filter((name) => {
        const low = name.toLowerCase();
        if (translit && name.startsWith(translit)) return true;
        if (low.includes(t.toLowerCase())) return true; // english-like substring matching (works if romanised stored)
        // also allow includes translit
        if (translit && low.includes(translit)) return true;
        return false;
      })
      .sort((a, b) => score(b) - score(a))
      .slice(0, 10);

    setSuggestions(filteredCandidates);
    setActiveIndex(0);
  }, [typed, voters]);

  // When user selects suggestion -> run search using that Marathi string
  const applySuggestion = (s: string) => {
    // set typed to the Marathi suggestion so it shows
    setTyped(s);
    setOpen(false);
    // filter voters by exact/startsWith match on name_marathi
    const results = voters.filter((v) => (v.name_marathi || "").startsWith(s) || (v.relation_name_marathi || "").startsWith(s));
    onSearch(results);
  };

  const runRawSearch = () => {
    const q = typed.trim();
    if (!q) {
      onSearch([]);
      return;
    }

    // try transliteration + fuzzy checks
    const translit = transliterate(q);
    const qLower = q.toLowerCase();

    const res = voters.filter((v) => {
      const name = (v.name_marathi || "").toLowerCase();
      const rel = (v.relation_name_marathi || "").toLowerCase();
      // matches: startsWith translit OR includes typed english OR includes translit OR includes qLower in romanised fields
      if (translit && name.startsWith(translit.toLowerCase())) return true;
      if (name.includes(translit.toLowerCase())) return true;
      if (name.includes(qLower)) return true;
      if (rel.includes(translit.toLowerCase())) return true;
      if (rel.includes(qLower)) return true;
      // check epic
      if ((v.voter_id || "").toLowerCase().includes(qLower)) return true;
      return false;
    });

    onSearch(res);
    setOpen(false);
  };

  // keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      setOpen(true);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (open && suggestions[activeIndex]) {
        applySuggestion(suggestions[activeIndex]);
      } else {
        runRawSearch();
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={typed}
        onChange={(e) => {
          setTyped(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl outline-none focus:ring-2 bg-white text-gray-900"
        aria-label="Search"
      />

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            zIndex: 60,
            left: 0,
            right: 0,
            marginTop: 8,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
            listStyle: "none",
            padding: 8,
            maxHeight: 300,
            overflow: "auto",
          }}
        >
          {suggestions.map((s, idx) => (
            <li
              key={s + idx}
              onMouseDown={(ev) => {
                // prevent blur before click event
                ev.preventDefault();
                applySuggestion(s);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                background: idx === activeIndex ? "#f3f4f6" : "transparent",
                cursor: "pointer",
                fontWeight: idx === activeIndex ? 600 : 500,
              }}
            >
              {s}
            </li>
          ))}
        </motion.ul>
      )}

      {/* small footer hint */}
      <div style={{ marginTop: 6 }}>
        <small className="text-xs text-gray-500">Type in English (eg. "kapse") or Marathi — suggestions appear.</small>
      </div>
    </div>
  );
}
