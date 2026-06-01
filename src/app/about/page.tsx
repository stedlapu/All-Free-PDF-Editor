import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'About PDFMaster',
  description: 'Learn about PDFMaster, our privacy-first mission, and our commitment to free browser-based PDF tools.'
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">About PDFMaster</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          We believe PDF tools should be fast, free, and completely private.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Most online PDF tools require you to upload your sensitive documents to their servers. We thought there had to be a better way. PDFMaster was built with a privacy-first architecture, leveraging modern browser technologies to process your files locally.
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Our Commitments</h3>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-2">✓ <span>Files are never uploaded to any server</span></li>
            <li className="flex gap-2">✓ <span>100% free to use, forever</span></li>
            <li className="flex gap-2">✓ <span>No account or registration required</span></li>
            <li className="flex gap-2">✓ <span>No hidden watermarks on your files</span></li>
          </ul>
        </div>
      </div>

      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Technology Stack</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          We use cutting-edge web technologies including WebAssembly, PDF-lib, and PDF.js to bring desktop-class PDF processing directly to your browser.
        </p>
      </div>

      <div className="text-center">
        <Link href="/#tools" className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-colors">
          Explore Our Tools
        </Link>
      </div>
    </div>
  );
}
