import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for Arabic support
Font.register({
  family: 'Noto Sans Arabic',
  src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf',
});

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

// Brand colors
export const COLORS = {
  primary: '#00BCD4',
  cyan: '#1DCAD3',
  coral: '#EE3E55',
  yellow: '#FFC42D',
  gold: '#FFD700',
  gray: '#5E5F5F',
  lightGray: '#909294',
  white: '#FFFFFF',
  black: '#000000',
  tableBorder: '#E5E5E5',
};

// Shared styles
export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 80,
    paddingHorizontal: 40,
    backgroundColor: COLORS.white,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    width: 100,
  },
  servicesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceLabels: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
  },
  serviceLabel: {
    fontSize: 7,
    color: COLORS.gray,
  },
  serviceSeparator: {
    fontSize: 7,
    color: COLORS.lightGray,
    marginHorizontal: 2,
  },

  // Title styles
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: COLORS.coral,
    fontWeight: 'bold',
    textDecoration: 'underline',
    textDecorationColor: COLORS.coral,
  },

  // Bill To section
  billToSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  billToLeft: {
    flex: 1,
  },
  billToRight: {
    width: 150,
  },
  billToTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 6,
  },
  billToRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  billToLabel: {
    fontSize: 9,
    color: COLORS.black,
    width: 45,
  },
  billToValue: {
    fontSize: 9,
    color: COLORS.black,
    flex: 1,
  },
  quotationBox: {
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  quotationLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  quotationValue: {
    fontSize: 9,
  },

  // Table styles
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.cyan,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.tableBorder,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 30,
  },
  tableCell: {
    fontSize: 8,
    color: COLORS.black,
  },
  tableCellProduct: {
    width: '30%',
  },
  tableCellDescription: {
    width: '30%',
  },
  tableCellPrice: {
    width: '15%',
    textAlign: 'right',
  },
  tableCellQty: {
    width: '10%',
    textAlign: 'center',
  },
  tableCellAmount: {
    width: '15%',
    textAlign: 'right',
  },

  // Comments and Totals section
  commentsAndTotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  commentsSection: {
    width: '55%',
  },
  commentsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 6,
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
    width: '40%',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 2,
  },
  totalsLabel: {
    fontSize: 9,
    color: COLORS.black,
  },
  totalsValue: {
    fontSize: 9,
    color: COLORS.black,
    textAlign: 'right',
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.coral,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 4,
  },
  totalBoxLabel: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  totalBoxValue: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  balanceDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
    paddingBottom: 4,
  },

  // Signature section
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  signatureBlock: {
    alignItems: 'center',
    width: '40%',
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 30,
    color: COLORS.black,
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    borderStyle: 'dashed',
  },

  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerContent: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  footerThankYou: {
    fontSize: 12,
    color: COLORS.coral,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  footerContact: {
    fontSize: 9,
    color: COLORS.gray,
    marginBottom: 2,
  },
  footerAddress: {
    fontSize: 8,
    color: COLORS.gray,
    marginBottom: 8,
  },
  footerBar: {
    backgroundColor: COLORS.coral,
    paddingVertical: 8,
    alignItems: 'center',
  },
  footerWebsite: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Decorative corner
  cornerDecoration: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    width: 60,
    height: 80,
  },
  cornerStripe: {
    position: 'absolute',
    width: 100,
    height: 6,
    backgroundColor: COLORS.coral,
    opacity: 0.3,
  },

  // Terms page styles
  termsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  termsColumn: {
    flex: 1,
  },
  termsColumnRTL: {
    flex: 1,
    direction: 'rtl',
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.coral,
    marginBottom: 10,
    textDecoration: 'underline',
  },
  termsTitleArabic: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.coral,
    marginBottom: 10,
    textDecoration: 'underline',
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
  termsSection: {
    marginBottom: 12,
  },
  termsSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.black,
  },
  termsSectionTitleArabic: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.black,
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
  termsText: {
    fontSize: 8,
    lineHeight: 1.4,
    color: COLORS.gray,
    textAlign: 'justify',
  },
  termsTextArabic: {
    fontSize: 8,
    lineHeight: 1.6,
    color: COLORS.gray,
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
});
