export default function Footer() {
  return (
    <footer className="mt-12 mb-8 text-sm text-gray-600 dark:text-gray-300">
      <div className="rounded-xl p-4 bg-white/80 dark:bg-black/40 shadow">
        <p className="mb-2">
          सूचना: या वेबसाईटवरील मतदार माहिती कधी कधी चुकीची असू शकते.
          कृपया अधिकृत प्रकाशित मतदार यादी तपासून खात्री करा.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/chandan_patil_nagralkar"
            target="_blank"
            className="underline"
          >
            Instagram
          </a>

          <a
            href="https://www.facebook.com/ChandanBaswarajPatilNagralkar?rdid=W1DtEZUwqon0vbIY"
            target="_blank"
            className="underline"
          >
            Facebook
          </a>
        </div>

        <div className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} चंदन बसवराज पाटील (नागराळकर)
        </div>
      </div>
    </footer>
  );
}
