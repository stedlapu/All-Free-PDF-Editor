import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-data";
import { AdSense } from "@/components/AdSense";

export const metadata: Metadata = {
  title: 'PDF Tips & Guides Blog',
  description: 'Learn how to work with PDFs. Tips, tutorials, and guides for merging, splitting, compressing, and editing PDF files.',
  alternates: { canonical: 'https://pdfmaster.app/blog' }
};

export default function BlogIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm mb-8 text-slate-500">
        <Link href="/" className="hover:text-indigo-500">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 dark:text-slate-300">Blog</span>
      </nav>

      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">PDF Tips & Guides</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to know about working with PDF documents, staying private online, and boosting your productivity.</p>
      </div>

      <div className="my-8">
        <AdSense adSlot="BLOG_INDEX_TOP" adFormat="horizontal" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-slate-500">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
                {post.description}
              </p>
              <div className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Read More <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
