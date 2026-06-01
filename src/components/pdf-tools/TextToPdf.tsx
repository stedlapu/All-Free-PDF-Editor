"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Download, Loader2, Settings, Type, FileText } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div> });

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'header': 1 }, { 'header': 2 }, 'blockquote'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }, { 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'color', 'background', 'align', 'direction', 'script'
];

type PageFormat = "a4" | "letter" | "legal" | "a3";
type PageOrientation = "portrait" | "landscape";

export default function TextToPdf() {
  const [content, setContent] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Settings
  const [format, setFormat] = useState<PageFormat>("a4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [margin, setMargin] = useState<number>(15);
  
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load from local storage
    const saved = localStorage.getItem("pdfmaster_text_draft");
    if (saved) {
      setContent(saved);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        localStorage.setItem("pdfmaster_text_draft", content);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, mounted]);

  const handleExport = async () => {
    if (!content || content.trim() === "<p><br></p>") {
      toast("Please enter some text before exporting.", "error");
      return;
    }

    setIsExporting(true);
    
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import("html2pdf.js")).default;
      
      const element = document.createElement("div");
      element.innerHTML = content;
      
      // Apply styling to the temporary element so it looks good in PDF
      element.style.padding = "20px";
      element.style.fontFamily = "Inter, Arial, sans-serif";
      element.style.fontSize = "16px";
      element.style.lineHeight = "1.6";
      element.style.color = "#000000";
      
      // Fix image sizing for PDF
      const images = element.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      });

      const opt = {
        margin: margin,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: format, orientation: orientation }
      };

      await html2pdf().set(opt).from(element).save();
      toast("PDF exported successfully!", "success");
    } catch (error) {
      console.error(error);
      toast("An error occurred during export.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 p-4 space-y-6 shrink-0">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold border-b border-slate-200 dark:border-slate-700 pb-2">
            <Settings className="w-5 h-5" />
            Document Settings
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Size</label>
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value as PageFormat)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="a4">A4 (Standard)</option>
                <option value="letter">US Letter</option>
                <option value="legal">US Legal</option>
                <option value="a3">A3 (Large)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Orientation</label>
              <div className="flex gap-2 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                <button
                  onClick={() => setOrientation("portrait")}
                  className={`flex-1 py-1 text-sm rounded ${orientation === "portrait" ? "bg-white dark:bg-slate-800 shadow-sm font-medium" : "text-slate-600 dark:text-slate-400"}`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => setOrientation("landscape")}
                  className={`flex-1 py-1 text-sm rounded ${orientation === "landscape" ? "bg-white dark:bg-slate-800 shadow-sm font-medium" : "text-slate-600 dark:text-slate-400"}`}
                >
                  Landscape
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Margins (mm)</label>
              <input 
                type="number" 
                value={margin} 
                onChange={(e) => setMargin(Number(e.target.value))}
                min="0" max="50"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium text-sm">
              <Type className="w-4 h-4 text-indigo-500" />
              Rich Text Editor
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Auto-saved
            </div>
          </div>
          
          <div className="p-0 flex-1 min-h-[500px] text-slate-900 dark:text-slate-100 quill-wrapper">
            <style dangerouslySetInnerHTML={{__html: `
              .quill-wrapper .ql-toolbar {
                border: none !important;
                border-bottom: 1px solid #e2e8f0 !important;
                background: #f8fafc;
                font-family: inherit;
              }
              .dark .quill-wrapper .ql-toolbar {
                background: #0f172a;
                border-bottom-color: #334155 !important;
              }
              .dark .quill-wrapper .ql-stroke {
                stroke: #cbd5e1;
              }
              .dark .quill-wrapper .ql-fill {
                fill: #cbd5e1;
              }
              .dark .quill-wrapper .ql-picker {
                color: #cbd5e1;
              }
              .quill-wrapper .ql-container {
                border: none !important;
                font-family: 'Inter', sans-serif;
                font-size: 16px;
                min-height: 500px;
              }
              .quill-wrapper .ql-editor {
                min-height: 500px;
                padding: 2rem;
              }
            `}} />
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              formats={formats}
              placeholder="Start typing your document here..."
              className="h-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
