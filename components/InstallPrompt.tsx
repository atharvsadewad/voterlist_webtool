"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("PWA installed");
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 flex items-center gap-4 border border-gray-300 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold">Install Ward-16 Voters</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add the app to your home screen for quick access.
          </p>
        </div>

        <button
          onClick={installApp}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Install
        </button>

        <button
          onClick={() => setShow(false)}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
