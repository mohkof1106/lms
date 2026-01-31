import React from 'react';
import { Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import { COLORS } from './styles';
import { Header, Footer, CornerDecoration, Signatures } from './components';
import {
  termsIntroEn,
  termsIntroAr,
  termsSections,
  signatureNote,
  TermsSection,
} from './terms-content';

// Register Arabic font
Font.register({
  family: 'Noto Sans Arabic',
  src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf',
});

const termsStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 25,
    paddingBottom: 85,
    paddingHorizontal: 35,
    backgroundColor: COLORS.white,
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 10,
    flex: 1,
  },
  column: {
    flex: 1,
  },
  columnRTL: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.coral,
    marginBottom: 10,
    textDecoration: 'underline',
  },
  mainTitleAr: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.coral,
    marginBottom: 10,
    textDecoration: 'underline',
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
  intro: {
    fontSize: 7,
    lineHeight: 1.5,
    color: COLORS.gray,
    marginBottom: 12,
    textAlign: 'justify',
  },
  introAr: {
    fontSize: 7,
    lineHeight: 1.8,
    color: COLORS.gray,
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
  introHighlight: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.black,
  },
  sectionTitleAr: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.black,
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
  sectionContent: {
    fontSize: 7,
    lineHeight: 1.5,
    color: COLORS.gray,
    textAlign: 'justify',
  },
  sectionContentAr: {
    fontSize: 7,
    lineHeight: 1.8,
    color: COLORS.gray,
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
  signatureNote: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  signatureNoteAr: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'right',
    fontFamily: 'Noto Sans Arabic',
  },
  finalPageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  partyLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  partyLabelAr: {
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Noto Sans Arabic',
  },
});

interface TermsSectionProps {
  section: TermsSection;
}

const TermsSectionComponent = ({ section }: TermsSectionProps) => (
  <View style={termsStyles.section}>
    <Text style={termsStyles.sectionTitle}>{section.titleEn}</Text>
    <Text style={termsStyles.sectionContent}>{section.contentEn}</Text>
  </View>
);

const TermsSectionArabic = ({ section }: TermsSectionProps) => (
  <View style={termsStyles.section}>
    <Text style={termsStyles.sectionTitleAr}>{section.titleAr}</Text>
    <Text style={termsStyles.sectionContentAr}>{section.contentAr}</Text>
  </View>
);

// Terms Page 1 (sections 1-3)
export const TermsPage1 = () => {
  const sections = termsSections.slice(0, 3);

  return (
    <Page size="A4" style={termsStyles.page}>
      <Header />

      <View style={termsStyles.contentContainer}>
        {/* English Column (Left) */}
        <View style={termsStyles.column}>
          <Text style={termsStyles.mainTitle}>Terms & Agreements:</Text>
          <Text style={termsStyles.intro}>
            {termsIntroEn.split('By using our services')[0]}
            <Text style={termsStyles.introHighlight}>
              By using our services or starting a project with us, you agree to be bound by these Terms of Agreements:
            </Text>
          </Text>
          {sections.map((section) => (
            <TermsSectionComponent key={section.id} section={section} />
          ))}
        </View>

        {/* Arabic Column (Right) */}
        <View style={termsStyles.columnRTL}>
          <Text style={termsStyles.mainTitleAr}>الشروط والأحكام:</Text>
          <Text style={termsStyles.introAr}>
            {termsIntroAr.split('بمجرد استخدام')[0]}
            <Text style={termsStyles.introHighlight}>
              بمجرد استخدام خدماتنا أو البدء في مشروع معنا، فإنك توافق على الإلتزام بهذه الشروط و الاتفاقيات:
            </Text>
          </Text>
          {sections.map((section) => (
            <TermsSectionArabic key={section.id} section={section} />
          ))}
        </View>
      </View>

      <Signatures showStamp={true} />
      <CornerDecoration />
      <Footer />
    </Page>
  );
};

// Terms Page 2 (sections 4-8)
export const TermsPage2 = () => {
  const sections = termsSections.slice(3, 8);

  return (
    <Page size="A4" style={termsStyles.page}>
      <Header />

      <View style={termsStyles.contentContainer}>
        {/* English Column (Left) */}
        <View style={termsStyles.column}>
          {sections.map((section) => (
            <TermsSectionComponent key={section.id} section={section} />
          ))}
        </View>

        {/* Arabic Column (Right) */}
        <View style={termsStyles.columnRTL}>
          {sections.map((section) => (
            <TermsSectionArabic key={section.id} section={section} />
          ))}
        </View>
      </View>

      <Signatures showStamp={true} />
      <CornerDecoration />
      <Footer />
    </Page>
  );
};

// Terms Page 3 (section 9 + signature note)
export const TermsPage3 = () => {
  const sections = termsSections.slice(8);

  return (
    <Page size="A4" style={termsStyles.page}>
      <Header />

      <View style={termsStyles.contentContainer}>
        {/* English Column (Left) */}
        <View style={termsStyles.column}>
          {sections.map((section) => (
            <TermsSectionComponent key={section.id} section={section} />
          ))}
          <Text style={termsStyles.signatureNote}>{signatureNote.en}</Text>
        </View>

        {/* Arabic Column (Right) */}
        <View style={termsStyles.columnRTL}>
          {sections.map((section) => (
            <TermsSectionArabic key={section.id} section={section} />
          ))}
          <Text style={termsStyles.signatureNoteAr}>{signatureNote.ar}</Text>
        </View>
      </View>

      {/* Party labels */}
      <View style={termsStyles.finalPageLabels}>
        <Text style={termsStyles.partyLabelAr}>الطرف الاول:</Text>
        <Text style={termsStyles.partyLabelAr}>الطرف الثاني:</Text>
      </View>

      <Signatures showStamp={true} />
      <CornerDecoration />
      <Footer />
    </Page>
  );
};
