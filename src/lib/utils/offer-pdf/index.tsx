import { pdf, DocumentProps } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import React from 'react';
import { OfferDocument, OfferDocumentProps } from './OfferDocument';

export interface PDFLineItem {
  description: string;
  detailedDescription?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PDFOfferData {
  offerNumber: string;
  date: string;
  customerName: string;
  customerNameArabic?: string;
  customerLocation: string;
  customerTrn?: string;
  projectTitle?: string;
  projectTitleArabic?: string;
  lineItems: PDFLineItem[];
  subtotal: number;
  discountPercent?: number;
  discountAmount?: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  terms?: string;
  includeTermsPages?: boolean;
}

/**
 * Generate and download an offer PDF
 */
export async function generateOfferPDF(data: PDFOfferData): Promise<void> {
  const doc = React.createElement(OfferDocument, {
    ...data,
    includeTermsPages: data.includeTermsPages ?? true,
  } as OfferDocumentProps) as unknown as ReactElement<DocumentProps>;

  const blob = await pdf(doc).toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Generate filename
  const sanitizedName = data.customerName.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `Quotation_${data.offerNumber}_${sanitizedName}.pdf`;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF blob without downloading (for preview)
 */
export async function generateOfferPDFBlob(data: PDFOfferData): Promise<Blob> {
  const doc = React.createElement(OfferDocument, {
    ...data,
    includeTermsPages: data.includeTermsPages ?? true,
  } as OfferDocumentProps) as unknown as ReactElement<DocumentProps>;

  return await pdf(doc).toBlob();
}

// Re-export types
export type { OfferDocumentProps } from './OfferDocument';
