"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import type * as pdfjsLibType from "pdfjs-dist";
import { Download, Loader2, File as FileIcon, Copy, Trash2 } from "lucide-react";
import { validatePdfFile, formatFileSize, downloadPdf } from "@/lib/pdf-utils";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toaster";

interface ReorderItem {
  id: string;
  originalIndex: number;
  thumbnailDataUrl: string | null;
}

export default function ReorderPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ReorderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0]; if (!selected) return;
    
    setIsLoading(true);

    const validation = await validatePdfFile(selected);
    if (!validation.valid) {
      toast(validation.error || "Invalid file", "error");
      setIsLoading(false);
      return;
    }

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      setFile(selected);

      const items: ReorderItem[] = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          await page.render({ canvas, viewport }).promise;
          items.push({
            id: `page_${i}_${Math.random().toString(36).substring(7)}`,
            originalIndex: i - 1,
            thumbnailDataUrl: canvas.toDataURL("image/jpeg", 0.7)
          });
        }
        page.cleanup();
      }
      setPages(items);
      pdfDoc.cleanup();
    } catch (err) {
      toast("Failed to read PDF file.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const oldIndex = pages.findIndex(p => p.id === draggedId);
    const newIndex = pages.findIndex(p => p.id === targetId);
    
    const newPages = [...pages];
    const [removed] = newPages.splice(oldIndex, 1);
    newPages.splice(newIndex, 0, removed!);
    
    setPages(newPages);
    setDraggedId(null);
  };

  const handleDuplicate = (index: number) => {
    const item = pages[index];
    if (!item) return;
    const newPages = [...pages];
    newPages.splice(index + 1, 0, {
      ...item,
      id: `page_${item.originalIndex}_dup_${Math.random().toString(36).substring(7)}`
    });
    setPages(newPages);
  };

  const handleDelete = (id: string) => {
    if (pages.length <= 1) {
      toast("You cannot delete the last page.", "warning");
      return;
    }
    setPages(pages.filter(p => p.id !== id));
  };

  const handleDownload = async () => {
    if (!file || pages.length === 0) return;
    setIsSaving(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const pageIndices = pages.map(p => p.originalIndex);
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      downloadPdf(pdfBytes, `reordered_${file.name}`);
      toast("PDF reordered successfully!", "success");
    } catch (err) {
      toast("Failed to reorder PDF.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file && (
        <DropZone onFilesSelected={handleFilesSelected} multiple={false} label="Drop a PDF file here or click to upload" />
      )}

      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-slate-500">Generating page thumbnails...</p>
        </div>
      )}

      {file && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <FileIcon className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-500">{pages.length} pages</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFile(null); setPages([]); }} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Start Over
              </button>
              <button onClick={handleDownload} disabled={isSaving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Download PDF"}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, page.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, page.id)}
                  className={`relative group bg-white dark:bg-slate-800 rounded-lg p-2 shadow-sm border-2 cursor-move transition-all ${draggedId === page.id ? 'opacity-50 border-indigo-400 border-dashed' : 'border-transparent hover:border-indigo-400 hover:shadow-md'}`}
                >
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center z-10">
                    {index + 1}
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-700 rounded mb-2 overflow-hidden" style={{ aspectRatio: '0.707' }}>
                    {page.thumbnailDataUrl ? (
                      <img src={page.thumbnailDataUrl} alt={`Page ${index + 1}`} className="w-full h-full object-contain pointer-events-none" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Loading</div>
                    )}
                  </div>

                  <div className="flex justify-between items-center px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => handleDuplicate(index)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors" title="Duplicate page">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(page.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Remove page">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


