import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { COLORS } from '../styles';
import { mockCompanyInfo, mockCompanySettings } from '@/lib/mock-data/settings';

const footerStyles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 10,
  },
  thankYou: {
    fontSize: 13,
    color: COLORS.coral,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: 2,
  },
  contactValue: {
    fontSize: 9,
    color: COLORS.gray,
  },
  contactSpacer: {
    width: 20,
  },
  address: {
    fontSize: 8,
    color: COLORS.gray,
    marginBottom: 10,
    textAlign: 'center',
  },
  bar: {
    backgroundColor: COLORS.coral,
    paddingVertical: 8,
    alignItems: 'center',
    width: '100%',
  },
  website: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export const Footer = () => (
  <View style={footerStyles.footer}>
    <View style={footerStyles.content}>
      <Text style={footerStyles.thankYou}>Thank You For Your Business!</Text>
      <View style={footerStyles.contactRow}>
        <Text style={[footerStyles.contactLabel, { color: COLORS.coral }]}>T.</Text>
        <Text style={footerStyles.contactValue}>{mockCompanyInfo.phone}</Text>
        <View style={footerStyles.contactSpacer} />
        <Text style={[footerStyles.contactLabel, { color: COLORS.coral }]}>M.</Text>
        <Text style={footerStyles.contactValue}>{mockCompanyInfo.mobile}</Text>
        <View style={footerStyles.contactSpacer} />
        <Text style={[footerStyles.contactLabel, { color: COLORS.coral }]}>E.</Text>
        <Text style={footerStyles.contactValue}>{mockCompanyInfo.email}</Text>
      </View>
      <Text style={footerStyles.address}>{mockCompanySettings.address}</Text>
    </View>
    <View style={footerStyles.bar}>
      <Text style={footerStyles.website}>www.lor.ae</Text>
    </View>
  </View>
);

// Decorative corner stripes for bottom-left
export const CornerDecoration = () => (
  <View
    style={{
      position: 'absolute',
      bottom: 70,
      left: 0,
      width: 70,
      height: 100,
    }}
  >
    {/* Multiple diagonal stripes */}
    <View
      style={{
        position: 'absolute',
        bottom: 60,
        left: -20,
        width: 80,
        height: 5,
        backgroundColor: COLORS.coral,
        opacity: 0.15,
        transform: 'rotate(-45deg)',
      }}
    />
    <View
      style={{
        position: 'absolute',
        bottom: 50,
        left: -15,
        width: 70,
        height: 5,
        backgroundColor: COLORS.coral,
        opacity: 0.2,
        transform: 'rotate(-45deg)',
      }}
    />
    <View
      style={{
        position: 'absolute',
        bottom: 40,
        left: -10,
        width: 60,
        height: 5,
        backgroundColor: COLORS.coral,
        opacity: 0.25,
        transform: 'rotate(-45deg)',
      }}
    />
    <View
      style={{
        position: 'absolute',
        bottom: 30,
        left: -5,
        width: 50,
        height: 5,
        backgroundColor: COLORS.coral,
        opacity: 0.3,
        transform: 'rotate(-45deg)',
      }}
    />
  </View>
);
