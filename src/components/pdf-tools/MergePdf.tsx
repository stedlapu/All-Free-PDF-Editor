"use client";

import React, { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { GripVertical, Trash2, ArrowUp, ArrowDown, File as FileIcon, Download, Loader2 } from "lucide-react";
import { validatePdfFile, formatFileSize, downloadPdf } from "@/lib/pdf-utils";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toaster";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export default function MergePdf() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setIsLoading(true);
    setSuccess(false);
    setResultBytes(null);

    const newItems: FileItem[] = [];

    for (const file of selectedFiles) {
      const validation = await validatePdfFile(file);
      if (!validation.valid) {
        toast(validation.error || "Invalid file", "error");
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        newItems.push({
          id: Math.random().toString(36).substring(7),
          file,
          name: file.name,
          size: file.size,
          pageCount: pdfDoc.getPageCount(),
        });
      } catch (err) {
        toast(`Failed to read ${file.name}`, "error");
      }
    }

    setFiles((prev) => [...prev, ...newItems]);
    setIsLoading(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      if (temp && copy[index]) {
        copy[index - 1] = copy[index] as FileItem;
        copy[index] = temp;
      }
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      if (temp && copy[index + 1]) {
        copy[index] = copy[index + 1] as FileItem;
        copy[index + 1] = temp;
      }
      return copy;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsLoading(true);
    setProgress(0);
    setSuccess(false);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round((i / files.length) * 100));
        const file = files[i]!.file;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setProgress(100);
      const pdfBytes = await mergedPdf.save();
      setResultBytes(pdfBytes);
      setSuccess(true);
      toast("PDFs merged successfully!", "success");
    } catch (err) {
      toast("Failed to merge PDFs. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultBytes) {
      downloadPdf(resultBytes, "merged.pdf");
    }
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const totalPages = files.reduce((acc, f) => acc + f.pageCount, 0);

  return (
    <div className="space-y-6">
      {!success && (
        <>
          <DropZone onFilesSelected={handleFilesSelected} multiple={true} label="Drop PDF files here or click to upload" />
          
          {files.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span>{files.length} files selected</span>
                <span>{totalPages} total pages • {formatFileSize(totalSize)}</span>
              </div>
              
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={file.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                    <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                    <FileIcon className="w-8 h-8 text-red-500" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)} • {file.pageCount} pages</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-50" aria-label="Move up">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveDown(index)} disabled={index === files.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-50" aria-label="Move down">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeFile(file.id)} className="p-1 text-red-400 hover:text-red-600 ml-2" aria-label="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {isLoading && <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>}

              <button
                onClick={handleMerge}
                disabled={files.length < 2 || isLoading || totalSize > 200 * 1024 * 1024}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isLoading ? "Merging..." : `Merge ${files.length} PDFs`}
              </button>
              
              {totalSize > 200 * 1024 * 1024 && (
                <p className="text-xs text-red-500 text-center">Total file size exceeds 200MB limit.</p>
              )}
            </div>
          )}
        </>
      )}

      {success && (
        <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">PDFs Merged Successfully!</h2>
          <p className="text-slate-600 dark:text-slate-400">Your files have been combined into a single document.</p>
          <div className="flex justify-center gap-4 pt-4">
            <button onClick={handleDownload} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
              Download Merged PDF
            </button>
            <button onClick={() => { setSuccess(false); setFiles([]); setResultBytes(null); }} className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
              Merge More Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
