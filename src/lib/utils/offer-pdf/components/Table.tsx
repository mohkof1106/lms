import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { COLORS } from '../styles';

const tableStyles = StyleSheet.create({
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cyan,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  headerCell: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 35,
  },
  rowAlt: {
    backgroundColor: '#FAFAFA',
  },
  cell: {
    fontSize: 8,
    color: COLORS.black,
  },
  cellDescription: {
    fontSize: 7,
    color: COLORS.lightGray,
    marginTop: 2,
  },
  // Column widths
  colProduct: { width: '28%' },
  colDescription: { width: '32%' },
  colPrice: { width: '15%', textAlign: 'right' },
  colQty: { width: '10%', textAlign: 'center' },
  colAmount: { width: '15%', textAlign: 'right' },
  // Empty rows
  emptyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    height: 25,
    paddingHorizontal: 8,
  },
});

interface LineItem {
  description: string;
  detailedDescription?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface TableProps {
  lineItems: LineItem[];
  formatCurrency: (amount: number) => string;
}

export const Table = ({ lineItems, formatCurrency }: TableProps) => {
  // Calculate how many empty rows to show (minimum 5 rows total)
  const minRows = 5;
  const emptyRowsCount = Math.max(0, minRows - lineItems.length);

  return (
    <View style={tableStyles.table}>
      {/* Header */}
      <View style={tableStyles.headerRow}>
        <Text style={[tableStyles.headerCell, tableStyles.colProduct]}>Product</Text>
        <Text style={[tableStyles.headerCell, tableStyles.colDescription]}>Description</Text>
        <Text style={[tableStyles.headerCell, tableStyles.colPrice]}>Price</Text>
        <Text style={[tableStyles.headerCell, tableStyles.colQty]}>Qty</Text>
        <Text style={[tableStyles.headerCell, tableStyles.colAmount]}>Amount</Text>
      </View>

      {/* Data rows */}
      {lineItems.map((item, index) => (
        <View key={index} style={index % 2 === 1 ? [tableStyles.row, tableStyles.rowAlt] : tableStyles.row}>
          <View style={tableStyles.colProduct}>
            <Text style={tableStyles.cell}>{item.description}</Text>
          </View>
          <View style={tableStyles.colDescription}>
            {item.detailedDescription && (
              <Text style={tableStyles.cellDescription}>{item.detailedDescription}</Text>
            )}
          </View>
          <Text style={[tableStyles.cell, tableStyles.colPrice]}>
            {formatCurrency(item.unitPrice)}
          </Text>
          <Text style={[tableStyles.cell, tableStyles.colQty]}>{item.quantity}</Text>
          <Text style={[tableStyles.cell, tableStyles.colAmount]}>
            {formatCurrency(item.total)}
          </Text>
        </View>
      ))}

      {/* Empty rows for visual consistency */}
      {Array.from({ length: emptyRowsCount }).map((_, index) => (
        <View key={`empty-${index}`} style={tableStyles.emptyRow}>
          <View style={tableStyles.colProduct} />
          <View style={tableStyles.colDescription} />
          <View style={tableStyles.colPrice} />
          <View style={tableStyles.colQty} />
          <View style={tableStyles.colAmount} />
        </View>
      ))}
    </View>
  );
};
