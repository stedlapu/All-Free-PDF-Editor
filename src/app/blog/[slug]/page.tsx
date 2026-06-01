import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog-data";
import { AdSense } from "@/components/AdSense";

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return {};
  
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://pdfmaster.app/blog/${slug}` }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "dateModified": post.lastModified,
    "author": {
      "@type": "Organization",
      "name": "PDFMaster"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const paragraphs = post.content.split('\n\n');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-sm mb-8 text-slate-500">
        <Link href="/" className="hover:text-indigo-500">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-indigo-500">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 dark:text-slate-300 truncate inline-block max-w-[200px] align-bottom">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2 space-y-8">
          <header className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-slate-500">{new Date(post.date).toLocaleDateString()}</span>
              <span className="text-sm text-slate-500">• {post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {paragraphs.map((p, i) => (
              <React.Fragment key={i}>
                <p>{p}</p>
                {i === 2 && (
                  <div className="my-8">
                    <AdSense adSlot="BLOG_IN_ARTICLE" adFormat="auto" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {post.faqItems.map((faq, i) => (
                <details key={i} className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                  <summary className="font-semibold text-slate-900 dark:text-white outline-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-indigo-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </article>

        <aside className="space-y-8">
          <div className="bg-indigo-50 dark:bg-slate-800 rounded-2xl p-6 border border-indigo-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Try the Tool</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Process your PDFs instantly in your browser. No signup, no limits.</p>
            <Link href={post.relatedTool} className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors">
              Open Tool
            </Link>
          </div>

          <div className="sticky top-24">
            <AdSense adSlot="BLOG_SIDEBAR" adFormat="vertical" />
          </div>
        </aside>
      </div>
    </div>
  );
}
