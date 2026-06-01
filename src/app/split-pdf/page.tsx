import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AdSense } from "@/components/AdSense";
import SplitPdf from "@/components/pdf-tools/SplitPdf";

export const metadata: Metadata = {
  title: 'Split PDF - Extract Pages from PDF Online',
  description: 'Split PDF files into separate documents or extract specific pages. Fast, secure, and browser-based.',
  alternates: { canonical: 'https://pdfmaster.app/split-pdf' }
};

const faqs = [
  { q: "Is it safe to split sensitive PDFs here?", a: "Yes. All splitting happens locally in your browser. Your files are never uploaded to any server." },
  { q: "Can I extract just one page?", a: "Yes, you can use 'By Range' and enter a single page number, or use 'Selected Pages' to click exactly what you want." },
  { q: "How does 'Individual Pages' mode work?", a: "It will take your PDF and create a separate PDF file for every single page in the document." }
];

export default function SplitPdfPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pdfmaster.app" },
      { "@type": "ListItem", "position": 2, "name": "Split PDF", "item": "https://pdfmaster.app/split-pdf" }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="text-sm mb-8 text-slate-500">
        <Link href="/" className="hover:text-indigo-500">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 dark:text-slate-300 font-medium">Split PDF</span>
      </nav>

      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Split PDF</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">Separate one page or a whole set for easy conversion into independent PDF files.</p>
        <div className="mt-4 inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
          🔒 Processed Locally
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px]">
            <SplitPdf />
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <div className="sticky top-24">
            <AdSense adSlot="TOOL_SIDEBAR" adFormat="vertical" />
            
            <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">How to split PDFs</h3>
              <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside">
                <li>Select or drag & drop your PDF file.</li>
                <li>Choose a split mode: Range, Individual, or Selected Pages.</li>
                <li>Specify the pages to extract.</li>
                <li>Click the "Split PDF" button and download your files.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="my-8 text-center">
        <AdSense adSlot="TOOL_BOTTOM" adFormat="horizontal" />
      </div>
    </div>
  );
}


