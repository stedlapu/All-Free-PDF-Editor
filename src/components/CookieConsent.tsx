"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const CONSENT_KEY = "pdf_cookie_consent";

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function injectAdSenseScript(): void {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return;

  // Prevent duplicate injection
  if (document.querySelector(`script[data-adsense]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-adsense", "true");
  document.head.appendChild(script);
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setVisible(true);
        // Trigger slide-up animation after mount
        const timer = setTimeout(() => setAnimateIn(true), 50);
        return () => clearTimeout(timer);
      }
      // If already accepted, ensure script is injected on re-mount
      if (stored === "accepted") {
        injectAdSenseScript();
      }
    } catch {
      // localStorage unavailable (e.g., private mode with strict settings)
    }
  }, []);

  const handleAccept = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Silently fail if localStorage is unavailable
    }
    injectAdSenseScript();
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  const handleDecline = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch {
      // Silently fail
    }
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4 sm:mx-0 transition-all duration-300 ease-out ${
        animateIn
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-500" aria-hidden="true">
            <ShieldIcon />
          </span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Cookie Notice
          </h2>
        </div>

        {/* Body */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-1">
          We use cookies for basic analytics and ads. Your PDF files{" "}
          <strong className="font-semibold text-slate-800 dark:text-slate-100">
            never leave your browser
          </strong>
          .
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Learn more in our{" "}
          <Link
            href="/privacy"
            className="underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAccept}
            aria-label="Accept cookies"
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleDecline}
            aria-label="Decline cookies"
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
