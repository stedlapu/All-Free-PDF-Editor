import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Privacy Policy - PDFMaster',
  description: 'Our privacy policy explains how we protect your data. All PDF processing happens locally in your browser.'
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-slate dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Core Privacy Principle: Zero Uploads</h2>
      <p>PDFMaster is built on a "Privacy First" architecture. This means that <strong>your PDF files are never uploaded to our servers</strong>. All processing happens entirely within your web browser on your own device using WebAssembly technology.</p>
      
      <h2>2. Data Collection</h2>
      <p>Because processing happens locally, we do not collect, store, or transmit any data from your PDF documents.</p>
      
      <h2>3. Cookies and Tracking</h2>
      <p>We use essential cookies to remember your preferences (like dark mode and cookie consent). We also use Google AdSense to serve advertisements, which may use cookies to personalize ads based on your browsing history, provided you have given consent.</p>
      
      <h2>4. Third-Party Services</h2>
      <p>We use third-party services like Google AdSense to display ads. These services may collect non-personally identifiable information as outlined in their respective privacy policies.</p>
      
      <h2>5. Changes to This Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      
      <h2>6. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us via our Contact page.</p>
    </div>
  );
}
