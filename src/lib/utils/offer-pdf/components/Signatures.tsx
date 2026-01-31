import React from 'react';
import { View, Text, StyleSheet, Svg, Path, Circle, G, Rect } from '@react-pdf/renderer';
import { COLORS } from '../styles';

const sigStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  block: {
    width: '45%',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 9,
    color: COLORS.black,
  },
  stampContainer: {
    marginLeft: 10,
  },
  line: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    borderStyle: 'dashed',
    marginTop: 10,
  },
});

// Simplified company stamp/seal
const CompanyStamp = () => (
  <Svg width="60" height="55" viewBox="0 0 60 55">
    {/* Outer border */}
    <Rect x="2" y="2" width="56" height="51" fill="none" stroke={COLORS.gray} strokeWidth="1" />

    {/* LOR mini logo */}
    <G transform="translate(15, 5) scale(0.35)">
      {/* Simplified LOR letters */}
      <Path d="M3.5,60V15c0-1.9,1.6-3.5,3.5-3.5S10.5,13.1,10.5,15v37l10-9.4c1.4-1.3,3.6-1.3,4.9,0.1s1.3,3.6-0.1,4.9L8.1,63.3C7.4,64,6.5,64.3,5.6,64.3c-0.5,0-0.9-0.1-1.4-0.3C2.9,63.5,2.1,62.2,2.1,60.8" fill={COLORS.coral} />
      <Path d="M30,60c-0.9,0-1.7-0.3-2.4-1L14.5,47c-0.7-0.7-1.1-1.6-1.1-2.5c0-1,0.4-1.9,1.1-2.5l13.1-12.4c1.3-1.3,3.5-1.3,4.8,0L45.5,42c0.7,0.7,1.1,1.6,1.1,2.5c0,1-0.4,1.9-1.1,2.5L32.4,59C31.7,59.6,30.9,60,30,60" fill={COLORS.cyan} />
      <Path d="M55,47l-15-14c1.4-1.3,3.6-1.3,4.9,0.1L60,47c0.8,0.8,1.2,2,1.1,3.1c-0.2,1.1-0.9,2.1-2,2.6l-15,6.8" fill={COLORS.yellow} />
    </G>

    {/* Company name */}
    <Text x="30" y="32" textAnchor="middle" style={{ fontSize: 4, fill: COLORS.gray }}>
      لور للتصميم بالحاسب الآلي
    </Text>
    <Text x="30" y="38" textAnchor="middle" style={{ fontSize: 3.5, fill: COLORS.gray, fontWeight: 'bold' }}>
      LOR COMPUTER DESIGNING L.L.C. SP
    </Text>

    {/* Contact info */}
    <Text x="30" y="44" textAnchor="middle" style={{ fontSize: 3, fill: COLORS.coral }}>
      06 534 1776
    </Text>
    <Text x="30" y="48" textAnchor="middle" style={{ fontSize: 3, fill: COLORS.cyan }}>
      www.lor.ae
    </Text>
  </Svg>
);

interface SignaturesProps {
  showStamp?: boolean;
}

export const Signatures = ({ showStamp = true }: SignaturesProps) => (
  <View style={sigStyles.container}>
    {/* LOR Signature */}
    <View style={sigStyles.block}>
      <View style={sigStyles.labelRow}>
        <Text style={sigStyles.label}>LOR Signature</Text>
        {showStamp && (
          <View style={sigStyles.stampContainer}>
            <CompanyStamp />
          </View>
        )}
      </View>
      <View style={sigStyles.line} />
    </View>

    {/* Customer Signature */}
    <View style={sigStyles.block}>
      <Text style={sigStyles.label}>Customer Signature</Text>
      <View style={[sigStyles.line, { marginTop: 30 }]} />
    </View>
  </View>
);

// For terms pages - simpler signature with Arabic labels
export const SignaturesWithArabic = ({ showStamp = true }: SignaturesProps) => (
  <View style={sigStyles.container}>
    {/* LOR Signature */}
    <View style={sigStyles.block}>
      <View style={sigStyles.labelRow}>
        <Text style={sigStyles.label}>LOR Signature</Text>
        {showStamp && (
          <View style={sigStyles.stampContainer}>
            <CompanyStamp />
          </View>
        )}
      </View>
      <View style={sigStyles.line} />
    </View>

    {/* Customer Signature */}
    <View style={sigStyles.block}>
      <Text style={sigStyles.label}>Customer Signature</Text>
      <View style={[sigStyles.line, { marginTop: 30 }]} />
    </View>
  </View>
);
