import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AdSense } from "@/components/AdSense";
import AddWatermark from "@/components/pdf-tools/AddWatermark";

export const metadata: Metadata = {
  title: 'Add Watermark to PDF - Free Online Tool',
  description: 'Stamp your PDF files with custom text watermarks. Adjust font size, color, opacity, and rotation privately in your browser.',
  alternates: { canonical: 'https://pdfmaster.app/add-watermark' }
};

const faqs = [
  { q: "Is it safe to watermark confidential PDFs?", a: "Yes. All processing is done securely within your browser. Your files never leave your device." },
  { q: "Can I watermark only specific pages?", a: "Yes, you can choose 'Selected Pages' and specify exactly which pages should receive the watermark." },
  { q: "Will the watermark cover my text?", a: "You can adjust the opacity of the watermark to make it semi-transparent so your underlying content remains visible." }
];

export default function AddWatermarkPage() {
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
      { "@type": "ListItem", "position": 2, "name": "Add Watermark", "item": "https://pdfmaster.app/add-watermark" }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="text-sm mb-8 text-slate-500">
        <Link href="/" className="hover:text-indigo-500">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 dark:text-slate-300 font-medium">Add Watermark</span>
      </nav>

      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Add Watermark to PDF</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">Stamp an image or text over your PDF in seconds. Completely private and secure.</p>
        <div className="mt-4 inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
          🔒 Processed Locally
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px]">
            <AddWatermark />
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <div className="sticky top-24">
            <AdSense adSlot="TOOL_SIDEBAR" adFormat="vertical" />
            
            <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">How to add a watermark</h3>
              <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside">
                <li>Upload your PDF file.</li>
                <li>Enter your watermark text in the configuration panel.</li>
                <li>Adjust size, opacity, color, and rotation.</li>
                <li>Preview the result and click "Apply Watermark".</li>
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


