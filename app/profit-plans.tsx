
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Platform, TouchableOpacity, Modal } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfitPlansScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  console.log('ProfitPlansScreen: Rendering profit plans page, currency:', selectedCurrency);

  const currencies = [
    { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي', rate: 1, flag: '🇺🇸' },
    { code: 'SAR', symbol: 'ر.س', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي', rate: 3.75, flag: '🇸🇦' },
    { code: 'AED', symbol: 'د.إ', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي', rate: 3.67, flag: '🇦🇪' },
    { code: 'QAR', symbol: 'ر.ق', nameEn: 'Qatari Riyal', nameAr: 'ريال قطري', rate: 3.64, flag: '🇶🇦' },
    { code: 'BHD', symbol: 'د.ب', nameEn: 'Bahraini Dinar', nameAr: 'دينار بحريني', rate: 0.376, flag: '🇧🇭' },
    { code: 'OMR', symbol: 'ر.ع', nameEn: 'Omani Rial', nameAr: 'ريال عماني', rate: 0.385, flag: '🇴🇲' },
  ];

  const profitPlans = [
    { amount: '150', link: 'https://drive.google.com/file/d/1z7yLpiJ1UFtEWaaaFhVuYGygOQg8MSVN/view?usp=sharing' },
    { amount: '250', link: 'https://drive.google.com/file/d/1Ttmyi1vLTZCTeQY9lYVDDvpLEA7Fx_9o/view?usp=sharing' },
    { amount: '400', link: 'https://drive.google.com/file/d/1tWkv-hI6FpNxrL5yuGUU-jdwzs2QCs-a/view?usp=sharing' },
    { amount: '500', link: 'https://drive.google.com/file/d/1SguLSLbQhzxfTQ5yWTRc0g19xyyURihy/view?usp=sharing' },
    { amount: '800', link: 'https://drive.google.com/file/d/1r1rCdK4_1BGWVCO2msQC6Bd7hzEdiwsV/view?usp=sharing' },
    { amount: '1000', link: 'https://drive.google.com/file/d/1mPe32kqBA_8Bq8Mic7vgXNMYH4laBL_r/view?usp=sharing' },
    { amount: '1300', link: 'https://drive.google.com/file/d/1JGBzoFBQdtVATccbSQGgIUUWeTXQQsLN/view?usp=sharing' },
    { amount: '1500', link: 'https://drive.google.com/file/d/1N6jRVT2i_3UN-XGmjYVfs3fb-1IGoIgD/view?usp=sharing' },
    { amount: '2000', link: 'https://drive.google.com/file/d/1sXbu95VGOaJrpbpd5isgmyLiQhNUf_Bb/view?usp=sharing' },
    { amount: '2600', link: 'https://drive.google.com/file/d/18MPMPV-9NffK_qjBwQqxaIjLMbXdvpR1/view?usp=sharing' },
    { amount: '3000', link: 'https://drive.google.com/file/d/186M5jx7ne08HPKT-40wpgnC8FSbJXkDw/view?usp=sharing' },
    { amount: '4000', link: 'https://drive.google.com/file/d/18xltHFlsOvGPWIuutvow8bTs0okRnFY0/view?usp=sharing' },
    { amount: '5000', link: 'https://drive.google.com/file/d/1HncwzgmQPSjlVaWBRDqHbbQ8AlbKV_tZ/view?usp=sharing' },
    { amount: '7000', link: 'https://drive.google.com/file/d/1AcyHycqxTebpOzY6GBS-BKTz951BAGuc/view?usp=sharing' },
    { amount: '8000', link: 'https://drive.google.com/file/d/1yJldDTXUVm6XPTk855UAUM1azDesyOhn/view?usp=sharing' },
    { amount: '10000', link: 'https://drive.google.com/file/d/1pk2ZatbN0mVuReoyIWcx6gehXr-K6N6v/view?usp=sharing' },
    { amount: '15000', link: 'https://drive.google.com/file/d/1jOMvrVA0y2fUpaSizl9oJhHh_kg-HEu6/view?usp=sharing' },
    { amount: '24000', link: 'https://drive.google.com/file/d/1XClJFJIUuhaQGMCe-vRaM5zpD8TNN3YS/view?usp=sharing' },
    { amount: '25000', link: 'https://drive.google.com/file/d/14VmaGXfHKx9lmvB3a1H5o8E403q9zxEm/view?usp=sharing' },
  ];

  const handlePlanPress = (planAmount: string) => {
    console.log(`User tapped on $${planAmount} profit plan card - navigating to registration`);
    router.push(`/registration?program=profit_plan&plan_amount=${planAmount}`);
  };

  const isCurrencySelected = (code: string) => selectedCurrency === code;
  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const currencyDisplayText = `${selectedCurrencyData?.flag} ${selectedCurrencyData?.code}`;

  const titleEn = 'Accumulated Profit Plans';
  const titleAr = 'خطط الربح التراكمي';
  const planPrice = 20;
  const tapToDownloadText = 'اضغط للتنزيل';
  const riskPercentage = 10;

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  const convertPrice = (usdPrice: number) => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    const convertedAmount = usdPrice * (currency?.rate || 1);
    const symbol = currency?.symbol || '$';
    return `${symbol}${convertedAmount.toFixed(2)}`;
  };

  const priceDisplay = convertPrice(planPrice);

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
      paddingBottom: 40,
    },
    headerSection: {
      padding: 24,
      paddingTop: 24,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    titleAr: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
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
      marginLeft: 12,
    },
    currencyButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      marginHorizontal: 6,
    },
    planCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 24,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: colors.border,
    },
    planHeader: {
      alignItems: 'center',
      marginBottom: 20,
    },
    planContent: {
      marginBottom: 24,
    },
    planDuration: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    riskPercentage: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    planDetails: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 20,
      marginBottom: 20,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    detailText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    priceSection: {
      alignItems: 'center',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginBottom: 12,
    },
    priceText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.highlight,
    },
    tapIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 8,
    },
    tapIndicatorText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.highlight,
      marginRight: 8,
    },
    disclaimerSection: {
      marginHorizontal: 24,
      marginTop: 8,
      padding: 20,
      backgroundColor: colors.accent,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#FFA500',
    },
    disclaimerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    disclaimerTitleContainer: {
      marginLeft: 12,
    },
    disclaimerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 2,
    },
    disclaimerTitleAr: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    disclaimerText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    disclaimerTextAr: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
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
            console.log('User tapped back button on profit plans page');
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
          <Text style={styles.headerTitle}>Profit Plans</Text>
          <Text style={styles.headerTitleAr}>خطط الربح</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Currency Button */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>{titleEn}</Text>
            <TouchableOpacity 
              style={styles.currencyButton}
              onPress={() => {
                console.log('User tapped currency selector on profit plans page');
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
          <Text style={styles.titleAr}>{titleAr}</Text>
        </View>

        {/* Render all 19 profit plans */}
        {profitPlans.map((plan, index) => {
          const planAmountText = `خطة ${plan.amount} دولار لمدة سنة`;
          const riskText = `نسبة المخاطرة ${riskPercentage}%`;
          
          return (
            <TouchableOpacity 
              key={index}
              style={styles.planCard}
              onPress={() => handlePlanPress(plan.amount)}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <IconSymbol 
                  ios_icon_name="chart.line.uptrend.xyaxis" 
                  android_material_icon_name="show-chart" 
                  size={32} 
                  color={colors.highlight} 
                />
              </View>

              <View style={styles.planContent}>
                <Text style={styles.planDuration}>{planAmountText}</Text>
                <Text style={styles.riskPercentage}>{riskText}</Text>
              </View>

              <View style={styles.planDetails}>
                <View style={styles.detailRow}>
                  <IconSymbol 
                    ios_icon_name="calendar" 
                    android_material_icon_name="calendar-today" 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                  <Text style={styles.detailText}>مدة سنة واحدة</Text>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol 
                    ios_icon_name="exclamationmark.triangle" 
                    android_material_icon_name="warning" 
                    size={20} 
                    color="#FFA500" 
                  />
                  <Text style={styles.detailText}>مخاطرة منخفضة - {riskPercentage}%</Text>
                </View>
              </View>

              {/* Price inside the card */}
              <View style={styles.priceSection}>
                <Text style={styles.priceText}>{priceDisplay}</Text>
              </View>

              {/* Tap to download indicator */}
              <View style={styles.tapIndicator}>
                <Text style={styles.tapIndicatorText}>{tapToDownloadText}</Text>
                <IconSymbol 
                  ios_icon_name="arrow.right" 
                  android_material_icon_name="arrow-forward" 
                  size={18} 
                  color={colors.highlight} 
                />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Performance Disclaimer */}
        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerHeader}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle.fill" 
              android_material_icon_name="warning" 
              size={24} 
              color="#FFA500" 
            />
            <View style={styles.disclaimerTitleContainer}>
              <Text style={styles.disclaimerTitle}>Important Notice</Text>
              <Text style={styles.disclaimerTitleAr}>إشعار مهم</Text>
            </View>
          </View>
          <Text style={styles.disclaimerText}>
            Past performance is not indicative of future results. All trading involves risk, and you should never invest more than you can afford to lose.
          </Text>
          <Text style={styles.disclaimerTextAr}>
            الأداء السابق لا يدل على النتائج المستقبلية. جميع عمليات التداول تنطوي على مخاطر، ويجب ألا تستثمر أكثر مما يمكنك تحمل خسارته.
          </Text>
        </View>
      </ScrollView>

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
                      console.log('User selected currency on profit plans page:', currency.code);
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
