
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image, ImageSourcePropType, Modal } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

export default function DurationSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const channel = params.channel as string;
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  console.log('DurationSelectionScreen: Channel:', channel, 'Duration:', selectedDuration, 'Currency:', selectedCurrency);

  const channelInfo = {
    gold: {
      nameEn: 'Gold Channel',
      nameAr: 'قناة الذهب',
      icon: 'star',
      iosIcon: 'star.fill',
      image: require('@/assets/images/c7537b3e-42a7-48f9-b086-f546738d9198.jpeg'),
    },
    forex: {
      nameEn: 'Forex Channel',
      nameAr: 'قناة الفوركس',
      icon: 'show-chart',
      iosIcon: 'chart.line.uptrend.xyaxis',
      image: require('@/assets/images/b7c16854-1456-41a4-a077-3679e12666d7.jpeg'),
    },
    analysis: {
      nameEn: 'Analysis Channel',
      nameAr: 'قناة التحليل',
      icon: 'bar-chart',
      iosIcon: 'chart.bar.fill',
      image: require('@/assets/images/e5c43145-66a8-49c3-8e3a-139638b2789a.jpeg'),
    },
  };

  const currentChannel = channelInfo[channel as keyof typeof channelInfo] || channelInfo.gold;

  const currencies = [
    { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي', rate: 1, flag: '🇺🇸' },
    { code: 'SAR', symbol: 'ر.س', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي', rate: 3.75, flag: '🇸🇦' },
    { code: 'AED', symbol: 'د.إ', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي', rate: 3.67, flag: '🇦🇪' },
    { code: 'QAR', symbol: 'ر.ق', nameEn: 'Qatari Riyal', nameAr: 'ريال قطري', rate: 3.64, flag: '🇶🇦' },
    { code: 'BHD', symbol: 'د.ب', nameEn: 'Bahraini Dinar', nameAr: 'دينار بحريني', rate: 0.376, flag: '🇧🇭' },
    { code: 'OMR', symbol: 'ر.ع', nameEn: 'Omani Rial', nameAr: 'ريال عماني', rate: 0.385, flag: '🇴🇲' },
  ];

  const getDurationOptions = () => {
    const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
    const rate = selectedCurrencyData?.rate || 1;
    const symbol = selectedCurrencyData?.symbol || '$';

    if (channel === 'gold') {
      const monthlyPrice = Math.round(115 * rate);
      const threeMonthPrice = Math.round(300 * rate);
      const annualPrice = Math.round(1100 * rate);

      return [
        {
          id: 'monthly',
          titleEn: 'Monthly',
          titleAr: 'شهري',
          duration: '1 Month',
          durationAr: 'شهر واحد',
          price: `${symbol}${monthlyPrice}`,
          descriptionEn: 'Perfect for trying out our service',
          descriptionAr: 'مثالي لتجربة خدمتنا',
        },
        {
          id: 'three_months',
          titleEn: 'Three Months',
          titleAr: 'ثلاثة أشهر',
          duration: '3 Months',
          durationAr: '3 أشهر',
          price: `${symbol}${threeMonthPrice}`,
          descriptionEn: 'Best value - Save money',
          descriptionAr: 'أفضل قيمة - وفر المال',
          badgeEn: 'POPULAR',
          badgeAr: 'الأكثر شعبية',
        },
        {
          id: 'annual',
          titleEn: 'Annual',
          titleAr: 'سنوي',
          duration: '12 Months',
          durationAr: '12 شهر',
          price: `${symbol}${annualPrice}`,
          descriptionEn: 'Maximum savings',
          descriptionAr: 'أقصى توفير',
          badgeEn: 'BEST VALUE',
          badgeAr: 'أفضل قيمة',
        },
      ];
    } else if (channel === 'forex') {
      const monthlyPrice = Math.round(75 * rate);
      const threeMonthPrice = Math.round(200 * rate);
      const annualPrice = Math.round(750 * rate);

      return [
        {
          id: 'monthly',
          titleEn: 'Monthly',
          titleAr: 'شهري',
          duration: '1 Month',
          durationAr: 'شهر واحد',
          price: `${symbol}${monthlyPrice}`,
          descriptionEn: 'Perfect for trying out our service',
          descriptionAr: 'مثالي لتجربة خدمتنا',
        },
        {
          id: 'three_months',
          titleEn: 'Three Months',
          titleAr: 'ثلاثة أشهر',
          duration: '3 Months',
          durationAr: '3 أشهر',
          price: `${symbol}${threeMonthPrice}`,
          descriptionEn: 'Best value - Save money',
          descriptionAr: 'أفضل قيمة - وفر المال',
          badgeEn: 'POPULAR',
          badgeAr: 'الأكثر شعبية',
        },
        {
          id: 'annual',
          titleEn: 'Annual',
          titleAr: 'سنوي',
          duration: '12 Months',
          durationAr: '12 شهر',
          price: `${symbol}${annualPrice}`,
          descriptionEn: 'Maximum savings',
          descriptionAr: 'أقصى توفير',
          badgeEn: 'BEST VALUE',
          badgeAr: 'أفضل قيمة',
        },
      ];
    } else if (channel === 'analysis') {
      const monthlyPrice = Math.round(55 * rate);

      return [
        {
          id: 'monthly',
          titleEn: 'Monthly',
          titleAr: 'شهري',
          duration: '1 Month',
          durationAr: 'شهر واحد',
          price: `${symbol}${monthlyPrice}`,
          descriptionEn: 'Monthly subscription only',
          descriptionAr: 'اشتراك شهري فقط',
        },
      ];
    }
    return [];
  };

  const durationOptions = getDurationOptions();

  const handleContinue = () => {
    if (!selectedDuration || !selectedCurrency) {
      console.log('Duration or currency not selected');
      return;
    }
    console.log('User selected duration:', selectedDuration, 'currency:', selectedCurrency, 'for channel:', channel);
    
    const selectedOption = durationOptions.find(opt => opt.id === selectedDuration);
    const priceString = selectedOption?.price || '';
    // Extract numeric value from price string (e.g., "$115" -> "115")
    const priceValue = priceString.replace(/[^0-9.]/g, '');
    
    // Add program parameter for channel subscriptions
    router.push(`/registration?channel=${channel}&duration=${selectedDuration}&currency=${selectedCurrency}&price=${priceValue}&program=channel_subscription`);
  };

  const isDurationSelected = (id: string) => selectedDuration === id;
  const isCurrencySelected = (code: string) => selectedCurrency === code;

  const selectDurationEn = 'Select Subscription Duration';
  const selectDurationAr = 'اختر مدة الاشتراك';
  const continueEn = 'Continue';
  const continueAr = 'متابعة';
  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const currencyDisplayText = `${selectedCurrencyData?.flag} ${selectedCurrencyData?.code} (${selectedCurrencyData?.symbol})`;

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
    headerCard: {
      marginTop: 24,
      marginHorizontal: 24,
      marginBottom: 24,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      minHeight: 200,
      position: 'relative',
    },
    headerImageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    headerImage: {
      width: '100%',
      height: '100%',
    },
    headerImageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerContent: {
      padding: 24,
      minHeight: 200,
      position: 'relative',
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerIconContainer: {
      marginBottom: 12,
    },
    channelName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    channelNameAr: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    titleSection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    titleAr: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    currencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginLeft: 12,
    },
    currencyButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginRight: 4,
    },
    optionsSection: {
      paddingHorizontal: 24,
      paddingTop: 8,
    },
    optionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
      position: 'relative',
    },
    optionCardSelected: {
      borderColor: colors.highlight,
      backgroundColor: colors.accent,
    },
    badge: {
      position: 'absolute',
      top: -8,
      right: 16,
      backgroundColor: colors.highlight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    badgeTextAr: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    optionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    optionTitleContainer: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 2,
    },
    optionTitleSelected: {
      color: colors.highlight,
    },
    optionTitleAr: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    optionTitleArSelected: {
      color: colors.highlight,
    },
    optionDuration: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    optionDurationSelected: {
      color: colors.text,
    },
    optionDurationAr: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    optionDurationArSelected: {
      color: colors.text,
    },
    optionPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    optionPriceSelected: {
      color: colors.highlight,
    },
    optionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    optionDescriptionSelected: {
      color: colors.text,
    },
    optionDescriptionAr: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    optionDescriptionArSelected: {
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
      position: 'absolute',
      bottom: 20,
      right: 20,
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
    continueButton: {
      backgroundColor: colors.highlight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 18,
      borderRadius: 12,
    },
    continueButtonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    continueButtonText: {
      fontSize: 17,
      fontWeight: 'bold',
      color: colors.text,
      marginRight: 4,
    },
    continueButtonTextAr: {
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
  });

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on duration selection page');
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
          <Text style={styles.headerTitle}>Duration Selection</Text>
          <Text style={styles.headerTitleAr}>اختيار المدة</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerImageContainer}>
            <Image 
              source={resolveImageSource(currentChannel.image)} 
              style={styles.headerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(30, 58, 138, 0.3)', 'rgba(59, 130, 246, 0.35)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerImageOverlay}
            />
          </View>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <IconSymbol 
                ios_icon_name={currentChannel.iosIcon} 
                android_material_icon_name={currentChannel.icon} 
                size={48} 
                color="#FFFFFF" 
              />
            </View>
            <Text style={styles.channelName}>{currentChannel.nameEn}</Text>
            <Text style={styles.channelNameAr}>{currentChannel.nameAr}</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>{selectDurationEn}</Text>
              <Text style={styles.titleAr}>{selectDurationAr}</Text>
            </View>
            <TouchableOpacity 
              style={styles.currencyButton}
              onPress={() => {
                console.log('User tapped currency selector');
                setShowCurrencyModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.currencyButtonText}>{currencyDisplayText}</Text>
              <IconSymbol 
                ios_icon_name="chevron.down" 
                android_material_icon_name="arrow-drop-down" 
                size={20} 
                color={colors.text} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.optionsSection}>
          {durationOptions.map((option, index) => {
            const selected = isDurationSelected(option.id);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                ]}
                onPress={() => {
                  console.log('User tapped duration option:', option.id);
                  setSelectedDuration(option.id);
                }}
                activeOpacity={0.7}
              >
                {option.badgeEn && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{option.badgeEn}</Text>
                    <Text style={styles.badgeTextAr}>{option.badgeAr}</Text>
                  </View>
                )}
                <View style={styles.optionHeader}>
                  <View style={styles.optionTitleContainer}>
                    <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>
                      {option.titleEn}
                    </Text>
                    <Text style={[styles.optionTitleAr, selected && styles.optionTitleArSelected]}>
                      {option.titleAr}
                    </Text>
                    <Text style={[styles.optionDuration, selected && styles.optionDurationSelected]}>
                      {option.duration}
                    </Text>
                    <Text style={[styles.optionDurationAr, selected && styles.optionDurationArSelected]}>
                      {option.durationAr}
                    </Text>
                  </View>
                  <Text style={[styles.optionPrice, selected && styles.optionPriceSelected]}>
                    {option.price}
                  </Text>
                </View>
                <Text style={[styles.optionDescription, selected && styles.optionDescriptionSelected]}>
                  {option.descriptionEn}
                </Text>
                <Text style={[styles.optionDescriptionAr, selected && styles.optionDescriptionArSelected]}>
                  {option.descriptionAr}
                </Text>
                <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
                  {selected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedDuration || !selectedCurrency) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedDuration || !selectedCurrency}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>{continueEn}</Text>
          <Text style={styles.continueButtonTextAr}>{continueAr}</Text>
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
                      console.log('User selected currency:', currency.code);
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
