
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";

export default function SubscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialChannel = params.channel as string;

  const [channelType, setChannelType] = useState<string>(initialChannel || 'gold');
  const [selectedDuration, setSelectedDuration] = useState<string>('');

  console.log('SubscriptionScreen: Channel type:', channelType);

  const channelInfo = {
    gold: {
      nameEn: 'Gold Channel',
      nameAr: 'قناة الذهب',
      color: '#1E3A8A',
      icon: 'star',
      iosIcon: 'star.fill',
    },
    forex: {
      nameEn: 'Forex Channel',
      nameAr: 'قناة الفوركس',
      color: '#3B82F6',
      icon: 'show-chart',
      iosIcon: 'chart.line.uptrend.xyaxis',
    },
    analysis: {
      nameEn: 'Analysis Channel',
      nameAr: 'قناة التحليل',
      color: '#10B981',
      icon: 'bar-chart',
      iosIcon: 'chart.bar.fill',
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

  const handleChannelSelect = (channel: string) => {
    console.log('User selected channel:', channel);
    setChannelType(channel);
    setSelectedDuration('');
  };

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
        {/* Choose Your Channel Section */}
        <View style={styles.channelsSection}>
          <Text style={styles.sectionTitle}>Select Your Channel</Text>
          <Text style={styles.sectionTitleAr}>اختر قناتك</Text>

          {/* Gold Channel */}
          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('gold')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1E3A8A', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.channelGradient,
                channelType === 'gold' && styles.channelGradientSelected,
              ]}
            >
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="star.fill" 
                  android_material_icon_name="star" 
                  size={40} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.channelTitle}>Gold Channel</Text>
              <Text style={styles.channelTitleAr}>قناة الذهب</Text>
              <Text style={styles.channelDescription}>
                Premium gold trading signals and analysis
              </Text>
              <Text style={styles.channelDescriptionAr}>
                إشارات وتحليلات تداول الذهب المتميزة
              </Text>
              <View style={styles.channelFeatures}>
                <Text style={styles.featureText}>• Daily signals | إشارات يومية</Text>
                <Text style={styles.featureText}>• Expert analysis | تحليل خبير</Text>
                <Text style={styles.featureText}>• 24/7 support | دعم على مدار الساعة</Text>
              </View>
              {channelType === 'gold' && (
                <View style={styles.selectedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={24} 
                    color={colors.success} 
                  />
                  <Text style={styles.selectedBadgeText}>Selected</Text>
                  <Text style={styles.selectedBadgeTextAr}>محدد</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Forex Channel */}
          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('forex')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1E3A8A', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.channelGradient,
                channelType === 'forex' && styles.channelGradientSelected,
              ]}
            >
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="chart.line.uptrend.xyaxis" 
                  android_material_icon_name="show-chart" 
                  size={40} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.channelTitle}>Forex Channel</Text>
              <Text style={styles.channelTitleAr}>قناة الفوركس</Text>
              <Text style={styles.channelDescription}>
                Professional forex trading insights
              </Text>
              <Text style={styles.channelDescriptionAr}>
                رؤى تداول الفوركس الاحترافية
              </Text>
              <View style={styles.channelFeatures}>
                <Text style={styles.featureText}>• Currency pairs | أزواج العملات</Text>
                <Text style={styles.featureText}>• Market updates | تحديثات السوق</Text>
                <Text style={styles.featureText}>• Risk management | إدارة المخاطر</Text>
              </View>
              {channelType === 'forex' && (
                <View style={styles.selectedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={24} 
                    color={colors.success} 
                  />
                  <Text style={styles.selectedBadgeText}>Selected</Text>
                  <Text style={styles.selectedBadgeTextAr}>محدد</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Analysis Channel */}
          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('analysis')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1E3A8A', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.channelGradient,
                channelType === 'analysis' && styles.channelGradientSelected,
              ]}
            >
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="chart.bar.fill" 
                  android_material_icon_name="bar-chart" 
                  size={40} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.channelTitle}>Analysis Channel</Text>
              <Text style={styles.channelTitleAr}>قناة التحليل</Text>
              <Text style={styles.channelDescription}>
                In-depth market analysis and research
              </Text>
              <Text style={styles.channelDescriptionAr}>
                تحليل وبحث متعمق للسوق
              </Text>
              <View style={styles.channelFeatures}>
                <Text style={styles.featureText}>• Technical analysis | التحليل الفني</Text>
                <Text style={styles.featureText}>• Market trends | اتجاهات السوق</Text>
                <Text style={styles.featureText}>• Weekly reports | تقارير أسبوعية</Text>
              </View>
              {channelType === 'analysis' && (
                <View style={styles.selectedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={24} 
                    color={colors.success} 
                  />
                  <Text style={styles.selectedBadgeText}>Selected</Text>
                  <Text style={styles.selectedBadgeTextAr}>محدد</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Channel Header */}
        <View style={[styles.channelHeader, { backgroundColor: currentChannel.color }]}>
          <IconSymbol 
            ios_icon_name={currentChannel.iosIcon} 
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
              <Text style={styles.featureTextMain}>Daily trading signals</Text>
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
              <Text style={styles.featureTextMain}>Expert market analysis</Text>
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
              <Text style={styles.featureTextMain}>24/7 Telegram support</Text>
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
              <Text style={styles.featureTextMain}>Risk management guidance</Text>
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
              <Text style={styles.featureTextMain}>Weekly performance reports</Text>
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
  channelsSection: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 72 : 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  channelCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  channelGradient: {
    padding: 24,
    minHeight: 220,
    position: 'relative',
  },
  channelGradientSelected: {
    borderWidth: 3,
    borderColor: colors.success,
  },
  channelIconContainer: {
    marginBottom: 12,
  },
  channelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  channelTitleAr: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  channelDescription: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
    opacity: 0.9,
  },
  channelDescriptionAr: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    opacity: 0.85,
  },
  channelFeatures: {
    marginTop: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    opacity: 0.9,
  },
  selectedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.success,
    marginLeft: 6,
    marginRight: 2,
  },
  selectedBadgeTextAr: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.success,
  },
  channelHeader: {
    padding: 32,
    alignItems: 'center',
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
  featureTextMain: {
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
