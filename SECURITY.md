# Security & Privacy Architecture

PDFMaster is built from the ground up with a privacy-first, client-side only architecture.

## Privacy Architecture
- **Zero Uploads**: All PDF processing operations (merging, splitting, watermarking, editing) are performed locally within the user's web browser using WebAssembly technology.
- **No Data Retention**: Because files are never uploaded to any server, we have zero retention of user files or data.
- **Client-Side Validation**: All files are validated locally before processing to ensure they are valid PDF structures.

## Threat Model & Mitigations
- **Cross-Site Scripting (XSS)**: Mitigated by utilizing React's built-in escaping, a strict Content Security Policy (CSP), and sanitizing all user text inputs (e.g., watermark text).
- **Cross-Site Request Forgery (CSRF)**: Not applicable as there is no backend server handling sensitive user state or files.
- **Malicious PDFs**: Mitigated by using established, secure parsers (`pdf-lib`, `pdfjs-dist`). Since rendering and parsing happens entirely within the sandboxed browser environment, the risk of arbitrary code execution is minimized to the browser's own security boundaries.

## Security Headers
We employ strict security headers in `next.config.ts`:
- `Content-Security-Policy`: Restricts scripts and styles.
- `X-Frame-Options: DENY`: Prevents clickjacking.
- `X-Content-Type-Options: nosniff`: Prevents MIME type sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin`.

## Dependency Security Policy
- Dependencies are regularly audited using `npm audit`.
- We pin major versions of critical parsing libraries (`pdf-lib`, `pdfjs-dist`).

## Responsible Disclosure
If you find a security vulnerability, please report it to `security@pdfmaster.app`. Do not disclose the vulnerability publicly until a fix has been released.
