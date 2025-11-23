import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 mb-10 text-center">
      <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text mb-4">
        Connect With Us
      </h3>

      <div className="flex justify-center gap-6 text-3xl mb-6">
        <a
          href="https://www.instagram.com/chandan_patil_nagralkar"
          target="_blank"
          className="text-gray-600 hover:text-yellow-500 transition"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.facebook.com/ChandanBaswarajPatilNagralkar"
          target="_blank"
          className="text-gray-600 hover:text-yellow-500 transition"
        >
          <FaFacebookF />
        </a>
      </div>

      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} चंदन बस्वराज पाटील (नागराळकर). All rights reserved.
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Developed by <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text font-semibold">Father’s Media</span>
      </p>
    </footer>
  );
}
