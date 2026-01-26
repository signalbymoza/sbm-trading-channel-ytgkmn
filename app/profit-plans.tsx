
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Platform, TouchableOpacity, Modal } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";

export default function ProfitPlansScreen() {
  const router = useRouter();
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

  const handlePlanPress = () => {
    console.log('User tapped on profit plan card - navigating to registration');
    router.push('/registration?program=profit_plan');
  };

  const isCurrencySelected = (code: string) => selectedCurrency === code;
  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const currencyDisplayText = `${selectedCurrencyData?.flag} ${selectedCurrencyData?.code}`;

  const titleEn = 'Accumulated Profit Plans';
  const titleAr = 'خطط الربح التراكمي';
  const priceText = '0$';
  const planDuration = 'خطة 250 دولار لمدة سنة';
  const riskPercentage = 'نسبة المخاطرة 25%';
  const tapToDownloadText = 'اضغط للتنزيل';

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity 
          style={styles.currencyButton}
          onPress={() => {
            console.log('User tapped currency selector on profit plans page');
            setShowCurrencyModal(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.currencyButtonText}>{currencyDisplayText}</Text>
          <IconSymbol 
            ios_icon_name="chevron.down" 
            android_material_icon_name="arrow-drop-down" 
            size={18} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => {
            console.log('User tapped Subscriptions button');
            router.push('/subscription?channel=gold');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Subscriptions</Text>
          <Text style={styles.navButtonTextAr}>الاشتراكات</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Profit Plans</Text>
          <Text style={styles.navButtonTextAr}>خطط الربح</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => {
            console.log('User tapped Education button');
            router.push('/education');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Education</Text>
          <Text style={styles.navButtonTextAr}>التعليم</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{titleEn}</Text>
          <Text style={styles.titleAr}>{titleAr}</Text>
        </View>

        {/* Plan Card - Now Clickable */}
        <TouchableOpacity 
          style={styles.planCard}
          onPress={handlePlanPress}
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
            <Text style={styles.planDuration}>{planDuration}</Text>
            <Text style={styles.riskPercentage}>{riskPercentage}</Text>
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
              <Text style={styles.detailText}>مخاطرة متوسطة - 25%</Text>
            </View>
          </View>

          {/* Price inside the card */}
          <View style={styles.priceSection}>
            <Text style={styles.priceText}>{priceText}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'android' ? 60 : 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  currencyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  navButtonActive: {
    backgroundColor: colors.highlight,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  navButtonTextAr: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  titleAr: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
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
