/**
 * PDF Utility Functions
 * All processing is client-side. No file data is ever uploaded.
 */

const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]; // %PDF
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Validates that a File is a genuine PDF by checking extension,
 * MIME type, and the %PDF magic bytes in the first 4 bytes.
 */
export async function validatePdfFile(
  file: File
): Promise<{ valid: boolean; error?: string }> {
  try {
    // 1. Extension check
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf") {
      return { valid: false, error: "File must have a .pdf extension." };
    }

    // 2. MIME type check
    if (file.type && file.type !== "application/pdf") {
      return {
        valid: false,
        error: "File MIME type is not application/pdf.",
      };
    }

    // 3. Size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File exceeds the 100 MB limit (${formatFileSize(file.size)}).`,
      };
    }

    // 4. Magic bytes check (%PDF)
    const slice = file.slice(0, 4);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const hasMagic = PDF_MAGIC_BYTES.every((byte, i) => bytes[i] === byte);
    if (!hasMagic) {
      return {
        valid: false,
        error: "File does not appear to be a valid PDF (missing %PDF header).",
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Could not read the file. Please try again." };
  }
}

/**
 * Formats a byte count into a human-readable string.
 * e.g. 2500000 → "2.4 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exp);
  return `${value.toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
}

/**
 * Sanitizes user-supplied text to prevent XSS.
 * Strips HTML tags and limits to 500 characters.
 * Uses DOM textContent assignment — never innerHTML.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";

  // Strip HTML tags via regex (safe fallback for SSR / non-DOM environments)
  const stripped = input.replace(/<[^>]*>/g, "");

  // Trim to 500 characters
  return stripped.slice(0, 500);
}

/**
 * Triggers a browser download of a Uint8Array as a .pdf file.
 */
export function downloadPdf(bytes: Uint8Array, filename: string): void {
  const safeFilename = sanitizeText(filename) || "document.pdf";
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  downloadBlob(blob, safeFilename);
}

/**
 * Triggers a browser download of any Blob with the given filename.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const safeFilename = sanitizeText(filename) || "download";
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFilename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Release the object URL after a short delay to allow download to start
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
