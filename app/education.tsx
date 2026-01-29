
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Modal } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EducationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  console.log('EducationScreen: Rendering education programs page, currency:', selectedCurrency);

  const currencies = [
    { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي', rate: 1, flag: '🇺🇸' },
    { code: 'SAR', symbol: 'ر.س', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي', rate: 3.75, flag: '🇸🇦' },
    { code: 'AED', symbol: 'د.إ', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي', rate: 3.67, flag: '🇦🇪' },
    { code: 'QAR', symbol: 'ر.ق', nameEn: 'Qatari Riyal', nameAr: 'ريال قطري', rate: 3.64, flag: '🇶🇦' },
    { code: 'BHD', symbol: 'د.ب', nameEn: 'Bahraini Dinar', nameAr: 'دينار بحريني', rate: 0.376, flag: '🇧🇭' },
    { code: 'OMR', symbol: 'ر.ع', nameEn: 'Omani Rial', nameAr: 'ريال عماني', rate: 0.385, flag: '🇴🇲' },
  ];

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const rate = selectedCurrencyData?.rate || 1;
  const symbol = selectedCurrencyData?.symbol || '$';

  const educationPrograms = [
    {
      id: 'analysis_training',
      titleEn: 'Analysis Training from Scratch',
      titleAr: 'تعليم التحليل من الصفر',
      descriptionEn: 'Training will be conducted by analyst Noor',
      descriptionAr: 'التعليم سيكون من خلال المحللة نور',
      icon: 'bar-chart',
      color: '#1E3A8A',
      features: [
        { 
          en: 'Analyst and trader in markets (Forex, stocks, cryptocurrencies)', 
          ar: 'محللة ومتداولة في أسواق (الفوركس والأسهم والعملات الرقمية)' 
        },
        { 
          en: 'Over 5 years of experience in the field', 
          ar: 'خبرة تتعدى 5 سنوات في المجال' 
        },
        { 
          en: 'Proficient in classical technical analysis + pure price action + ICT strategy', 
          ar: 'متقنة لمدرسة التحليل الفني الكلاسيكي + pure price action + إستراتيجية ICT' 
        },
      ],
      featuresTitleEn: 'Training will be conducted by analyst Noor:',
      featuresTitleAr: 'التعليم سيكون من خلال المحللة نور:',
      priceUSD: 1500,
      duration: '2 months',
      durationAr: 'شهرين',
    },
    {
      id: 'trading_training',
      titleEn: 'Trading Training from Scratch',
      titleAr: 'تعليم التداول من الصفر',
      descriptionEn: 'Complete trading course from basics to advanced strategies',
      descriptionAr: 'دورة تداول كاملة من الأساسيات إلى الاستراتيجيات المتقدمة',
      icon: 'show-chart',
      color: '#3B82F6',
      priceUSD: 165,
      duration: '1 month',
      durationAr: 'شهر واحد',
      features: [
        { en: 'Teaching the basics', ar: '١ – تعليم الاساسيات' },
        { en: 'Private follow-up from the trainer', ar: '٢ – متابعة خاصه من المدرب' },
        { en: 'Cumulative profit schedule', ar: '٣ – جدول الربح التراكمي' },
      ],
      featuresTitleEn: 'The service includes:',
      featuresTitleAr: 'الخدمة تشمل:',
    },
    {
      id: 'instructions_service',
      titleEn: 'Instructions Service',
      titleAr: 'خدمة التعليمات',
      descriptionEn: 'Instructions and tips for SBM channel subscribers',
      descriptionAr: 'تعليمات ونصائح لمشتركي قناة SBM',
      icon: 'help',
      color: '#10B981',
      priceUSD: 75,
      duration: '1 month',
      durationAr: 'شهر واحد',
      features: [
        { en: 'Instructions and tips only', ar: 'تعليمات ونصائح فقط' },
        { en: 'Cumulative profit schedule', ar: 'جدول الربح التراكمي' },
      ],
      featuresTitleEn: 'The service includes:',
      featuresTitleAr: 'الخدمة تشمل:',
    },
    {
      id: 'forex_guide',
      titleEn: 'Forex Guide for Beginners',
      titleAr: 'دليل الفوركس للمبتدئين',
      descriptionEn: 'Comprehensive guide covering Forex basics',
      descriptionAr: 'دليل شامل يغطي أساسيات الفوركس',
      icon: 'menu-book',
      color: '#8B5CF6',
      priceUSD: 82,
      duration: 'N/A',
      durationAr: 'غير محدد',
      features: [
        { en: 'Forex basics only', ar: 'أساسيات الفوركس فقط' },
        { en: 'No analysis or recommendations included', ar: 'لا يتضمن تحليلات أو توصيات' },
        { en: 'No trainer included', ar: 'لا يشمل المدرب' },
      ],
      featuresTitleEn: 'The guide includes:',
      featuresTitleAr: 'الدليل يشمل:',
    },
  ];

  const handleProgramSelect = (programId: string) => {
    console.log('User selected education program:', programId);
    setSelectedProgram(programId);
  };

  const handleEnroll = () => {
    if (!selectedProgram) {
      console.log('No program selected');
      return;
    }
    console.log('User enrolling in program:', selectedProgram);
    
    if (selectedProgram === 'analysis_training') {
      router.push('/analysis-terms');
    } else if (selectedProgram === 'trading_training') {
      router.push('/trading-terms');
    } else if (selectedProgram === 'instructions_service') {
      router.push('/instructions-terms');
    } else if (selectedProgram === 'forex_guide') {
      router.push('/forex-guide-terms');
    } else {
      router.push(`/registration?channel=education&program=${selectedProgram}`);
    }
  };

  const isCurrencySelected = (code: string) => selectedCurrency === code;
  const currencyDisplayText = `${selectedCurrencyData?.flag} ${selectedCurrencyData?.code}`;

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: topPaddingTop,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 8,
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerTitleAr: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 2,
    },
    headerSpacer: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    headerSection: {
      alignItems: 'center',
      padding: 24,
      paddingTop: 32,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 12,
    },
    currencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.highlight,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    currencyButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      marginHorizontal: 6,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 12,
      marginBottom: 4,
      textAlign: 'center',
    },
    titleAr: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 4,
    },
    subtitleAr: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    programsSection: {
      paddingHorizontal: 24,
    },
    programCard: {
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colors.border,
    },
    programCardSelected: {
      borderColor: colors.highlight,
    },
    programGradient: {
      padding: 20,
    },
    programHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    selectedBadge: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 4,
    },
    programTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 2,
    },
    programTitleSelected: {
      color: colors.text,
    },
    programTitleAr: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    programTitleArSelected: {
      color: colors.text,
    },
    descriptionContainer: {
      marginBottom: 12,
    },
    descriptionText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    descriptionTextSelected: {
      color: colors.text,
      opacity: 0.9,
    },
    descriptionTextAr: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    descriptionTextArSelected: {
      color: colors.text,
      opacity: 0.85,
    },
    programInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoTextContainer: {
      marginLeft: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    infoTextSelected: {
      color: colors.text,
    },
    infoTextAr: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    infoTextArSelected: {
      color: colors.text,
      opacity: 0.8,
    },
    priceText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.highlight,
      marginLeft: 8,
    },
    priceTextSelected: {
      color: colors.text,
    },
    installmentContainer: {
      marginBottom: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    installmentText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
      lineHeight: 18,
    },
    installmentTextSelected: {
      color: colors.text,
      opacity: 0.9,
    },
    installmentTextAr: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      lineHeight: 18,
    },
    installmentTextArSelected: {
      color: colors.text,
      opacity: 0.85,
    },
    tamaraContainer: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginTop: 4,
    },
    tamaraText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.background,
    },
    tamaraTextSelected: {
      color: colors.background,
    },
    featuresSection: {
      marginTop: 8,
    },
    featuresTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    featuresTitleSelected: {
      color: colors.text,
    },
    featuresTitleAr: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    featuresTitleArSelected: {
      color: colors.text,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    featureTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    featureText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
    },
    featureTextSelected: {
      color: colors.text,
    },
    featureTextAr: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    featureTextArSelected: {
      color: colors.text,
      opacity: 0.85,
    },
    benefitsSection: {
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    benefitsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    benefitsTitleAr: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    benefitContent: {
      flex: 1,
      marginLeft: 12,
    },
    benefitText: {
      fontSize: 15,
      color: colors.text,
      marginBottom: 4,
    },
    benefitTextAr: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    enrollButton: {
      backgroundColor: colors.highlight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 18,
      borderRadius: 12,
    },
    enrollButtonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    enrollButtonText: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.text,
      marginRight: 4,
    },
    enrollButtonTextAr: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.text,
      marginRight: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '70%',
      paddingBottom: 40,
    },
    modalHeader: {
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      position: 'relative',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    modalTitleAr: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    modalCloseButton: {
      position: 'absolute',
      top: 24,
      right: 24,
      padding: 4,
    },
    modalScroll: {
      paddingHorizontal: 24,
      paddingTop: 16,
    },
    currencyModalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    currencyModalItemSelected: {
      borderColor: colors.highlight,
      backgroundColor: colors.accent,
    },
    currencyModalInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    currencyModalFlag: {
      fontSize: 32,
      marginRight: 12,
    },
    currencyModalSymbol: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginRight: 16,
      minWidth: 40,
      textAlign: 'center',
    },
    currencyModalSymbolSelected: {
      color: colors.highlight,
    },
    currencyModalTextContainer: {
      flex: 1,
    },
    currencyModalCode: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 2,
    },
    currencyModalCodeSelected: {
      color: colors.highlight,
    },
    currencyModalName: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    currencyModalNameSelected: {
      color: colors.text,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioButtonSelected: {
      borderColor: colors.highlight,
    },
    radioButtonInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.highlight,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on education page');
            router.back();
          }}
          activeOpacity={0.7}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Education</Text>
          <Text style={styles.headerTitleAr}>التعليم</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <IconSymbol 
              ios_icon_name="book.fill" 
              android_material_icon_name="menu-book" 
              size={48} 
              color={colors.highlight} 
            />
            <TouchableOpacity 
              style={styles.currencyButton}
              onPress={() => {
                console.log('User tapped currency selector on education page');
                setShowCurrencyModal(true);
              }}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="dollarsign.circle.fill" 
                android_material_icon_name="attach-money" 
                size={20} 
                color={colors.text} 
              />
              <Text style={styles.currencyButtonText}>{currencyDisplayText}</Text>
              <IconSymbol 
                ios_icon_name="chevron.down" 
                android_material_icon_name="arrow-drop-down" 
                size={20} 
                color={colors.text} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Education Programs</Text>
          <Text style={styles.titleAr}>برامج التعليم</Text>
          <Text style={styles.subtitle}>
            Master trading with our comprehensive education programs
          </Text>
          <Text style={styles.subtitleAr}>
            أتقن التداول مع برامجنا التعليمية الشاملة
          </Text>
        </View>

        <View style={styles.programsSection}>
          {educationPrograms.map((program, index) => {
            const isSelected = selectedProgram === program.id;
            const priceInCurrency = Math.round(program.priceUSD * rate);
            const priceDisplay = `${symbol}${priceInCurrency}`;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.programCard,
                  isSelected && styles.programCardSelected,
                ]}
                onPress={() => handleProgramSelect(program.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? [program.color, colors.highlight] : [colors.card, colors.card]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.programGradient}
                >
                  <View style={styles.programHeader}>
                    <IconSymbol 
                      ios_icon_name={program.icon} 
                      android_material_icon_name={program.icon} 
                      size={40} 
                      color={isSelected ? colors.text : colors.highlight} 
                    />
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol 
                          ios_icon_name="checkmark.circle.fill" 
                          android_material_icon_name="check-circle" 
                          size={24} 
                          color={colors.success} 
                        />
                      </View>
                    )}
                  </View>

                  <Text style={[styles.programTitle, isSelected && styles.programTitleSelected]}>
                    {program.titleEn}
                  </Text>
                  <Text style={[styles.programTitleAr, isSelected && styles.programTitleArSelected]}>
                    {program.titleAr}
                  </Text>

                  <View style={styles.descriptionContainer}>
                    <Text style={[styles.descriptionText, isSelected && styles.descriptionTextSelected]}>
                      {program.descriptionEn}
                    </Text>
                    <Text style={[styles.descriptionTextAr, isSelected && styles.descriptionTextArSelected]}>
                      {program.descriptionAr}
                    </Text>
                  </View>

                  <View style={styles.programInfo}>
                    <View style={styles.infoItem}>
                      <IconSymbol 
                        ios_icon_name="clock.fill" 
                        android_material_icon_name="access-time" 
                        size={20} 
                        color={isSelected ? colors.text : colors.highlight} 
                      />
                      <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoText, isSelected && styles.infoTextSelected]}>
                          {program.duration}
                        </Text>
                        <Text style={[styles.infoTextAr, isSelected && styles.infoTextArSelected]}>
                          {program.durationAr}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <IconSymbol 
                        ios_icon_name="tag.fill" 
                        android_material_icon_name="local-offer" 
                        size={20} 
                        color={isSelected ? colors.text : colors.highlight} 
                      />
                      <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
                        {priceDisplay}
                      </Text>
                    </View>
                  </View>

                  {program.installmentInfo && (
                    <View style={styles.installmentContainer}>
                      <Text style={[styles.installmentText, isSelected && styles.installmentTextSelected]}>
                        {program.installmentInfo.en}
                      </Text>
                      <Text style={[styles.installmentTextAr, isSelected && styles.installmentTextArSelected]}>
                        {program.installmentInfo.ar}
                      </Text>
                      <View style={styles.tamaraContainer}>
                        <Text style={[styles.tamaraText, isSelected && styles.tamaraTextSelected]}>
                          Tamara
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.featuresSection}>
                    <Text style={[styles.featuresTitle, isSelected && styles.featuresTitleSelected]}>
                      {program.featuresTitleEn}
                    </Text>
                    <Text style={[styles.featuresTitleAr, isSelected && styles.featuresTitleArSelected]}>
                      {program.featuresTitleAr}
                    </Text>
                    {program.features.map((feature, featureIndex) => (
                      <View key={featureIndex} style={styles.featureItem}>
                        <IconSymbol 
                          ios_icon_name="checkmark.circle" 
                          android_material_icon_name="check-circle" 
                          size={18} 
                          color={isSelected ? colors.text : colors.success} 
                        />
                        <View style={styles.featureTextContainer}>
                          <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
                            {feature.en}
                          </Text>
                          <Text style={[styles.featureTextAr, isSelected && styles.featureTextArSelected]}>
                            {feature.ar}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Choose Our Education Programs?</Text>
          <Text style={styles.benefitsTitleAr}>لماذا تختار برامجنا التعليمية؟</Text>

          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={24} 
              color={colors.highlight} 
            />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>Expert instructors with years of trading experience</Text>
              <Text style={styles.benefitTextAr}>مدربون خبراء بسنوات من الخبرة في التداول</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="video.fill" 
              android_material_icon_name="videocam" 
              size={24} 
              color={colors.highlight} 
            />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>Video lessons and live sessions</Text>
              <Text style={styles.benefitTextAr}>دروس فيديو وجلسات مباشرة</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="doc.text.fill" 
              android_material_icon_name="description" 
              size={24} 
              color={colors.highlight} 
            />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>Comprehensive study materials and resources</Text>
              <Text style={styles.benefitTextAr}>مواد دراسية وموارد شاملة</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.enrollButton,
            !selectedProgram && styles.enrollButtonDisabled,
          ]}
          onPress={handleEnroll}
          disabled={!selectedProgram}
          activeOpacity={0.8}
        >
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
          <Text style={styles.enrollButtonTextAr}>سجل الآن</Text>
          <IconSymbol 
            ios_icon_name="arrow.right" 
            android_material_icon_name="arrow-forward" 
            size={20} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <Text style={styles.modalTitleAr}>اختر العملة</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowCurrencyModal(false)}
                activeOpacity={0.7}
              >
                <IconSymbol 
                  ios_icon_name="xmark" 
                  android_material_icon_name="close" 
                  size={24} 
                  color={colors.text} 
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {currencies.map((currency, index) => {
                const selected = isCurrencySelected(currency.code);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.currencyModalItem,
                      selected && styles.currencyModalItemSelected,
                    ]}
                    onPress={() => {
                      console.log('User selected currency on education page:', currency.code);
                      setSelectedCurrency(currency.code);
                      setShowCurrencyModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.currencyModalInfo}>
                      <Text style={styles.currencyModalFlag}>
                        {currency.flag}
                      </Text>
                      <Text style={[styles.currencyModalSymbol, selected && styles.currencyModalSymbolSelected]}>
                        {currency.symbol}
                      </Text>
                      <View style={styles.currencyModalTextContainer}>
                        <Text style={[styles.currencyModalCode, selected && styles.currencyModalCodeSelected]}>
                          {currency.code}
                        </Text>
                        <Text style={[styles.currencyModalName, selected && styles.currencyModalNameSelected]}>
                          {currency.nameAr}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
                      {selected && <View style={styles.radioButtonInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
