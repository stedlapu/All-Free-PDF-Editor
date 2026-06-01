import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AdSense } from "@/components/AdSense";
import { 
  FileText, Scissors, FileArchive, RotateCcw, 
  Trash2, GripVertical, Type, Edit3, CheckCircle2, Shield 
} from "lucide-react";

export const metadata: Metadata = {
  title: 'PDFMaster - Your All-in-One PDF Toolkit',
  description: 'Process PDFs directly in your browser. 100% private, secure, and fast. Merge, split, compress, and edit PDFs for free.',
  alternates: { canonical: 'https://pdfmaster.app' }
};

const tools = [
  { href: "/merge-pdf", name: "Merge PDF", desc: "Combine multiple PDFs into one", icon: FileText, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { href: "/split-pdf", name: "Split PDF", desc: "Extract pages into separate files", icon: Scissors, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  { href: "/compress-pdf", name: "Compress PDF", desc: "Reduce PDF file size", icon: FileArchive, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },  { href: "/remove-pages", name: "Remove Pages", desc: "Delete unwanted pages", icon: Trash2, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  { href: "/reorder-pages", name: "Reorder Pages", desc: "Rearrange page order", icon: GripVertical, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  { href: "/add-watermark", name: "Add Watermark", desc: "Stamp text on your PDFs", icon: Type, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  { href: "/text-to-pdf", name: "Text to PDF", desc: "Create PDFs from rich text", icon: Edit3, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
];

const faqs = [
  { q: "Is PDFMaster really free?", a: "Yes, completely free, no signup required." },
  { q: "Are my PDF files safe?", a: "Files are processed locally in your browser. We never see your files." },
  { q: "What is the maximum file size?", a: "Up to 100MB per file for most tools." },
  { q: "Do I need to create an account?", a: "No, completely anonymous." },
  { q: "Does it work on mobile?", a: "Yes, fully responsive." },
  { q: "What browsers are supported?", a: "All modern browsers (Chrome, Firefox, Safari, Edge)." },
];

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-[#0b1326] via-[#1a1040] to-[#0b1326]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[100px]" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-8 backdrop-blur-sm">
            <Shield className="w-4 h-4" /> Privacy First
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 mb-6 tracking-tight">
            Your All-in-One PDF Toolkit
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Process PDFs directly in your browser. Your files never leave your device.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="#tools" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all w-full sm:w-auto">
              Start for Free
            </Link>
            <Link href="#tools" className="px-8 py-4 bg-transparent border-2 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-bold text-lg transition-all w-full sm:w-auto">
              View All Tools
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Private</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Processing</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Signup</span>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful PDF Tools</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to manage your PDF documents securely.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.name} href={tool.href} className="group flex flex-col p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.bg} ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow">{tool.desc}</p>
                <div className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center">
                  Try it out <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 my-8 w-full">
        <AdSense adSlot="HOMEPAGE_BANNER" adFormat="horizontal" />
      </div>

      {/* Features Alternating */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Privacy-First Architecture</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlike other PDF tools, we never upload your documents. All processing happens locally in your browser using advanced WebAssembly technology. Your sensitive data stays exactly where it belongs — on your device.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-3xl border border-indigo-500/10 flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Shield className="w-32 h-32 text-indigo-500/50" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">8 Powerful Tools</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                From merging and splitting to watermarking and editing, we cover every PDF task you need. A full suite of desktop-class PDF tools accessible from any device, anywhere.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl border border-violet-500/10 flex items-center justify-center overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <FileArchive className="w-32 h-32 text-violet-500/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Loved by Professionals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Finally a PDF tool I can trust with sensitive documents! The local processing is a game-changer.", name: "Sarah K.", role: "Data Analyst" },
              { text: "Super fast and works offline too. Perfect for my workflow when I'm traveling without reliable internet.", name: "Marcus T.", role: "Developer" },
              { text: "The watermark tool saved me so much time on my contracts. The interface is clean and straightforward.", name: "Elena M.", role: "Freelancer" }
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-yellow-400 flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden">
                <summary className="font-bold text-lg text-slate-900 dark:text-white p-6 cursor-pointer select-none flex justify-between items-center outline-none">
                  {faq.q}
                  <span className="text-indigo-500 group-open:rotate-180 transition-transform duration-300">▼</span>
                </summary>
                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-indigo-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Work Smarter?</h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">Join thousands of users who trust PDFMaster for their document processing needs.</p>
          <Link href="#tools" className="inline-block px-10 py-5 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl">
            Get Started Now
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 my-12 w-full text-center">
        <AdSense adSlot="HOMEPAGE_FOOTER_BANNER" adFormat="horizontal" />
      </div>
    </div>
  );
}



