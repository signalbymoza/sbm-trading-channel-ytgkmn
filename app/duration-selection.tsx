
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image, ImageSourcePropType } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

export default function DurationSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const channel = params.channel as string;
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

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
      image: require('@/assets/images/5b6830c9-bbf6-4851-a29d-a850f00e7461.jpeg'),
    },
  };

  const currentChannel = channelInfo[channel as keyof typeof channelInfo] || channelInfo.gold;

  const currencies = [
    { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
    { code: 'SAR', symbol: 'ر.س', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي' },
    { code: 'AED', symbol: 'د.إ', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي' },
    { code: 'QAR', symbol: 'ر.ق', nameEn: 'Qatari Riyal', nameAr: 'ريال قطري' },
    { code: 'BHD', symbol: 'د.ب', nameEn: 'Bahraini Dinar', nameAr: 'دينار بحريني' },
    { code: 'OMR', symbol: 'ر.ع', nameEn: 'Omani Rial', nameAr: 'ريال عماني' },
  ];

  const getDurationOptions = () => {
    if (channel === 'gold') {
      return [
        {
          id: 'monthly',
          titleEn: 'Monthly',
          titleAr: 'شهري',
          duration: '1 Month',
          durationAr: 'شهر واحد',
          price: '$115',
          descriptionEn: 'Perfect for trying out our service',
          descriptionAr: 'مثالي لتجربة خدمتنا',
        },
        {
          id: 'three_months',
          titleEn: 'Three Months',
          titleAr: 'ثلاثة أشهر',
          duration: '3 Months',
          durationAr: '3 أشهر',
          price: '$300',
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
          price: '$1100',
          descriptionEn: 'Maximum savings',
          descriptionAr: 'أقصى توفير',
          badgeEn: 'BEST VALUE',
          badgeAr: 'أفضل قيمة',
        },
      ];
    } else if (channel === 'forex') {
      return [
        {
          id: 'monthly',
          titleEn: 'Monthly',
          titleAr: 'شهري',
          duration: '1 Month',
          durationAr: 'شهر واحد',
          price: '$75',
          descriptionEn: 'Perfect for trying out our service',
          descriptionAr: 'مثالي لتجربة خدمتنا',
        },
        {
          id: 'three_months',
          titleEn: 'Three Months',
          titleAr: 'ثلاثة أشهر',
          duration: '3 Months',
          durationAr: '3 أشهر',
          price: '$200',
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
          price: '$750',
          descriptionEn: 'Maximum savings',
          descriptionAr: 'أقصى توفير',
          badgeEn: 'BEST VALUE',
          badgeAr: 'أفضل قيمة',
        },
      ];
    } else if (channel === 'analysis') {
      return [
        {
          id: 'monthly',
          titleEn: 'Monthly',
          titleAr: 'شهري',
          duration: '1 Month',
          durationAr: 'شهر واحد',
          price: '$55',
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
    
    if (channel === 'gold') {
      router.push(`/gold-terms?duration=${selectedDuration}&currency=${selectedCurrency}`);
    } else if (channel === 'forex') {
      router.push(`/forex-terms?duration=${selectedDuration}&currency=${selectedCurrency}`);
    } else if (channel === 'analysis') {
      router.push(`/analysis-channel-terms?duration=${selectedDuration}&currency=${selectedCurrency}`);
    }
  };

  const isDurationSelected = (id: string) => selectedDuration === id;
  const isCurrencySelected = (code: string) => selectedCurrency === code;

  const selectDurationEn = 'Select Subscription Duration';
  const selectDurationAr = 'اختر مدة الاشتراك';
  const selectCurrencyEn = 'Select Currency';
  const selectCurrencyAr = 'اختر العملة';
  const continueEn = 'Continue';
  const continueAr = 'متابعة';

  return (
    <View style={styles.container}>
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
          <Text style={styles.title}>{selectDurationEn}</Text>
          <Text style={styles.titleAr}>{selectDurationAr}</Text>
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

        <View style={styles.titleSection}>
          <Text style={styles.title}>{selectCurrencyEn}</Text>
          <Text style={styles.titleAr}>{selectCurrencyAr}</Text>
        </View>

        <View style={styles.currencySection}>
          {currencies.map((currency, index) => {
            const selected = isCurrencySelected(currency.code);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.currencyCard,
                  selected && styles.currencyCardSelected,
                ]}
                onPress={() => {
                  console.log('User selected currency:', currency.code);
                  setSelectedCurrency(currency.code);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.currencyContent}>
                  <Text style={[styles.currencySymbol, selected && styles.currencySymbolSelected]}>
                    {currency.symbol}
                  </Text>
                  <View style={styles.currencyInfo}>
                    <Text style={[styles.currencyCode, selected && styles.currencyCodeSelected]}>
                      {currency.code}
                    </Text>
                    <Text style={[styles.currencyName, selected && styles.currencyNameSelected]}>
                      {currency.nameEn}
                    </Text>
                    <Text style={[styles.currencyNameAr, selected && styles.currencyNameArSelected]}>
                      {currency.nameAr}
                    </Text>
                  </View>
                  <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
                    {selected && <View style={styles.radioButtonInner} />}
                  </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerCard: {
    marginTop: Platform.OS === 'android' ? 48 : 0,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  titleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
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
  currencySection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  currencyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  currencyCardSelected: {
    borderColor: colors.highlight,
    backgroundColor: colors.accent,
  },
  currencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 16,
    width: 50,
    textAlign: 'center',
  },
  currencySymbolSelected: {
    color: colors.highlight,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  currencyCodeSelected: {
    color: colors.highlight,
  },
  currencyName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  currencyNameSelected: {
    color: colors.text,
  },
  currencyNameAr: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  currencyNameArSelected: {
    color: colors.text,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioButtonSelected: {
    borderColor: colors.highlight,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
});
