"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-sm text-gray-600 mb-6">
          Reach out for campaign events, volunteering or official queries.
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-xl shadow bg-white">
            <div className="font-semibold">Office</div>
            <div className="text-sm text-gray-600">Udgir, Latur District, Maharashtra</div>
          </div>

          <div className="p-4 rounded-xl shadow bg-white">
            <div className="font-semibold">Instagram</div>
            <a className="text-blue-600 underline" href="https://www.instagram.com/chandan_patil_nagralkar" target="_blank">Instagram</a>
          </div>

          <div className="p-4 rounded-xl shadow bg-white">
            <div className="font-semibold">Facebook</div>
            <a className="text-blue-600 underline" href="https://www.facebook.com/ChandanBaswarajPatilNagralkar" target="_blank">Facebook</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
