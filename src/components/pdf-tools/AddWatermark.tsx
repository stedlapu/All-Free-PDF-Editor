"use client";

import React, { useState, useEffect, useRef } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import type * as pdfjsLibType from "pdfjs-dist";
import { Download, Loader2, File as FileIcon } from "lucide-react";
import { validatePdfFile, formatFileSize, downloadPdf } from "@/lib/pdf-utils";
import { DropZone } from "@/components/ui/DropZone";
import { useToast } from "@/components/ui/Toaster";


type Position = "top-left" | "top-center" | "top-right" | "center" | "bottom-left" | "bottom-center" | "bottom-right";

export default function AddWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(-45);
  const [color, setColor] = useState("#6366f1");
  const [position, setPosition] = useState<Position>("center");

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
      setTotalPages(pdfDoc.numPages);
      setFile(selected);

      // Generate preview for page 1
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        await page.render({ canvas, viewport }).promise;
        setPreviewDataUrl(canvas.toDataURL("image/jpeg", 0.8));
      }
      page.cleanup();
      pdfDoc.cleanup();
    } catch (err) {
      toast("Failed to read PDF file.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1]!, 16) / 255,
      g: parseInt(result[2]!, 16) / 255,
      b: parseInt(result[3]!, 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const handleApply = async () => {
    if (!file) return;
    setIsSaving(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const rgbColor = hexToRgb(color);
      const safeText = text.replace(/<[^>]*>?/gm, "").substring(0, 100);

      pages.forEach(page => {
        const { width, height } = page.getSize();
        let x = width / 2;
        let y = height / 2;

        const textWidth = (safeText.length * fontSize) / 2; // rough approx

        if (position.includes("left")) x = 50;
        if (position.includes("right")) x = width - textWidth - 50;
        if (position.includes("top")) y = height - fontSize - 50;
        if (position.includes("bottom")) y = 50 + fontSize;
        if (position === "center") {
          x = (width - textWidth) / 2 + 50;
          y = height / 2 - 25;
        }

        page.drawText(safeText, {
          x,
          y,
          size: fontSize,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          opacity,
          rotate: degrees(rotation)
        });
      });

      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, `watermarked_${file.name}`);
      toast("Watermark applied successfully!", "success");
    } catch (err) {
      toast("An error occurred while applying the watermark.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file && (
        <DropZone onFilesSelected={handleFilesSelected} multiple={false} label="Drop a PDF file here or click to upload" />
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <FileIcon className="w-5 h-5 text-indigo-500" />
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{file.name}</span>
              </div>
              <button onClick={() => { setFile(null); setPreviewDataUrl(null); }} className="text-sm text-red-500 hover:text-red-600">Remove</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Watermark Text</label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={100} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Font Size: {fontSize}px</label>
                  <input type="range" min="12" max="120" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                  <input type="range" min="5" max="100" value={opacity * 100} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rotation: {rotation}°</label>
                  <input type="range" min="-180" max="180" value={rotation} onChange={e => setRotation(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Color</label>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {["top-left", "top-center", "top-right", "center", "bottom-left", "bottom-center", "bottom-right"].map(pos => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos as Position)}
                      className={`p-2 text-xs border rounded transition-colors ${position === pos ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                      {pos.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={isSaving || !text}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors mt-6"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isSaving ? "Applying..." : "Apply & Download"}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center relative overflow-hidden min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Generating preview...</p>
              </div>
            ) : previewDataUrl ? (
              <div className="relative w-full max-w-sm bg-white shadow-lg" style={{ aspectRatio: '0.707' }}>
                <img src={previewDataUrl} alt="Preview" className="w-full h-full object-contain" />
                {/* CSS simulated watermark preview */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                  <div 
                    style={{
                      position: 'absolute',
                      color,
                      opacity,
                      fontSize: `${fontSize / 3}px`,
                      transform: `rotate(${rotation}deg)`,
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      ...getPositionStyles(position)
                    }}
                  >
                    {text}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function getPositionStyles(pos: Position) {
  if (pos === "top-left") return { top: '10%', left: '10%', transformOrigin: 'top left' };
  if (pos === "top-center") return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
  if (pos === "top-right") return { top: '10%', right: '10%', transformOrigin: 'top right' };
  if (pos === "bottom-left") return { bottom: '10%', left: '10%', transformOrigin: 'bottom left' };
  if (pos === "bottom-center") return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
  if (pos === "bottom-right") return { bottom: '10%', right: '10%', transformOrigin: 'bottom right' };
  return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transformOrigin: 'center' };
}


