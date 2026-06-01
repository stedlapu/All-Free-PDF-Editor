import Link from "next/link";
import { AdSense } from "@/components/AdSense";
import { ChevronRight, Shield } from "lucide-react";

export interface ToolLayoutProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
  breadcrumbHref: string;
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  usageSteps?: Array<{ step: number; title: string; description: string }>;
  benefits?: Array<{ icon: string; title: string; description: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
  relatedTools?: Array<{ name: string; href: string; description: string }>;
  adSlot?: string;
}

export function ToolLayout({
  title,
  subtitle,
  breadcrumb,
  breadcrumbHref,
  children,
  sidebarContent,
  usageSteps,
  benefits,
  faqItems,
  relatedTools,
  adSlot,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1326]">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0b1326]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Tools
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link
              href={breadcrumbHref}
              className="text-indigo-600 dark:text-indigo-400 font-medium"
              aria-current="page"
            >
              {breadcrumb}
            </Link>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#0b1326] via-[#1a1040] to-[#0b1326] py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">{subtitle}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-2 w-fit mx-auto">
            <Shield className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Files are processed locally in your browser and are not uploaded to our servers.</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tool Workspace */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              {children}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
            {/* AdSense Sidebar */}
            <AdSense adSlot={adSlot ?? "SIDEBAR"} adFormat="vertical" />

            {/* Sidebar content (how it works etc.) */}
            {sidebarContent}

            {/* Related Tools */}
            {relatedTools && relatedTools.length > 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  Related Tools
                </h3>
                <ul className="space-y-2" role="list">
                  {relatedTools.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Usage Guide */}
        {usageSteps && usageSteps.length > 0 && (
          <section className="mt-12" aria-labelledby="usage-guide-heading">
            <h2 id="usage-guide-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              How to Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {usageSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4 flex-shrink-0">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Benefits */}
        {benefits && benefits.length > 0 && (
          <section className="mt-12" aria-labelledby="benefits-heading">
            <h2 id="benefits-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Why Use PDFMaster?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="text-3xl flex-shrink-0" role="img" aria-label={benefit.title}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{benefit.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* In-content AdSense */}
        <div className="mt-10">
          <AdSense adSlot="IN_CONTENT" adFormat="horizontal" />
        </div>

        {/* FAQ Section */}
        {faqItems && faqItems.length > 0 && (
          <section className="mt-12" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {item.question}
                    <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
