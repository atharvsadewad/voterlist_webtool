"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ isOpen, onClose, voter }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {voter.fullname}
            </h2>

            <div className="space-y-2 text-gray-700 text-sm">
              <p><b>घर क्रमांक:</b> {voter.house}</p>
              <p><b>नाव:</b> {voter.fullname}</p>
              <p><b>नाते:</b> {voter.relation}</p>
              <p><b>वय:</b> {voter.age}</p>
              <p><b>EPIC:</b> {voter.epic}</p>
              <p><b>श्रेणी:</b> {voter.section}</p>
              <p><b>अनुक्रमांक:</b> {voter.serial}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
