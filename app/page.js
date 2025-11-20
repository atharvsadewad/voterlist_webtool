"use client";

import { useEffect, useState } from "react";
import Modal from "./components/Modal";

export default function Home() {
  const [voters, setVoters] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/voters.json")
      .then((res) => res.json())
      .then((data) => setVoters(data));
  }, []);

  const filtered = voters.filter((v) =>
    v.surname?.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Voter Search</h1>

      <input
        type="text"
        placeholder="Search surname…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-6"
      />

      <div className="space-y-2">
        {filtered.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelected(v)}
            className="p-3 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            {v.fullname}
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selected}
        voter={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
