import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AdSense } from "@/components/AdSense";
import MergePdf from "@/components/pdf-tools/MergePdf";

export const metadata: Metadata = {
  title: 'Merge PDF - Combine PDF Files Online for Free',
  description: 'Merge multiple PDF files into one document securely in your browser. No uploads, fast, and 100% free.',
  alternates: { canonical: 'https://pdfmaster.app/merge-pdf' }
};

const faqs = [
  { q: "Is it safe to merge sensitive PDFs here?", a: "Yes. All merging happens locally in your browser. Your files are never uploaded to any server." },
  { q: "How many files can I merge at once?", a: "You can merge as many files as your device's memory can handle, but we recommend staying under 200MB total." },
  { q: "Can I reorder files before merging?", a: "Yes, you can drag and drop the files or use the up/down arrows to arrange them in the exact order you need." },
  { q: "Will the quality of my PDFs decrease?", a: "No, merging PDFs does not affect the quality or resolution of the original files." }
];

export default function MergePdfPage() {
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
      { "@type": "ListItem", "position": 2, "name": "Merge PDF", "item": "https://pdfmaster.app/merge-pdf" }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="text-sm mb-8 text-slate-500">
        <Link href="/" className="hover:text-indigo-500">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 dark:text-slate-300 font-medium">Merge PDF</span>
      </nav>

      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Merge PDF</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">Combine multiple PDFs and images into a single document.</p>
        <div className="mt-4 inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
          🔒 Processed Locally
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px]">
            <MergePdf />
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <div className="sticky top-24">
            <AdSense adSlot="TOOL_SIDEBAR" adFormat="vertical" />
            
            <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">How to merge PDFs</h3>
              <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside">
                <li>Select or drag & drop your PDF files into the tool.</li>
                <li>Drag the file cards to reorder them as needed.</li>
                <li>Click the "Merge PDFs" button.</li>
                <li>Download your combined document instantly.</li>
              </ol>
            </div>
            
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Related Tools</h3>
              <div className="flex flex-col gap-2">
                <Link href="/split-pdf" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">Split PDF</Link>
                <Link href="/compress-pdf" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">Compress PDF</Link>
                <Link href="/reorder-pages" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">Reorder Pages</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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


