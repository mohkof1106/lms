import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { COLORS, styles } from './styles';
import { Header, Footer, CornerDecoration, Table, Signatures } from './components';
import { mockCompanyInfo, mockCompanySettings } from '@/lib/mock-data/settings';

const pageStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 25,
    paddingBottom: 85,
    paddingHorizontal: 35,
    backgroundColor: COLORS.white,
    position: 'relative',
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 26,
    color: COLORS.coral,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  billToSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billToLeft: {
    flex: 1,
  },
  billToRight: {
    width: 160,
    alignItems: 'flex-end',
  },
  billToTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    color: COLORS.black,
    width: 50,
  },
  infoValue: {
    fontSize: 9,
    color: COLORS.black,
    flex: 1,
  },
  trnValue: {
    fontSize: 9,
    color: COLORS.black,
    textDecoration: 'underline',
  },
  projectValue: {
    fontSize: 9,
    color: COLORS.black,
    textDecoration: 'underline',
  },
  quotationBox: {
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
    flexDirection: 'row',
  },
  quotationLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: 5,
  },
  quotationValue: {
    fontSize: 9,
  },
  commentsAndTotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  commentsSection: {
    width: '52%',
  },
  commentsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 8,
  },
  commentLine: {
    fontSize: 8,
    marginBottom: 3,
    color: COLORS.black,
  },
  commentHighlight: {
    textDecoration: 'underline',
  },
  totalsSection: {
    width: '42%',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 2,
  },
  totalsLabel: {
    fontSize: 9,
    color: COLORS.black,
  },
  totalsValue: {
    fontSize: 9,
    color: COLORS.black,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  totalLabelBox: {
    backgroundColor: COLORS.coral,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  totalBoxLabel: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  totalBoxValue: {
    fontSize: 10,
    color: COLORS.coral,
    fontWeight: 'bold',
  },
  balanceDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
    paddingBottom: 4,
    marginTop: 4,
  },
});

interface PDFLineItem {
  description: string;
  detailedDescription?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuotationPageProps {
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
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' AED';
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const QuotationPage = ({
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
}: QuotationPageProps) => (
  <Page size="A4" style={pageStyles.page}>
    {/* Header */}
    <Header />

    {/* Title */}
    <View style={pageStyles.titleContainer}>
      <Text style={pageStyles.title}>Quotation</Text>
    </View>

    {/* Bill To & Quotation Info */}
    <View style={pageStyles.billToSection}>
      <View style={pageStyles.billToLeft}>
        <Text style={pageStyles.billToTitle}>BILL TO:</Text>
        <View style={pageStyles.infoRow}>
          <Text style={pageStyles.infoLabel}>Client:</Text>
          <Text style={pageStyles.infoValue}>
            {customerNameArabic ? `${customerNameArabic} - ${customerName}` : customerName}
          </Text>
        </View>
        <View style={pageStyles.infoRow}>
          <Text style={pageStyles.infoLabel}>City:</Text>
          <Text style={pageStyles.infoValue}>{customerLocation}</Text>
        </View>
        {customerTrn && (
          <View style={pageStyles.infoRow}>
            <Text style={pageStyles.infoLabel}>T.R.N.:</Text>
            <Text style={pageStyles.trnValue}>-{customerTrn}-</Text>
          </View>
        )}
        {projectTitle && (
          <View style={pageStyles.infoRow}>
            <Text style={pageStyles.infoLabel}>Project:</Text>
            <Text style={pageStyles.projectValue}>
              {projectTitleArabic || projectTitle}
            </Text>
          </View>
        )}
      </View>
      <View style={pageStyles.billToRight}>
        <View style={pageStyles.quotationBox}>
          <Text style={pageStyles.quotationLabel}>Quotation#:</Text>
          <Text style={pageStyles.quotationValue}>{offerNumber}</Text>
        </View>
        <View style={pageStyles.quotationBox}>
          <Text style={pageStyles.quotationLabel}>Date:</Text>
          <Text style={pageStyles.quotationValue}>{formatDate(date)}</Text>
        </View>
      </View>
    </View>

    {/* Line Items Table */}
    <Table lineItems={lineItems} formatCurrency={formatCurrency} />

    {/* Comments & Totals */}
    <View style={pageStyles.commentsAndTotals}>
      {/* OTHER COMMENTS */}
      <View style={pageStyles.commentsSection}>
        <Text style={pageStyles.commentsTitle}>OTHER COMMENTS:</Text>
        <Text style={pageStyles.commentLine}>• 100% Full Payment At Item Delivery</Text>
        <Text style={pageStyles.commentLine}>• Total payment due in 30 days</Text>
        <Text style={pageStyles.commentLine}>
          • OUR T.R.N.: <Text style={pageStyles.commentHighlight}>{mockCompanySettings.trn}</Text>
        </Text>
        <Text style={pageStyles.commentLine}>
          • Cheque made payable to <Text style={pageStyles.commentHighlight}>{mockCompanyInfo.legalName}</Text>
        </Text>
        <Text style={pageStyles.commentLine}>
          • Account No.: {mockCompanyInfo.accountNo}
        </Text>
        <Text style={pageStyles.commentLine}>• Bank Name: {mockCompanyInfo.bankName}</Text>
        <Text style={pageStyles.commentLine}>
          • IBAN: {mockCompanyInfo.iban} / Swift: {mockCompanyInfo.swift}
        </Text>
      </View>

      {/* TOTALS */}
      <View style={pageStyles.totalsSection}>
        <View style={pageStyles.totalsRow}>
          <Text style={pageStyles.totalsLabel}>Subtotal</Text>
          <Text style={pageStyles.totalsValue}>{formatCurrency(subtotal)}</Text>
        </View>

        {discountPercent && discountPercent > 0 && discountAmount && (
          <>
            <View style={pageStyles.totalsRow}>
              <Text style={pageStyles.totalsLabel}>Discount ({discountPercent}%)</Text>
              <Text style={pageStyles.totalsValue}>-{formatCurrency(discountAmount)}</Text>
            </View>
            <View style={pageStyles.totalsRow}>
              <Text style={pageStyles.totalsLabel}>After Discount</Text>
              <Text style={pageStyles.totalsValue}>{formatCurrency(subtotal - discountAmount)}</Text>
            </View>
          </>
        )}

        <View style={pageStyles.totalsRow}>
          <Text style={pageStyles.totalsLabel}>VAT {vatRate}%</Text>
          <Text style={pageStyles.totalsValue}>{formatCurrency(vatAmount)}</Text>
        </View>

        <View style={pageStyles.totalBox}>
          <View style={pageStyles.totalLabelBox}>
            <Text style={pageStyles.totalBoxLabel}>Total</Text>
          </View>
          <Text style={pageStyles.totalBoxValue}>{formatCurrency(total)}</Text>
        </View>

        <View style={pageStyles.balanceDueRow}>
          <Text style={pageStyles.totalsLabel}>Balance Due</Text>
          <Text style={pageStyles.totalsValue}>{formatCurrency(total)}</Text>
        </View>
      </View>
    </View>

    {/* Signatures */}
    <Signatures showStamp={true} />

    {/* Decorative corner */}
    <CornerDecoration />

    {/* Footer */}
    <Footer />
  </Page>
);
