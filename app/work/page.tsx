"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function WorkPage() {
  const cards = [
    { title: "Road Repairs", desc: "Local roads development & maintenance." },
    { title: "Water Supply", desc: "Improving pipeline and supply." },
    { title: "Community Events", desc: "Organised blood donation drives." },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Our Work</h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="p-6 rounded-xl shadow bg-white">
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
