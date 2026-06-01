# PDFMaster

PDFMaster is a modern, privacy-first SaaS platform providing an all-in-one PDF toolkit. All file processing happens entirely in the browser using WebAssembly, ensuring that sensitive documents are never uploaded to any external servers.

## Features
- **Privacy-First**: Zero server uploads.
- **Merge PDF**: Combine multiple files and reorder pages.
- **Split PDF**: Extract page ranges or split into individual pages.
- **Compress PDF**: Optimize file size.
- **Rotate PDF**: Rotate pages by 90/180 degrees.
- **Remove Pages**: Easily delete unwanted pages from a PDF.
- **Reorder Pages**: Drag-and-drop page reordering.
- **Add Watermark**: Apply custom text watermarks to your PDFs.
- **PDF Editor**: Add text overlays and annotations directly in the browser.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- pdf-lib
- pdfjs-dist

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.local.example` to `.env.local` and configure your settings.
   ```bash
   cp .env.local.example .env.local
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment (Vercel)
This project is configured out-of-the-box for deployment on Vercel's Free Tier.
1. Push the code to a GitHub repository.
2. Import the project in Vercel.
3. Configure your Environment Variables in Vercel.
4. Deploy.

## Security & Privacy
See [SECURITY.md](SECURITY.md) for detailed information on our security architecture and privacy commitments.

## License
MIT
