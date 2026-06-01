"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Loader2, File as FileIcon, Scissors } from "lucide-react";
import { validatePdfFile, formatFileSize, downloadPdf, downloadBlob } from "@/lib/pdf-utils";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toaster";
import JSZip from "jszip";

type SplitMode = "range" | "individual";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitMode, setSplitMode] = useState<SplitMode>("range");
  const [rangeInput, setRangeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resultFiles, setResultFiles] = useState<{name: string, bytes: Uint8Array}[]>([]);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0]; if (!selected) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const validation = await validatePdfFile(selected);
    if (!validation.valid) {
      toast(validation.error || "Invalid file", "error");
      setIsLoading(false);
      return;
    }

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setTotalPages(pdfDoc.getPageCount());
      setFile(selected);
    } catch (err) {
      toast("Failed to read PDF file.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const parseRange = (range: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = range.split(",");
    
    for (const part of parts) {
      const p = part.trim();
      if (!p) continue;
      
      if (p.includes("-")) {
        const [start = NaN, end = NaN] = p.split("-").map(n => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= maxPages) {
          for (let i = start; i <= end; i++) {
            pages.add(i - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const num = parseInt(p, 10);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num - 1);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const results: {name: string, bytes: Uint8Array}[] = [];

      if (splitMode === "range") {
        const pagesToExtract = parseRange(rangeInput, totalPages);
        if (pagesToExtract.length === 0) {
          toast("Please enter a valid page range.", "warning");
          setIsLoading(false);
          return;
        }
        
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(pdfDoc, pagesToExtract);
        copiedPages.forEach(p => newDoc.addPage(p));
        
        results.push({
          name: `split_${file.name}`,
          bytes: await newDoc.save()
        });
      } else if (splitMode === "individual") {
        for (let i = 0; i < totalPages; i++) {
          const newDoc = await PDFDocument.create();
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(copiedPage);
          results.push({
            name: `page_${i + 1}_${file.name}`,
            bytes: await newDoc.save()
          });
        }
      }

      setResultFiles(results);
      setSuccess(true);
      toast("PDF split successfully!", "success");
    } catch (err) {
      toast("An error occurred while splitting the PDF.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (resultFiles.length === 1) {
      downloadPdf(resultFiles[0]!.bytes, resultFiles[0]!.name);
    } else if (resultFiles.length > 1) {
      const zip = new JSZip();
      resultFiles.forEach((rf) => {
        zip.file(rf.name, rf.bytes);
      });
      const content = await zip.generateAsync({ type: "blob" });
      downloadBlob(content, "split_pages.zip");
    }
  };

  return (
    <div className="space-y-6">
      {!file && (
        <DropZone onFilesSelected={handleFilesSelected} multiple={false} label="Drop a PDF file here or click to upload" />
      )}

      {file && !success && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <FileIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-sm">{file.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(file.size)} • {totalPages} pages</p>
            </div>
            <button onClick={() => setFile(null)} className="ml-auto text-sm text-red-500 hover:text-red-600 transition-colors">
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 dark:text-white">Split Mode</h3>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${splitMode === 'range' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                <input type="radio" checked={splitMode === 'range'} onChange={() => setSplitMode('range')} className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">Custom Range</span>
              </label>
              <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${splitMode === 'individual' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                <input type="radio" checked={splitMode === 'individual'} onChange={() => setSplitMode('individual')} className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">All Pages</span>
              </label>
            </div>

            {splitMode === "range" && (
              <div className="pt-4 space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pages to extract</label>
                <input 
                  type="text" 
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g., 1-3, 5, 7-9"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-slate-500">Document has {totalPages} pages.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSplit}
            disabled={isLoading || (splitMode === 'range' && !rangeInput.trim())}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
            {isLoading ? "Splitting..." : "Split PDF"}
          </button>
        </div>
      )}

      {success && (
        <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">PDF Split Successfully!</h2>
          <p className="text-slate-600 dark:text-slate-400">Created {resultFiles.length} file(s).</p>
          <div className="flex justify-center gap-4 pt-4">
            <button onClick={handleDownload} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
              Download {resultFiles.length > 1 ? "ZIP" : "PDF"}
            </button>
            <button onClick={() => { setSuccess(false); setFile(null); setResultFiles([]); }} className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
              Split Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
