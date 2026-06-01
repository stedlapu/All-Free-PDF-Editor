"use client";

import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

// Extend the Window interface for adsbygoogle
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const CONSENT_KEY = "pdf_cookie_consent";

function isConsentGiven(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

// ─── Placeholder shown when no consent or dev mode ───────────────────────────

function AdPlaceholder({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-label="Advertisement placeholder"
      className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg min-h-[90px] ${
        className ?? ""
      }`}
    >
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-widest uppercase select-none">
        Advertisement
      </span>
    </div>
  );
}

// ─── AdSense ─────────────────────────────────────────────────────────────────

export function AdSense({
  adSlot,
  adFormat = "auto",
  className,
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  const shouldShowAd =
    isConsentGiven() &&
    !isDevelopment() &&
    Boolean(clientId);

  useEffect(() => {
    if (!shouldShowAd || initialized.current) return;

    try {
      if (adRef.current && adRef.current.offsetWidth > 0) {
        (window.adsbygoogle = window.adsbygoogle ?? []).push({});
        initialized.current = true;
      }
    } catch {
      // Gracefully swallow AdSense push errors
    }
  }, [shouldShowAd]);

  if (!shouldShowAd) {
    return <AdPlaceholder className={className} />;
  }

  return (
    <div
      className={className}
      aria-label="Advertisement"
      role="complementary"
    >
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={style ?? { display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
