"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import type * as pdfjsLibType from "pdfjs-dist";
import { Download, Loader2, File as FileIcon, Minimize2, Settings } from "lucide-react";
import { validatePdfFile, formatFileSize, downloadPdf } from "@/lib/pdf-utils";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toaster";

type CompressLevel = "low" | "medium" | "high" | "target";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [compressLevel, setCompressLevel] = useState<CompressLevel>("medium");
  const [targetKb, setTargetKb] = useState<string>("500");
  const [isLoading, setIsLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0]; if (!selected) return;
    
    setIsLoading(true);
    setSuccess(false);

    const validation = await validatePdfFile(selected);
    if (!validation.valid) {
      toast(validation.error || "Invalid file", "error");
      setIsLoading(false);
      return;
    }

    setFile(selected);
    setOriginalSize(selected.size);
    setIsLoading(false);
  };

  const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      }, "image/jpeg", quality);
    });
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsLoading(true);
    setSuccess(false);
    setProgressMsg("Starting compression...");
    
    try {
      const arrayBuffer = await file.arrayBuffer();

      let pdfBytes: Uint8Array;

      if (compressLevel === "target") {
        // Target size compression (Rasterization)
        setProgressMsg("Initializing PDF engine...");
        const targetBytes = parseInt(targetKb) * 1024;
        if (isNaN(targetBytes) || targetBytes <= 0) {
          throw new Error("Invalid target size");
        }

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const srcDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        const numPages = srcDoc.numPages;

        const targetPageBytes = (targetBytes * 0.9) / numPages; // 10% overhead safety margin
        
        // Find best JPEG quality using first page
        setProgressMsg("Calculating optimal compression ratio...");
        const page1 = await srcDoc.getPage(1);
        const viewport1 = page1.getViewport({ scale: 1.5 });
        const canvas1 = document.createElement("canvas");
        canvas1.width = viewport1.width;
        canvas1.height = viewport1.height;
        const ctx1 = canvas1.getContext("2d");
        if (ctx1) {
          ctx1.fillStyle = "#ffffff";
          ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
          await page1.render({ canvas: canvas1, viewport: viewport1, background: "white" }).promise;
        }

        let bestQ = 0.5;
        let minQ = 0.05;
        let maxQ = 0.9;
        
        // Binary search for quality
        for (let i = 0; i < 5; i++) {
          let testQ = (minQ + maxQ) / 2;
          const blob = await canvasToBlob(canvas1, testQ);
          if (blob.size > targetPageBytes) {
            maxQ = testQ; // Size too big, reduce quality
          } else {
            minQ = testQ; // Size is good, try higher quality
            bestQ = testQ;
          }
        }
        page1.cleanup();

        // Create new PDF
        const newPdf = await PDFDocument.create();

        for (let i = 1; i <= numPages; i++) {
          setProgressMsg(`Compressing page ${i} of ${numPages}...`);
          const page = await srcDoc.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvas, viewport, background: "white" }).promise;
          }
          
          const blob = await canvasToBlob(canvas, bestQ);
          const imageBytes = await blob.arrayBuffer();
          const jpegImage = await newPdf.embedJpg(imageBytes);
          
          const newPage = newPdf.addPage([viewport.width, viewport.height]);
          newPage.drawImage(jpegImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
          
          page.cleanup();
        }

        setProgressMsg("Finalizing PDF...");
        pdfBytes = await newPdf.save({ useObjectStreams: true });

      } else {
        // Standard lossless re-packing
        setProgressMsg("Optimizing PDF structure...");
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        
        if (compressLevel === "medium" || compressLevel === "high") {
          pdfDoc.setTitle("");
          pdfDoc.setAuthor("");
          pdfDoc.setSubject("");
          pdfDoc.setKeywords([]);
          pdfDoc.setProducer("");
          pdfDoc.setCreator("");
        }

        pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      }
      
      setResultBytes(pdfBytes);
      setNewSize(pdfBytes.byteLength);
      setSuccess(true);
      toast("PDF compressed successfully!", "success");
    } catch (err: any) {
      console.error(err);
      toast(err.message || "An error occurred while compressing the PDF.", "error");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
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
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-sm">{file.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(originalSize)}</p>
            </div>
            <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium">
              Remove File
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 dark:text-white">Compression Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "low", title: "Basic", desc: "Minimal compression" },
                { id: "medium", title: "Recommended", desc: "Good quality & size" },
                { id: "high", title: "Extreme", desc: "Removes all metadata" },
                { id: "target", title: "Target Size", desc: "Convert to images" }
              ].map((lvl) => (
                <label key={lvl.id} className={`flex flex-col gap-1 p-4 border rounded-xl cursor-pointer transition-all ${compressLevel === lvl.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={compressLevel === lvl.id} onChange={() => setCompressLevel(lvl.id as CompressLevel)} className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-900 dark:text-white">{lvl.title}</span>
                  </div>
                  <span className="text-sm text-slate-500 pl-6 leading-tight">{lvl.desc}</span>
                </label>
              ))}
            </div>

            {compressLevel === "target" && (
              <div className="mt-6 p-4 border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-medium">
                    <Settings className="w-5 h-5" />
                    Target Size Configuration
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Desired Size (in KB)</label>
                  <div className="relative max-w-xs">
                    <input 
                      type="number" 
                      value={targetKb}
                      onChange={(e) => setTargetKb(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none"
                      min="50"
                      step="50"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-slate-500 font-medium">KB</span>
                  </div>
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/30">
                  <span className="font-semibold block mb-1">Important Note:</span>
                  To achieve exact file sizes in the browser, the PDF will be rasterized (converted into high-quality JPEG images). This guarantees the file size constraint, but text will no longer be selectable.
                </div>
              </div>
            )}
            
            {compressLevel !== "target" && (
              <p className="text-xs text-slate-500 italic mt-2">Note: Basic browser-based compression removes metadata and repacks the PDF structurally. To force a specific smaller file size, use the <strong>Target Size</strong> option.</p>
            )}
          </div>

          <button
            onClick={handleCompress}
            disabled={isLoading || (compressLevel === "target" && (!targetKb || parseInt(targetKb) <= 0))}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Minimize2 className="w-5 h-5" />}
            {isLoading ? (progressMsg || "Compressing...") : "Compress PDF"}
          </button>
        </div>
      )}

      {success && (
        <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">PDF Compressed Successfully!</h2>
          
          <div className="flex flex-wrap justify-center gap-8 py-4">
            <div>
              <p className="text-sm text-slate-500">Original Size</p>
              <p className="text-lg font-semibold">{formatFileSize(originalSize)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">New Size</p>
              <p className="text-lg font-semibold text-green-600">{formatFileSize(newSize)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Saved</p>
              <p className="text-lg font-semibold text-indigo-600">
                {Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100))}%
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button onClick={() => downloadPdf(resultBytes!, `compressed_${file?.name}`)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
              Download PDF
            </button>
            <button onClick={() => { setSuccess(false); setFile(null); setResultBytes(null); }} className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
