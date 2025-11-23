"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter: any | null;
  darkMode: boolean;
}

export default function Modal({ isOpen, onClose, voter, darkMode }: ModalProps) {
  
  // --- SHARE FUNCTION ---
  function shareVoter(voter: any) {
    if (!voter) return;

    const text = `
🗳️ *Ward 16 (B) — Voter Details*

👤 नाव: ${voter.name_marathi}
🏠 घर क्रमांक: ${voter.house_no}
🧑‍🤝‍🧑 नाते: ${voter.relation_type} - ${voter.relation_name_marathi}
🪪 EPIC: ${voter.voter_id}
🔢 अनुक्रमांक: ${voter.serial_no}

----------------------------------------
🌟 आमचे अधिकृत उमेदवार:
*पाटील चंदन बस्वराज (नागराळकर)*
भारतीय राष्ट्रीय काँग्रेस — उदगीर
`.trim();   // <-- 🔥 THIS closes the string safely

    if (navigator.share) {
      navigator.share({
        title: "Voter Details",
        text,
      }).catch(() => {});
      return;
    }

    const wa = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(wa, "_blank");
  }

  return (
    <AnimatePresence>
      {isOpen && voter && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={
              (darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800") +
              " rounded-xl p-6 w-[90%] max-w-md shadow-xl"
            }
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              {voter.name_marathi}
            </h2>

            <div className="space-y-2 text-sm">
              <p><b>घर क्रमांक:</b> {voter.house_no}</p>
              <p><b>नाते:</b> {voter.relation_type}</p>
              <p><b>नाव (नाते):</b> {voter.relation_name_marathi}</p>
              <p><b>वय:</b> {voter.age}</p>
              <p><b>लिंग:</b> {voter.gender}</p>
              <p><b>EPIC:</b> {voter.voter_id}</p>
              <p><b>अनुक्रमांक:</b> {voter.serial_no}</p>
            </div>

            {/* SHARE BUTTON */}
            <button
              onClick={() => shareVoter(voter)}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Share
            </button>

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
