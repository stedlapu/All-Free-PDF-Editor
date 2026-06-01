'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
      {faqs.map((faq, i) => (
        <div key={i} className="py-4">
          <button
            className="flex w-full items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#f8fafc] dark:focus:ring-offset-[#0b1326] rounded-lg py-1"
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="text-base font-medium text-slate-900 dark:text-white">
              {faq.q}
            </span>
            <span
              aria-hidden="true"
              className={`flex-shrink-0 text-indigo-500 transition-transform duration-200 ${
                openIndex === i ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>
          <div
            id={`faq-answer-${i}`}
            role="region"
            aria-labelledby={`faq-question-${i}`}
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === i ? 'max-h-48 mt-3' : 'max-h-0'
            }`}
          >
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
