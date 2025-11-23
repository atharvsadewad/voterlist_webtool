export default function Footer() {
  return (
    <footer className="mt-20 mb-10 text-center">
      <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text mb-4">
        Connect With Us
      </h3>

      <div className="flex justify-center gap-8 mb-6">

        {/* Instagram */}
        <a href="https://www.instagram.com/chandan_patil_nagralkar" target="_blank">
          <svg width="32" height="32" fill="none" stroke="#b8b8b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className="hover:stroke-yellow-500 transition cursor-pointer">
            <rect x="2" y="2" width="20" height="20" rx="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>

        {/* Facebook */}
        <a href="https://www.facebook.com/ChandanBaswarajPatilNagralkar" target="_blank">
          <svg width="32" height="32" fill="none" stroke="#b8b8b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className="hover:stroke-yellow-500 transition cursor-pointer">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>

      </div>

      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} चंदन बस्वराज पाटील (नागराळकर). All rights reserved.
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Developed by{" "}
        <a
  href="https://fathersmedia.in"
  target="_blank"
  className="underline text-green-700"
>
  Father’s Media
</a>
      </p>
    </footer>
  );
}
