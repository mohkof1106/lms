import React from 'react';
import { View, Text, Svg, Path, G, Circle, Rect, Line, StyleSheet } from '@react-pdf/renderer';
import { COLORS } from '../styles';

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 10,
  },
  logoContainer: {
    width: 110,
  },
  servicesContainer: {
    alignItems: 'flex-end',
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  iconContainer: {
    alignItems: 'center',
  },
  serviceLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceLabel: {
    fontSize: 7,
    letterSpacing: 0.5,
  },
  separator: {
    fontSize: 7,
    color: COLORS.lightGray,
    marginHorizontal: 4,
  },
});

// LOR Logo as SVG component
const LORLogo = () => (
  <Svg width="100" height="90" viewBox="0 0 110 99.8">
    {/* Yellow "r" part */}
    <Path
      d="M84.8,64.9c-1.3,0-2.6-0.8-3.2-2c-0.8-1.8,0-3.8,1.7-4.6l16.9-7.7l-13.8-13c-1.4-1.3-1.5-3.5-0.1-4.9c1.3-1.4,3.5-1.5,4.9-0.1L108.9,49c0.8,0.8,1.2,2,1.1,3.1c-0.2,1.1-0.9,2.1-2,2.6l-21.7,9.9C85.8,64.8,85.3,64.9,84.8,64.9"
      fill={COLORS.yellow}
    />
    <Path
      d="M61,64.9c-0.9,0-1.9-0.4-2.5-1.1c-1.3-1.4-1.3-3.6,0.1-4.9l28-26.4c1.4-1.3,3.6-1.3,4.9,0.1c1.3,1.4,1.3,3.6-0.1,4.9L63.4,64C62.7,64.6,61.8,64.9,61,64.9"
      fill={COLORS.yellow}
    />
    {/* Red "l" part */}
    <Path
      d="M3.5,83c-0.5,0-0.9-0.1-1.4-0.3C0.8,82.2,0,80.9,0,79.5V19.2c0-1.9,1.6-3.5,3.5-3.5S7,17.3,7,19.2v52.2l13.3-12.5c1.4-1.3,3.6-1.3,4.9,0.1s1.3,3.6-0.1,4.9L5.9,82.1C5.2,82.7,4.4,83,3.5,83"
      fill={COLORS.coral}
    />
    {/* Cyan "o" part */}
    <Path
      d="M22.6,64.9c-0.9,0-1.7-0.3-2.4-1l-5.9-5.5c-1.4-1.3-1.5-3.5-0.1-4.9c1.3-1.4,3.5-1.5,4.9-0.1l5.9,5.5c1.4,1.3,1.5,3.5,0.1,4.9C24.5,64.6,23.6,64.9,22.6,64.9"
      fill={COLORS.cyan}
    />
    <Path
      d="M80.1,83c-0.9,0-1.7-0.3-2.4-1L58.6,64c-1.4-1.3-1.5-3.5-0.1-4.9c1.3-1.4,3.5-1.5,4.9-0.1l19.1,18c1.4,1.3,1.5,3.5,0.1,4.9C81.9,82.6,81,83,80.1,83"
      fill={COLORS.cyan}
    />
    <Path
      d="M103.9,83c-0.9,0-1.7-0.3-2.4-1L82.4,64c-1.4-1.3-1.4-3.6-0.1-5s3.5-1.5,4.9-0.1l19.1,18c1.4,1.3,1.5,3.5,0.1,4.9C105.8,82.6,104.8,83,103.9,83"
      fill={COLORS.yellow}
    />
    <Path
      d="M41.8,83c-0.9,0-1.7-0.3-2.4-1L20.3,64c-0.7-0.7-1.1-1.6-1.1-2.5c0-1,0.4-1.9,1.1-2.5l19.2-18.1c1.3-1.3,3.5-1.3,4.8,0L63.5,59c0.7,0.7,1.1,1.6,1.1,2.5c0,1-0.4,1.9-1.1,2.5L44.2,82.1C43.5,82.7,42.7,83,41.8,83 M27.7,61.4l14.1,13.3l14.1-13.3L41.8,48.2L27.7,61.4z"
      fill={COLORS.cyan}
    />
    {/* Text "Leaders Of Resolution" */}
    <G opacity="0.94">
      <Text
        x="0"
        y="93"
        style={{ fontSize: 5, fill: COLORS.gray, fontFamily: 'Helvetica' }}
      >
        Leaders Of Resolution
      </Text>
    </G>
  </Svg>
);

// Service icon - Lightbulb (Creative)
const LightbulbIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 32 32">
    <Circle cx="16" cy="16" r="16" fill={COLORS.coral} />
    <Path
      d="M16 8c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.2v1.8c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-1.8c1.8-1.1 3-3 3-5.2 0-3.3-2.7-6-6-6zm2 11h-4v-1h4v1zm-.4-2.6l-.6.4v.2h-2v-.2l-.6-.4c-1.3-.8-2.4-2.2-2.4-3.9 0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1.7-1.1 3.1-2.4 3.9z"
      fill={COLORS.white}
    />
  </Svg>
);

// Service icon - Clapperboard (Animation)
const ClapperboardIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 32 32">
    <Circle cx="16" cy="16" r="16" fill={COLORS.cyan} />
    <Path
      d="M24 10h-2l-2-2h-4l2 2h-4l-2-2h-2l2 2H8c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V11c0-.6-.4-1-1-1zm-1 12H9V12h14v10z"
      fill={COLORS.white}
    />
    <Rect x="10" y="14" width="12" height="2" fill={COLORS.white} opacity="0.6" />
    <Rect x="10" y="18" width="12" height="2" fill={COLORS.white} opacity="0.6" />
  </Svg>
);

// Service icon - Book (Branding)
const BookIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 32 32">
    <Circle cx="16" cy="16" r="16" fill={COLORS.yellow} />
    <Path
      d="M22 8H10c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 14c-2.2 0-4-1.1-4-2.5V11c1.2.6 2.5 1 4 1s2.8-.4 4-1v8.5c0 1.4-1.8 2.5-4 2.5z"
      fill={COLORS.white}
    />
  </Svg>
);

// Service icon - Laptop (Web design)
const LaptopIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 32 32">
    <Circle cx="16" cy="16" r="16" fill="#4DD0E1" />
    <Path
      d="M24 20V11c0-.6-.4-1-1-1H9c-.6 0-1 .4-1 1v9H6v2c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-2h-2zm-14-9h12v8H10v-8z"
      fill={COLORS.white}
    />
  </Svg>
);

export const Header = () => (
  <View style={headerStyles.header}>
    <View style={headerStyles.logoContainer}>
      <LORLogo />
    </View>
    <View style={headerStyles.servicesContainer}>
      <View style={headerStyles.iconsRow}>
        <View style={headerStyles.iconContainer}>
          <LightbulbIcon />
        </View>
        <View style={headerStyles.iconContainer}>
          <ClapperboardIcon />
        </View>
        <View style={headerStyles.iconContainer}>
          <BookIcon />
        </View>
        <View style={headerStyles.iconContainer}>
          <LaptopIcon />
        </View>
      </View>
      <View style={headerStyles.serviceLabelsRow}>
        <Text style={[headerStyles.serviceLabel, { color: COLORS.coral }]}>Creative</Text>
        <Text style={headerStyles.separator}>|</Text>
        <Text style={[headerStyles.serviceLabel, { color: COLORS.cyan }]}>Animation</Text>
        <Text style={headerStyles.separator}>|</Text>
        <Text style={[headerStyles.serviceLabel, { color: COLORS.yellow }]}>Branding</Text>
        <Text style={headerStyles.separator}>|</Text>
        <Text style={[headerStyles.serviceLabel, { color: '#4DD0E1' }]}>Web design</Text>
      </View>
    </View>
  </View>
);
