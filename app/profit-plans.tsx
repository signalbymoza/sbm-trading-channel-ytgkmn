
import React from "react";
import { StyleSheet, View, Text, ScrollView, Platform, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";

export default function ProfitPlansScreen() {
  const router = useRouter();

  console.log('ProfitPlansScreen: Rendering profit plans page');

  const titleEn = 'Accumulated Profit Plans';
  const titleAr = 'خطط الربح التراكمي';
  const planAmount = '250 دولار';
  const currentBalance = 'د.إ 0.00';
  const planDuration = 'خطة 250 دولار لمدة سنة';
  const riskPercentage = 'نسبة المخاطرة 25%';

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
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

        {/* Plan Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>{planAmount}</Text>
        </View>

        {/* Current Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceText}>{currentBalance}</Text>
        </View>

        {/* Plan Card */}
        <View style={styles.planCard}>
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
        </View>

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
    marginBottom: 12,
    textAlign: 'center',
  },
  amountSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.highlight,
    textAlign: 'center',
  },
  balanceSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
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
});
