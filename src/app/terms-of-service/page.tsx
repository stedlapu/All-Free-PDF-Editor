import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Terms of Service - PDFMaster',
  description: 'Terms of Service for using PDFMaster.'
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-slate dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using PDFMaster, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h2>2. Description of Service</h2>
      <p>PDFMaster provides a set of free, browser-based tools for manipulating PDF files. Because the processing is done in your browser, we do not guarantee the performance or outcome of any operation, which may vary depending on your device and browser.</p>
      
      <h2>3. Acceptable Use</h2>
      <p>You agree not to use the service for any illegal purposes or to process documents that contain malicious code. You are solely responsible for the documents you process using our tools.</p>
      
      <h2>4. Intellectual Property</h2>
      <p>The service and its original content, features, and functionality are owned by PDFMaster and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
      
      <h2>5. Disclaimer of Warranties</h2>
      <p>The service is provided on an "as is" and "as available" basis. PDFMaster makes no warranties, expressed or implied, and hereby disclaims all warranties.</p>
      
      <h2>6. Limitation of Liability</h2>
      <p>In no event shall PDFMaster be liable for any damages arising out of the use or inability to use the tools provided.</p>
    </div>
  );
}
