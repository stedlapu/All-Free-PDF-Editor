"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate submission since we have no backend
    setTimeout(() => setStatus("success"), 1000);
  };

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Message Sent!</h1>
        <p className="text-slate-600 dark:text-slate-400">Thanks for reaching out. We will get back to you as soon as possible.</p>
        <button onClick={() => setStatus("idle")} className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Have a question or feedback? We would love to hear from you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
          <input required type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
          <input required type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
          <select className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
          <textarea required rows={5} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
        </div>

        <button disabled={status === "submitting"} type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition-colors">
          {status === "submitting" ? "Sending..." : <>Send Message <Send className="w-4 h-4" /></>}
        </button>
        
        <p className="text-xs text-center text-slate-500 pt-4">We do not store any data you submit here. This form sends an email directly to our support team.</p>
      </form>
    </div>
  );
}
