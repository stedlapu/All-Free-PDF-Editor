import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TOOLS_LINKS: FooterLink[] = [
  { label: "Merge PDF", href: "/merge-pdf" },
  { label: "Split PDF", href: "/split-pdf" },
  { label: "Compress PDF", href: "/compress-pdf" },  { label: "Remove Pages", href: "/remove-pages" },
  { label: "Reorder Pages", href: "/reorder-pages" },
  { label: "Add Watermark", href: "/add-watermark" },
  { label: "Text to PDF", href: "/text-to-pdf" },
];



const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PdfLogoIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#ef4444" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        letterSpacing="0.5"
      >
        PDF
      </text>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-500 flex-shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.51.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="space-y-2" role="list">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer
      className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Privacy notice banner */}
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start gap-2 justify-center text-center">
            <ShieldIcon />
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              Files are processed locally in your browser — nothing is ever
              uploaded to our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg w-fit"
              aria-label="PDFMaster home"
            >
              <PdfLogoIcon />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                PDF<span className="text-indigo-600">Master</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Your All-in-One PDF Toolkit. Fast, secure, and completely free.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PDFMaster on GitHub (opens in new tab)"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PDFMaster on Twitter (opens in new tab)"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Tools column */}
          <FooterLinkColumn title="Tools" links={TOOLS_LINKS} />



          {/* Legal column */}
          <FooterLinkColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} PDFMaster. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built with ♥ for privacy-first document processing.
          </p>
        </div>
      </div>
    </footer>
  );
}



