
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";

export default function SubscriptionScreen() {
  const router = useRouter();
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
  const supportEn = '24/7 support';
  const supportAr = 'دعم على مدار الساعة';
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

  return (
    <View style={styles.container}>
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
            <LinearGradient
              colors={['#1E3A8A', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.channelGradient,
                isSelected('gold') && styles.channelGradientSelected,
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
                <View style={styles.featureRow}>
                  <Text style={styles.featureText}>•</Text>
                  <Text style={styles.featureText}>{supportEn}</Text>
                  <Text style={styles.featureText}>|</Text>
                  <Text style={styles.featureText}>{supportAr}</Text>
                </View>
              </View>
              {isSelected('gold') && (
                <View style={styles.selectedBadge}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check-circle" 
                    size={24} 
                    color={colors.success} 
                  />
                  <Text style={styles.selectedBadgeText}>{selectedEn}</Text>
                  <Text style={styles.selectedBadgeTextAr}>{selectedAr}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

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
                isSelected('forex') && styles.channelGradientSelected,
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
                    color={colors.success} 
                  />
                  <Text style={styles.selectedBadgeText}>{selectedEn}</Text>
                  <Text style={styles.selectedBadgeTextAr}>{selectedAr}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

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
                isSelected('analysis') && styles.channelGradientSelected,
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
                    color={colors.success} 
                  />
                  <Text style={styles.selectedBadgeText}>{selectedEn}</Text>
                  <Text style={styles.selectedBadgeTextAr}>{selectedAr}</Text>
                </View>
              )}
            </LinearGradient>
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
    color: colors.success,
    marginLeft: 6,
    marginRight: 2,
  },
  selectedBadgeTextAr: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.success,
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
