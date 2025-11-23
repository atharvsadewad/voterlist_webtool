"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter: any | null;
  darkMode: boolean;
}

export default function Modal({ isOpen, onClose, voter, darkMode }: ModalProps) {
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
            className={`rounded-xl p-6 w-[90%] max-w-md shadow-xl ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">{voter.name_marathi}</h2>

            <div className="space-y-2 text-sm">
              <p><b>घर क्रमांक:</b> {voter.house_no}</p>
              <p><b>नाते:</b> {voter.relation_type}</p>
              <p><b>नाव (नाते):</b> {voter.relation_name_marathi}</p>
              <p><b>वय:</b> {voter.age}</p>
              <p><b>लिंग:</b> {voter.gender}</p>
              <p><b>EPIC:</b> {voter.voter_id}</p>
              <p><b>अनुक्रमांक:</b> {voter.serial_no}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
