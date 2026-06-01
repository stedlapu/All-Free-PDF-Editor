"use client";

import {
  useState,
  useCallback,
  useRef,
  DragEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { validatePdfFile, formatFileSize } from "@/lib/pdf-utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
  label?: string;
}

// ─── Icon components ──────────────────────────────────────────────────────────

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function PdfFileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-red-500 flex-shrink-0"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <text x="6" y="20" fontSize="5" fill="#ef4444" stroke="none" fontWeight="700">PDF</text>
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

export function DropZone({
  onFilesSelected,
  multiple = false,
  className,
  label,
}: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (rawFiles: File[]) => {
      setError(null);

      const filesToProcess = multiple ? rawFiles : rawFiles.slice(0, 1);
      const validFiles: File[] = [];
      const errors: string[] = [];

      await Promise.all(
        filesToProcess.map(async (file) => {
          const result = await validatePdfFile(file);
          if (result.valid) {
            validFiles.push(file);
          } else {
            errors.push(`"${file.name}": ${result.error ?? "Invalid file."}`);
          }
        })
      );

      if (errors.length > 0) {
        setError(errors.join(" | "));
      }

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        onFilesSelected(validFiles);
      }
    },
    [multiple, onFilesSelected]
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length === 0) return;
      await processFiles(droppedFiles);
    },
    [processFiles]
  );

  // ── Input change ───────────────────────────────────────────────────────────

  const handleInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;
      await processFiles(files);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    },
    [processFiles]
  );

  // ── Keyboard activation ────────────────────────────────────────────────────

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  const openBrowser = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        onFilesSelected(updated);
        return updated;
      });
      setError(null);
    },
    [onFilesSelected]
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`w-full ${className ?? ""}`}>
      {/* Drop area */}
      <div
        role="button"
        tabIndex={0}
        aria-label={
          label ??
          `Drop zone: ${multiple ? "drag and drop PDF files" : "drag and drop a PDF file"} or press Enter to browse`
        }
        aria-describedby="dropzone-instructions dropzone-privacy"
        onClick={openBrowser}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-4 px-6 py-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          dragOver
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]"
            : error
            ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10"
            : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10"
        }`}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple={multiple}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Upload icon */}
        <UploadIcon
          className={`w-12 h-12 transition-colors ${
            dragOver
              ? "text-indigo-500"
              : "text-slate-400 dark:text-slate-500"
          }`}
        />

        {/* Instructions */}
        <div id="dropzone-instructions" className="text-center">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            {dragOver
              ? "Release to upload"
              : label ?? "Drag & drop PDF file(s) here"}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            or{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-medium underline underline-offset-2">
              click to browse
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {multiple ? "PDF files" : "PDF file"} only · max 100 MB per file
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <ul
          className="mt-3 space-y-2"
          role="list"
          aria-label="Selected PDF files"
        >
          {selectedFiles.map((file, index) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <PdfFileIcon />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                aria-label={`Remove ${file.name}`}
                className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <XIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Privacy notice */}
      <p
        id="dropzone-privacy"
        className="mt-3 flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400"
      >
        <ShieldIcon />
        Files are processed locally. Nothing is uploaded.
      </p>
    </div>
  );
}
