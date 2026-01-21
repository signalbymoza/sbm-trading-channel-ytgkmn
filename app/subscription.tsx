
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";

export default function SubscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const channelType = params.channel as string;

  const [selectedDuration, setSelectedDuration] = useState<string>('');

  console.log('SubscriptionScreen: Channel type:', channelType);

  const channelInfo = {
    gold: {
      nameEn: 'Gold Channel',
      nameAr: 'قناة الذهب',
      color: '#1E3A8A',
      icon: 'star',
    },
    forex: {
      nameEn: 'Forex Channel',
      nameAr: 'قناة الفوركس',
      color: '#3B82F6',
      icon: 'show-chart',
    },
    analysis: {
      nameEn: 'Analysis Channel',
      nameAr: 'قناة التحليل',
      color: '#10B981',
      icon: 'bar-chart',
    },
  };

  const currentChannel = channelInfo[channelType as keyof typeof channelInfo] || channelInfo.gold;

  const subscriptionOptions = [
    {
      id: 'monthly',
      titleEn: 'Monthly',
      titleAr: 'شهري',
      duration: '1 Month',
      durationAr: 'شهر واحد',
      price: '$99',
      descriptionEn: 'Perfect for trying out our service',
      descriptionAr: 'مثالي لتجربة خدمتنا',
    },
    {
      id: 'three_months',
      titleEn: 'Three Months',
      titleAr: 'ثلاثة أشهر',
      duration: '3 Months',
      durationAr: '3 أشهر',
      price: '$249',
      descriptionEn: 'Best value - Save 15%',
      descriptionAr: 'أفضل قيمة - وفر 15%',
      badgeEn: 'POPULAR',
      badgeAr: 'الأكثر شعبية',
    },
    {
      id: 'annual',
      titleEn: 'Annual',
      titleAr: 'سنوي',
      duration: '12 Months',
      durationAr: '12 شهر',
      price: '$899',
      descriptionEn: 'Maximum savings - Save 25%',
      descriptionAr: 'أقصى توفير - وفر 25%',
      badgeEn: 'BEST VALUE',
      badgeAr: 'أفضل قيمة',
    },
  ];

  const handleContinue = () => {
    if (!selectedDuration) {
      console.log('No subscription duration selected');
      return;
    }
    console.log('User selected duration:', selectedDuration, 'for channel:', channelType);
    router.push(`/registration?channel=${channelType}&duration=${selectedDuration}`);
  };

  const isSelected = (id: string) => selectedDuration === id;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Channel Header */}
        <View style={[styles.channelHeader, { backgroundColor: currentChannel.color }]}>
          <IconSymbol 
            ios_icon_name={currentChannel.icon} 
            android_material_icon_name={currentChannel.icon} 
            size={48} 
            color="#FFFFFF" 
          />
          <Text style={styles.channelName}>{currentChannel.nameEn}</Text>
          <Text style={styles.channelNameAr}>{currentChannel.nameAr}</Text>
          <Text style={styles.channelSubtitle}>Choose your subscription plan</Text>
          <Text style={styles.channelSubtitleAr}>اختر خطة الاشتراك الخاصة بك</Text>
        </View>

        {/* Subscription Options */}
        <View style={styles.optionsSection}>
          {subscriptionOptions.map((option, index) => {
            const selected = isSelected(option.id);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                ]}
                onPress={() => {
                  console.log('User tapped subscription option:', option.id);
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

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What&apos;s Included:</Text>
          <Text style={styles.featuresTitleAr}>ما هو مشمول:</Text>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Daily trading signals</Text>
              <Text style={styles.featureTextAr}>إشارات تداول يومية</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Expert market analysis</Text>
              <Text style={styles.featureTextAr}>تحليل السوق الخبير</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>24/7 Telegram support</Text>
              <Text style={styles.featureTextAr}>دعم تيليجرام على مدار الساعة</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Risk management guidance</Text>
              <Text style={styles.featureTextAr}>إرشادات إدارة المخاطر</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Weekly performance reports</Text>
              <Text style={styles.featureTextAr}>تقارير الأداء الأسبوعية</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedDuration && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedDuration}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to Registration</Text>
          <Text style={styles.continueButtonTextAr}>متابعة إلى التسجيل</Text>
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
  channelHeader: {
    padding: 32,
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 48 : 0,
  },
  channelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 2,
  },
  channelNameAr: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  channelSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 2,
    opacity: 0.9,
  },
  channelSubtitleAr: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.85,
  },
  optionsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
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
    width: 24,
    height: 24,
    borderRadius: 12,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.highlight,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  featuresTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  featureTextAr: {
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
