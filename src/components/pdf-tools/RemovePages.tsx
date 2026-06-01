'use client';

import React, { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import type * as pdfjsLibType from 'pdfjs-dist';
import { downloadPdf } from '@/lib/pdf-utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageItem {
  index: number;
  thumbnailDataUrl: string | null;
  selected: boolean;
}

// ─── Thumbnail generation ─────────────────────────────────────────────────────

async function generateThumbnails(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const thumbnails: string[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      thumbnails.push('');
      continue;
    }
    await page.render({ canvas, viewport }).promise;
    thumbnails.push(canvas.toDataURL('image/jpeg', 0.8));
    page.cleanup();
  }

  pdfDoc.cleanup();
  return thumbnails;
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

function DropZone({ onFile, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) return;
      onFile(f);
    },
    [onFile],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = '';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Drop zone: click or drag a PDF file here to upload"
      aria-disabled={disabled}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) inputRef.current?.click();
      }}
      className={[
        'flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed',
        'px-8 py-16 cursor-pointer select-none transition-all duration-200',
        isDragging
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
        <svg
          aria-hidden="true"
          className="h-8 w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
          {isDragging ? 'Release to upload' : 'Drop your PDF here'}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          or{' '}
          <span className="font-medium text-indigo-500 hover:underline">browse files</span>
        </p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">PDF files only</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={onInputChange}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ThumbnailSkeleton({ count }: { count: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="Loading page thumbnails"
      aria-busy="true"
    >
      {Array.from({ length: Math.max(count, 4) }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-[#1e293b] p-3 shadow-sm"
        >
          <div
            className="w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
            style={{ aspectRatio: '0.707' }}
          />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

// ─── Page Thumbnail Card ──────────────────────────────────────────────────────

interface PageCardProps {
  page: PageItem;
  onToggle: () => void;
}

function PageCard({ page, onToggle }: PageCardProps) {
  return (
    <div
      className={[
        'group relative flex flex-col items-center gap-2 rounded-xl p-3 shadow-sm',
        'ring-2 transition-all duration-200 cursor-pointer select-none',
        page.selected
          ? 'bg-red-50 dark:bg-red-950/30 ring-red-400 dark:ring-red-600'
          : 'bg-white dark:bg-[#1e293b] ring-slate-200/50 dark:ring-slate-700/50 hover:ring-indigo-300 dark:hover:ring-indigo-700',
      ].join(' ')}
      role="checkbox"
      aria-checked={page.selected}
      aria-label={`Page ${page.index + 1}${page.selected ? ', selected for removal' : ', not selected'}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Checkbox overlay */}
      <div
        aria-hidden="true"
        className={[
          'absolute top-2 left-2 z-10 flex h-5 w-5 items-center justify-center rounded',
          'border-2 transition-all duration-150',
          page.selected
            ? 'border-red-500 bg-red-500'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-indigo-400',
        ].join(' ')}
      >
        {page.selected && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </div>

      {/* Thumbnail */}
      <div
        className={[
          'relative w-full overflow-hidden rounded-lg',
          page.selected ? 'opacity-60' : 'opacity-100',
          'bg-slate-100 dark:bg-slate-800 transition-opacity',
        ].join(' ')}
        style={{ aspectRatio: '0.707' }}
      >
        {page.thumbnailDataUrl ? (
          <img
            src={page.thumbnailDataUrl}
            alt={`Page ${page.index + 1} preview`}
            className="h-full w-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
        )}

        {/* "Remove" overlay badge */}
        {page.selected && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-500/20">
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Remove
            </span>
          </div>
        )}
      </div>

      {/* Page number */}
      <p className={[
        'text-xs font-medium transition-colors',
        page.selected
          ? 'text-red-500 dark:text-red-400'
          : 'text-slate-500 dark:text-slate-400',
      ].join(' ')}>
        Page {page.index + 1}
      </p>
    </div>
  );
}

// ─── Success Banner ───────────────────────────────────────────────────────────

interface SuccessBannerProps {
  removedCount: number;
  remainingCount: number;
  onDownload: () => void;
  onReset: () => void;
  isDownloading: boolean;
}

function SuccessBanner({
  removedCount,
  remainingCount,
  onDownload,
  onReset,
  isDownloading,
}: SuccessBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-6 py-10 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
        <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pages Removed!</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Removed <strong>{removedCount}</strong> {removedCount === 1 ? 'page' : 'pages'}.{' '}
          <strong>{remainingCount}</strong> {remainingCount === 1 ? 'page' : 'pages'} remaining.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          aria-label="Download PDF with pages removed"
          aria-busy={isDownloading}
          className={[
            'flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200',
            'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
            isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5',
          ].join(' ')}
        >
          {isDownloading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Process another PDF"
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Process Another PDF
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RemovePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [removedCount, setRemovedCount] = useState(0);

  const selectedCount = pages.filter((p) => p.selected).length;
  const totalCount = pages.length;
  const canRemove = selectedCount > 0 && selectedCount < totalCount;

  // ── File load ──────────────────────────────────────────────────────────────

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    setFile(f);
    setPages([]);
    setResultBytes(null);
    setRemovedCount(0);
    setIsLoading(true);

    try {
      const thumbnails = await generateThumbnails(f);
      setPages(
        thumbnails.map((dataUrl, i) => ({
          index: i,
          thumbnailDataUrl: dataUrl || null,
          selected: false,
        })),
      );
    } catch (err) {
      console.error('Failed to load PDF:', err);
      setError('Failed to load the PDF. The file may be corrupted or password-protected.');
      setFile(null);
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Toggle selection ───────────────────────────────────────────────────────

  const togglePage = useCallback((index: number) => {
    setPages((prev) =>
      prev.map((p) => (p.index === index ? { ...p, selected: !p.selected } : p)),
    );
  }, []);

  const selectAll = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: true })));
  }, []);

  const deselectAll = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: false })));
  }, []);

  // ── Remove selected ────────────────────────────────────────────────────────

  const handleRemove = useCallback(async () => {
    if (!file || !canRemove) return;
    setError(null);
    setIsSaving(true);

    try {
      const selectedIndices = pages
        .filter((p) => p.selected)
        .map((p) => p.index)
        .sort((a, b) => b - a); // descending — remove highest index first

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      for (const idx of selectedIndices) {
        pdfDoc.removePage(idx);
      }

      const pdfBytes = await pdfDoc.save();
      setResultBytes(pdfBytes);
      setRemovedCount(selectedIndices.length);
    } catch (err) {
      console.error('Failed to remove pages:', err);
      setError('Failed to process the PDF. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [file, pages, canRemove]);

  // ── Download ───────────────────────────────────────────────────────────────

  const handleDownload = useCallback(() => {
    if (!resultBytes || !file) return;
    const safeName = file.name.replace(/\.pdf$/i, '');
    downloadPdf(resultBytes, `${safeName}_pages_removed.pdf`);
  }, [resultBytes, file]);

  // ── Reset ──────────────────────────────────────────────────────────────────

  const handleReset = useCallback(() => {
    setFile(null);
    setPages([]);
    setError(null);
    setResultBytes(null);
    setRemovedCount(0);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      className="mx-auto w-full max-w-5xl px-4 py-10"
      aria-labelledby="remove-pages-heading"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1
          id="remove-pages-heading"
          className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl"
        >
          Remove PDF Pages
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Select pages to delete, then download the updated PDF. No uploads — runs entirely in your browser.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Success state */}
      {resultBytes && (
        <SuccessBanner
          removedCount={removedCount}
          remainingCount={totalCount - removedCount}
          onDownload={handleDownload}
          onReset={handleReset}
          isDownloading={isSaving}
        />
      )}

      {/* Drop zone */}
      {!file && !isLoading && !resultBytes && (
        <DropZone onFile={handleFile} />
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 animate-pulse">
            Generating thumbnails…
          </p>
          <ThumbnailSkeleton count={4} />
        </div>
      )}

      {/* Page selection grid */}
      {!isLoading && file && pages.length > 0 && !resultBytes && (
        <div className="space-y-6">
          {/* File info + reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white dark:bg-[#1e293b] px-4 py-3 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50">
            <div className="flex items-center gap-3 min-w-0">
              <svg className="h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {file.name}
              </span>
              <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                {totalCount} {totalCount === 1 ? 'page' : 'pages'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Remove file and start over"
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              × Remove file
            </button>
          </div>

          {/* Selection controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Selection status */}
            <p
              aria-live="polite"
              aria-atomic="true"
              className={[
                'text-sm font-medium transition-colors',
                selectedCount > 0
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-400',
              ].join(' ')}
            >
              {selectedCount > 0
                ? `${selectedCount} of ${totalCount} ${totalCount === 1 ? 'page' : 'pages'} selected for removal`
                : 'Click pages to select them for removal'}
            </p>

            {/* Select / Deselect All */}
            <div className="flex gap-2" role="group" aria-label="Bulk selection controls">
              <button
                type="button"
                onClick={selectAll}
                aria-label="Select all pages"
                className="rounded-lg bg-white dark:bg-[#1e293b] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAll}
                disabled={selectedCount === 0}
                aria-label="Deselect all pages"
                className="rounded-lg bg-white dark:bg-[#1e293b] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Safety warning when all selected */}
          {selectedCount === totalCount && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
            >
              <svg className="h-5 w-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>Cannot remove all pages — a PDF must have at least one page.</span>
            </div>
          )}

          {/* Thumbnail grid */}
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            role="group"
            aria-label="PDF pages — click to select for removal"
            aria-multiselectable="true"
          >
            {pages.map((page) => (
              <PageCard
                key={page.index}
                page={page}
                onToggle={() => togglePage(page.index)}
              />
            ))}
          </div>

          {/* Remove selected button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleRemove}
              disabled={!canRemove || isSaving}
              aria-label={
                !canRemove
                  ? selectedCount === 0
                    ? 'No pages selected for removal'
                    : 'Cannot remove all pages'
                  : `Remove ${selectedCount} selected ${selectedCount === 1 ? 'page' : 'pages'}`
              }
              aria-busy={isSaving}
              className={[
                'flex min-w-[220px] items-center justify-center gap-2 rounded-xl px-8 py-3.5',
                'text-sm font-semibold text-white shadow-lg transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
                canRemove && !isSaving
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5 hover:shadow-red-500/30'
                  : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60',
              ].join(' ')}
            >
              {isSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  {selectedCount > 0
                    ? `Remove ${selectedCount} ${selectedCount === 1 ? 'Page' : 'Pages'}`
                    : 'Remove Selected Pages'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


