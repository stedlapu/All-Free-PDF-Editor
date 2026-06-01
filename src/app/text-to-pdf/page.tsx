import { Metadata } from "next";
import TextToPdf from "@/components/pdf-tools/TextToPdf";

export const metadata: Metadata = {
  title: "Text to PDF Converter | Free Online Rich Text Editor",
  description: "Create professional PDF documents from text directly in your browser. Features a rich text editor, formatting, fonts, and secure local processing.",
};

export default function TextToPdfPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Text to PDF Converter
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Write and format your document using our rich text editor, then instantly convert it to a beautiful, paginated PDF. 100% private and runs entirely in your browser.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <TextToPdf />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 mt-16">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">How to Convert Text to PDF</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold">1</div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Write Content</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Use the rich text editor to write or paste your content. We auto-save your draft as you type.</p>
          </div>
          
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold">2</div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Format & Style</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Add bold, italics, tables, lists, and images. Customize the page size and orientation on the left.</p>
          </div>
          
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold">3</div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Export to PDF</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Click the export button. We instantly render your document into a high-quality PDF, without uploading any data.</p>
          </div>
        </div>

        <hr className="my-8 border-slate-200 dark:border-slate-700" />

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Is my text and data private?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Yes! This entire application runs locally in your web browser using JavaScript. Nothing you type is ever sent to an external server.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Can I add images to my PDF?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Yes, you can use the image tool in the toolbar to upload images. They will be embedded directly into your final PDF.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Why isn't my exact font rendering in the PDF?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">For the highest performance, the PDF exporter relies on standard browser fonts (like Arial, Helvetica, and Times New Roman). Complex custom fonts may fall back to standard equivalents.</p>
          </div>
        </div>
      </div>
      
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Text to PDF Converter",
            "url": "https://pdfmaster.example.com/text-to-pdf",
            "description": "Create professional PDF documents from plain text or rich text content directly in your browser.",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Any"
          })
        }}
      />
    </div>
  );
}
