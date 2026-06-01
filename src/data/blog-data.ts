export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  lastModified: string;
  category: string;
  readTime: string;
  relatedTool: string;
  content: string;
  faqItems: Array<{ question: string; answer: string }>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files Online (Free & Private)',
    description: 'Learn the easiest way to combine multiple PDF files into one document without uploading your sensitive data to the cloud.',
    date: '2024-05-15T00:00:00Z',
    lastModified: '2024-05-15T00:00:00Z',
    category: 'Tutorial',
    readTime: '3 min read',
    relatedTool: '/merge-pdf',
    content: 'Merging PDFs shouldn\'t require expensive desktop software or risky cloud uploads. With modern web technologies, you can now combine your documents entirely in your browser.\n\nOur merge tool uses WebAssembly to process your files locally. This means your data never leaves your computer, ensuring 100% privacy and lightning-fast speeds.\n\nTo get started, simply drag and drop your PDFs into the merge tool. You can reorder them by dragging the handles up or down. Once they are in the right order, click "Merge PDFs" and your new combined file will download instantly.',
    faqItems: [
      { question: 'Is it safe to merge sensitive PDFs online?', answer: 'Yes, if you use a client-side tool like PDFMaster. Since the files are processed in your browser and never uploaded to a server, it is completely secure.' },
      { question: 'Can I reorder files before merging?', answer: 'Absolutely. Just drag and drop the files in the list to rearrange them before you click merge.' }
    ]
  },
  {
    slug: 'how-to-split-pdf-files',
    title: 'How to Split a PDF File into Multiple Documents',
    description: 'Need to extract specific pages from a large PDF? Here is a quick guide on how to split PDFs easily and securely.',
    date: '2024-05-18T00:00:00Z',
    lastModified: '2024-05-18T00:00:00Z',
    category: 'Guide',
    readTime: '4 min read',
    relatedTool: '/split-pdf',
    content: 'Large PDF documents can be difficult to share. Splitting them into smaller, more manageable pieces is often the best solution.\n\nWith our PDF Splitter, you have two options. You can extract a specific range of pages (like 1-5, 8, 11-13) into a single new document, or you can split the entire PDF so that every single page becomes its own file.\n\nJust upload your PDF, choose your split mode, and hit "Split PDF". It happens instantly right in your browser.',
    faqItems: [
      { question: 'Can I extract non-consecutive pages?', answer: 'Yes, you can enter comma-separated ranges like "1-3, 5, 8-10".' }
    ]
  }
];
