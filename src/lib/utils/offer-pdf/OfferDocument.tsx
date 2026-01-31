import React from 'react';
import { Document } from '@react-pdf/renderer';
import { QuotationPage } from './QuotationPage';
import { TermsPage1, TermsPage2, TermsPage3 } from './TermsPage';

interface PDFLineItem {
  description: string;
  detailedDescription?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OfferDocumentProps {
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

export const OfferDocument = ({
  offerNumber,
  date,
  customerName,
  customerNameArabic,
  customerLocation,
  customerTrn,
  projectTitle,
  projectTitleArabic,
  lineItems,
  subtotal,
  discountPercent,
  discountAmount,
  vatRate,
  vatAmount,
  total,
  includeTermsPages = true,
}: OfferDocumentProps) => (
  <Document
    title={`Quotation ${offerNumber}`}
    author="LOR Computer Designing L.L.C. SP."
    subject={`Quotation for ${customerName}`}
    creator="LOR Management System"
  >
    {/* Page 1: Quotation */}
    <QuotationPage
      offerNumber={offerNumber}
      date={date}
      customerName={customerName}
      customerNameArabic={customerNameArabic}
      customerLocation={customerLocation}
      customerTrn={customerTrn}
      projectTitle={projectTitle}
      projectTitleArabic={projectTitleArabic}
      lineItems={lineItems}
      subtotal={subtotal}
      discountPercent={discountPercent}
      discountAmount={discountAmount}
      vatRate={vatRate}
      vatAmount={vatAmount}
      total={total}
    />

    {/* Pages 2-4: Terms & Agreements (optional) */}
    {includeTermsPages && (
      <>
        <TermsPage1 />
        <TermsPage2 />
        <TermsPage3 />
      </>
    )}
  </Document>
);
