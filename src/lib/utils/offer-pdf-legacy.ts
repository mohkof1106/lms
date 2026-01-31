import jsPDF from 'jspdf';
import { mockCompanyInfo, mockCompanySettings, defaultTerms } from '@/lib/mock-data/settings';

interface PDFLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PDFOfferData {
  offerNumber: string;
  date: string;
  customerName: string;
  customerLocation: string;
  customerTrn?: string;
  projectTitle?: string;
  lineItems: PDFLineItem[];
  subtotal: number;
  discountPercent?: number;
  discountAmount?: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  terms?: string;
}

// Brand colors
const COLORS = {
  primary: '#00BCD4', // cyan
  red: '#EE3E55',
  gray: '#5E5F5F',
  lightGray: '#909294',
  tableHeader: '#00BCD4',
};

export function generateOfferPDF(data: PDFOfferData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Helper to format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' AED';
  };

  // Helper to format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // ===== HEADER =====
  // LOR Logo (text version since SVG is complex)
  doc.setFontSize(28);
  doc.setTextColor(COLORS.red);
  doc.setFont('helvetica', 'bold');
  doc.text('LOR', margin, y + 10);

  doc.setFontSize(7);
  doc.setTextColor(COLORS.gray);
  doc.setFont('helvetica', 'normal');
  doc.text('Leaders Of Resolution', margin, y + 14);

  // Services on right
  doc.setFontSize(9);
  doc.setTextColor(COLORS.gray);
  const services = mockCompanyInfo.services.join(' | ');
  doc.text(services, pageWidth - margin, y + 10, { align: 'right' });

  y += 25;

  // ===== QUOTATION TITLE =====
  doc.setFontSize(22);
  doc.setTextColor(COLORS.red);
  doc.setFont('helvetica', 'bold');
  const titleText = 'Quotation';
  const titleWidth = doc.getTextWidth(titleText);
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(titleText, titleX, y);

  // Underline
  doc.setDrawColor(COLORS.red);
  doc.setLineWidth(0.5);
  doc.line(titleX, y + 1, titleX + titleWidth, y + 1);

  y += 15;

  // ===== BILL TO & QUOTATION INFO =====
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', margin, y);
  doc.line(margin, y + 1, margin + 18, y + 1);

  // Quotation number on right
  doc.text('Quotation#: ' + data.offerNumber, pageWidth - margin - 60, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Client: ' + data.customerName, margin, y);
  doc.text('Date: ' + formatDate(data.date), pageWidth - margin - 60, y);

  y += 5;
  doc.text('City: ' + data.customerLocation, margin, y);

  if (data.customerTrn) {
    y += 5;
    doc.text('T.R.N.: -' + data.customerTrn + '-', margin, y);
    doc.line(margin + 10, y + 1, margin + 45, y + 1);
  }

  if (data.projectTitle) {
    y += 5;
    doc.text('Project: ' + data.projectTitle, margin, y);
    doc.line(margin + 13, y + 1, margin + 13 + doc.getTextWidth(data.projectTitle), y + 1);
  }

  y += 12;

  // ===== LINE ITEMS TABLE =====
  const tableStartY = y;
  const colWidths = [55, 40, 30, 20, 35]; // Product, Description, Price, Qty, Amount
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const tableX = margin;

  // Table header
  doc.setFillColor(COLORS.tableHeader);
  doc.rect(tableX, y, tableWidth, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  let colX = tableX + 2;
  const headers = ['Product', 'Description', 'Price', 'Qty', 'Amount'];
  headers.forEach((header, i) => {
    doc.text(header, colX, y + 5.5);
    colX += colWidths[i];
  });

  y += 8;

  // Table rows
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  data.lineItems.forEach((item) => {
    // Row background
    doc.setDrawColor(200, 200, 200);
    doc.rect(tableX, y, tableWidth, 8);

    colX = tableX + 2;

    // Product name
    const productName = item.description.length > 30
      ? item.description.substring(0, 30) + '...'
      : item.description;
    doc.text(productName, colX, y + 5.5);
    colX += colWidths[0];

    // Description (empty for now, can be expanded)
    colX += colWidths[1];

    // Price
    doc.text(formatCurrency(item.unitPrice), colX, y + 5.5);
    colX += colWidths[2];

    // Qty
    doc.text(item.quantity.toString(), colX, y + 5.5);
    colX += colWidths[3];

    // Amount
    doc.text(formatCurrency(item.total), colX, y + 5.5);

    y += 8;
  });

  // Table bottom border
  doc.line(tableX, y, tableX + tableWidth, y);

  y += 15;

  // ===== OTHER COMMENTS & TOTALS =====
  const commentsX = margin;
  const totalsX = pageWidth - margin - 60;

  // OTHER COMMENTS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('OTHER COMMENTS:', commentsX, y);
  doc.line(commentsX, y + 1, commentsX + 35, y + 1);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const comments = [
    '• 100% Full Payment At Item Delivery',
    '• Total payment due in 30 days',
    '• OUR T.R.N.: ' + mockCompanySettings.trn,
    '• Cheque made payable to ' + mockCompanyInfo.legalName,
    '• Account No.: ' + mockCompanyInfo.accountNo,
    '• Bank Name: ' + mockCompanyInfo.bankName,
    '• IBAN: ' + mockCompanyInfo.iban + ' / Swift: ' + mockCompanyInfo.swift,
  ];

  const commentsStartY = y;
  comments.forEach((comment, i) => {
    doc.text(comment, commentsX, y + (i * 4.5));
  });

  // TOTALS on right
  y = commentsStartY;
  doc.setFontSize(9);

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', totalsX, y);
  doc.text(formatCurrency(data.subtotal), pageWidth - margin, y, { align: 'right' });
  y += 5;

  // Discount (if any)
  if (data.discountPercent && data.discountPercent > 0 && data.discountAmount) {
    doc.text('Discount (' + data.discountPercent + '%)', totalsX, y);
    doc.text('-' + formatCurrency(data.discountAmount), pageWidth - margin, y, { align: 'right' });
    y += 5;

    // Subtotal after discount
    const subtotalAfterDiscount = data.subtotal - data.discountAmount;
    doc.text('After Discount', totalsX, y);
    doc.text(formatCurrency(subtotalAfterDiscount), pageWidth - margin, y, { align: 'right' });
    y += 5;
  }

  // VAT
  doc.text('VAT ' + data.vatRate + '%', totalsX, y);
  doc.text(formatCurrency(data.vatAmount), pageWidth - margin, y, { align: 'right' });
  y += 5;

  // Total box
  doc.setFillColor(COLORS.red);
  doc.rect(totalsX - 2, y - 1, 25, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Total', totalsX, y + 4);
  doc.setTextColor(COLORS.red);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.total), pageWidth - margin, y + 4, { align: 'right' });
  y += 10;

  // Balance Due
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Balance Due', totalsX, y);
  doc.text(formatCurrency(data.total), pageWidth - margin, y, { align: 'right' });
  doc.line(totalsX, y + 2, pageWidth - margin, y + 2);

  // ===== SIGNATURES =====
  y = Math.max(y + 25, commentsStartY + 45);

  doc.setFontSize(9);
  doc.text('LOR Signature', margin + 20, y);
  doc.text('Customer Signature', pageWidth - margin - 50, y);

  y += 15;
  // Signature lines
  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, y, margin + 60, y);
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);
  doc.setLineDashPattern([], 0);

  // ===== FOOTER =====
  y = pageHeight - 35;

  doc.setFontSize(12);
  doc.setTextColor(COLORS.red);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank You For Your Business!', pageWidth / 2, y, { align: 'center' });

  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(COLORS.gray);
  doc.setFont('helvetica', 'normal');
  const contactLine = 'T. ' + mockCompanyInfo.phone + '   M. ' + mockCompanyInfo.mobile + '   E. ' + mockCompanyInfo.email;
  doc.text(contactLine, pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.text(mockCompanySettings.address, pageWidth / 2, y, { align: 'center' });

  // Red footer bar
  y += 8;
  doc.setFillColor(COLORS.red);
  doc.rect(0, y, pageWidth, 10, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(mockCompanyInfo.website, pageWidth / 2, y + 6.5, { align: 'center' });

  // Save the PDF
  const fileName = `Quotation_${data.offerNumber}_${data.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
}
