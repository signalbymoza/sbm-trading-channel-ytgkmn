
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image, ImageSourcePropType } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedChannel, setSelectedChannel] = useState<string>('');

  console.log('SubscriptionScreen: Selected channel:', selectedChannel);

  const handleChannelSelect = (channel: string) => {
    console.log('User selected channel:', channel);
    setSelectedChannel(channel);
  };

  const handleContinue = () => {
    if (!selectedChannel) {
      console.log('No channel selected');
      return;
    }
    console.log('Navigating to duration selection for channel:', selectedChannel);
    router.push(`/duration-selection?channel=${selectedChannel}`);
  };

  const isSelected = (channel: string) => selectedChannel === channel;

  const selectChannelEn = 'Select Your Channel';
  const selectChannelAr = 'اختر قناتك';
  const goldChannelEn = 'Gold Channel';
  const goldChannelAr = 'قناة الذهب';
  const goldDescEn = 'Premium gold trading signals and analysis';
  const goldDescAr = 'إشارات وتحليلات تداول الذهب المتميزة';
  const forexChannelEn = 'Forex Channel';
  const forexChannelAr = 'قناة الفوركس';
  const forexDescEn = 'Professional forex trading insights';
  const forexDescAr = 'رؤى تداول الفوركس الاحترافية';
  const analysisChannelEn = 'Analysis Channel';
  const analysisChannelAr = 'قناة التحليل';
  const analysisDescEn = 'In-depth market analysis and research';
  const analysisDescAr = 'تحليل وبحث متعمق للسوق';
  const selectedEn = 'Selected';
  const selectedAr = 'محدد';
  const continueEn = 'Continue';
  const continueAr = 'متابعة';
  const dailySignalsEn = 'Daily signals';
  const dailySignalsAr = 'إشارات يومية';
  const expertAnalysisEn = 'Expert analysis';
  const expertAnalysisAr = 'تحليل خبير';
  const currencyPairsEn = 'Currency pairs';
  const currencyPairsAr = 'أزواج العملات';
  const marketUpdatesEn = 'Market updates';
  const marketUpdatesAr = 'تحديثات السوق';
  const riskManagementEn = 'Risk management';
  const riskManagementAr = 'إدارة المخاطر';
  const technicalAnalysisEn = 'Technical analysis';
  const technicalAnalysisAr = 'التحليل الفني';
  const marketTrendsEn = 'Market trends';
  const marketTrendsAr = 'اتجاهات السوق';
  const weeklyReportsEn = 'Weekly reports';
  const weeklyReportsAr = 'تقارير أسبوعية';

  const goldImage = require('@/assets/images/c7537b3e-42a7-48f9-b086-f546738d9198.jpeg');
  const analysisImage = require('@/assets/images/5b6830c9-bbf6-4851-a29d-a850f00e7461.jpeg');
  const forexImage = require('@/assets/images/b7c16854-1456-41a4-a077-3679e12666d7.jpeg');

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
    channelsSection: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    sectionTitleAr: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 24,
      textAlign: 'center',
    },
    channelCard: {
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      minHeight: 280,
      position: 'relative',
    },
    channelImageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    channelImage: {
      width: '100%',
      height: '100%',
    },
    channelImageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    channelContent: {
      padding: 24,
      minHeight: 280,
      position: 'relative',
      zIndex: 1,
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
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    featureText: {
      fontSize: 14,
      color: colors.text,
      marginRight: 4,
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
      color: '#10B981',
      marginLeft: 6,
      marginRight: 2,
    },
    selectedBadgeTextAr: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#10B981',
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

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on subscription page');
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
          <Text style={styles.headerTitle}>Subscriptions</Text>
          <Text style={styles.headerTitleAr}>الاشتراكات</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.channelsSection}>
          <Text style={styles.sectionTitle}>{selectChannelEn}</Text>
          <Text style={styles.sectionTitleAr}>{selectChannelAr}</Text>

          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('gold')}
            activeOpacity={0.8}
          >
            <View style={styles.channelImageContainer}>
              <Image 
                source={resolveImageSource(goldImage)} 
                style={styles.channelImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(30, 58, 138, 0.3)', 'rgba(59, 130, 246, 0.35)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.channelImageOverlay}
              />
            </View>
            <View style={styles.channelContent}>
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="star.fill" 
                  android_material_icon_name="star" 
                  size={40} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.channelTitle}>{goldChannelEn}</Text>
              <Text style={styles.channelTitleAr}>{goldChannelAr}</Text>
              <Text style={styles.channelDescription}>{goldDescEn}</Text>
              <Text style={styles.channelDescriptionAr}>{goldDescAr}</Text>
              <View style={styles.channelFeatures}>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{dailySignalsEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{dailySignalsAr}</Text>
                </View>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{expertAnalysisEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{expertAnalysisAr}</Text>
                </View>
              </View>
              {isSelected('gold') && (
                <View style={styles.selectedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={24} 
                    color="#10B981" 
                  />
                  <Text style={styles.selectedBadgeText}>{selectedEn}</Text>
                  <Text style={styles.selectedBadgeTextAr}>{selectedAr}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('forex')}
            activeOpacity={0.8}
          >
            <View style={styles.channelImageContainer}>
              <Image 
                source={resolveImageSource(forexImage)} 
                style={styles.channelImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(30, 58, 138, 0.3)', 'rgba(59, 130, 246, 0.35)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.channelImageOverlay}
              />
            </View>
            <View style={styles.channelContent}>
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="chart.line.uptrend.xyaxis" 
                  android_material_icon_name="show-chart" 
                  size={40} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.channelTitle}>{forexChannelEn}</Text>
              <Text style={styles.channelTitleAr}>{forexChannelAr}</Text>
              <Text style={styles.channelDescription}>{forexDescEn}</Text>
              <Text style={styles.channelDescriptionAr}>{forexDescAr}</Text>
              <View style={styles.channelFeatures}>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{currencyPairsEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{currencyPairsAr}</Text>
                </View>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{marketUpdatesEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{marketUpdatesAr}</Text>
                </View>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{riskManagementEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{riskManagementAr}</Text>
                </View>
              </View>
              {isSelected('forex') && (
                <View style={styles.selectedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={24} 
                    color="#10B981" 
                  />
                  <Text style={styles.selectedBadgeText}>{selectedEn}</Text>
                  <Text style={styles.selectedBadgeTextAr}>{selectedAr}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('analysis')}
            activeOpacity={0.8}
          >
            <View style={styles.channelImageContainer}>
              <Image 
                source={resolveImageSource(analysisImage)} 
                style={styles.channelImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(30, 58, 138, 0.3)', 'rgba(59, 130, 246, 0.35)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.channelImageOverlay}
              />
            </View>
            <View style={styles.channelContent}>
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="chart.bar.fill" 
                  android_material_icon_name="bar-chart" 
                  size={40} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.channelTitle}>{analysisChannelEn}</Text>
              <Text style={styles.channelTitleAr}>{analysisChannelAr}</Text>
              <Text style={styles.channelDescription}>{analysisDescEn}</Text>
              <Text style={styles.channelDescriptionAr}>{analysisDescAr}</Text>
              <View style={styles.channelFeatures}>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{technicalAnalysisEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{technicalAnalysisAr}</Text>
                </View>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{marketTrendsEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{marketTrendsAr}</Text>
                </View>
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{weeklyReportsEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{weeklyReportsAr}</Text>
                </View>
              </View>
              {isSelected('analysis') && (
                <View style={styles.selectedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={24} 
                    color="#10B981" 
                  />
                  <Text style={styles.selectedBadgeText}>{selectedEn}</Text>
                  <Text style={styles.selectedBadgeTextAr}>{selectedAr}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedChannel && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedChannel}
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
