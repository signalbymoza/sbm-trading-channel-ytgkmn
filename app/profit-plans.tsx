
import React from "react";
import { StyleSheet, View, Text, ScrollView, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function ProfitPlansScreen() {
  console.log('ProfitPlansScreen: Rendering profit plans page');

  const profitPlans = [
    {
      title: 'Conservative Plan',
      targetReturn: '5-8%',
      riskLevel: 'Low',
      timeframe: 'Monthly',
      description: 'Ideal for risk-averse traders seeking steady, consistent returns with minimal drawdown.',
      features: [
        'Low-risk trading strategies',
        'Maximum 2% risk per trade',
        'Focus on major currency pairs',
        'Conservative position sizing',
      ],
    },
    {
      title: 'Balanced Plan',
      targetReturn: '10-15%',
      riskLevel: 'Medium',
      timeframe: 'Monthly',
      description: 'Perfect balance between risk and reward for traders seeking moderate growth.',
      features: [
        'Balanced risk-reward ratio',
        'Maximum 3% risk per trade',
        'Mix of major and minor pairs',
        'Diversified trading approach',
      ],
    },
    {
      title: 'Aggressive Plan',
      targetReturn: '20-30%',
      riskLevel: 'High',
      timeframe: 'Monthly',
      description: 'For experienced traders comfortable with higher risk for maximum profit potential.',
      features: [
        'High-reward opportunities',
        'Maximum 5% risk per trade',
        'All currency pairs and gold',
        'Active trading strategy',
      ],
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return colors.success;
      case 'Medium':
        return '#FFA500';
      case 'High':
        return '#FF6B6B';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Accumulated Profit Plans</Text>
          <Text style={styles.subtitle}>
            Choose a profit plan that matches your risk tolerance and investment goals. All plans include comprehensive risk management and expert guidance.
          </Text>
        </View>

        {/* Profit Plans */}
        <View style={styles.plansSection}>
          {profitPlans.map((plan, index) => {
            const riskColor = getRiskColor(plan.riskLevel);
            return (
              <View key={index} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                    <Text style={styles.riskBadgeText}>{plan.riskLevel} Risk</Text>
                  </View>
                </View>

                <View style={styles.planStats}>
                  <View style={styles.statItem}>
                    <IconSymbol 
                      ios_icon_name="chart.line.uptrend.xyaxis" 
                      android_material_icon_name="show-chart" 
                      size={24} 
                      color={colors.primary} 
                    />
                    <Text style={styles.statLabel}>Target Return</Text>
                    <Text style={styles.statValue}>{plan.targetReturn}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <IconSymbol 
                      ios_icon_name="clock.fill" 
                      android_material_icon_name="access-time" 
                      size={24} 
                      color={colors.primary} 
                    />
                    <Text style={styles.statLabel}>Timeframe</Text>
                    <Text style={styles.statValue}>{plan.timeframe}</Text>
                  </View>
                </View>

                <Text style={styles.planDescription}>{plan.description}</Text>

                <View style={styles.featuresSection}>
                  <Text style={styles.featuresTitle}>Key Features:</Text>
                  {plan.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureItem}>
                      <IconSymbol 
                        ios_icon_name="checkmark.circle.fill" 
                        android_material_icon_name="check-circle" 
                        size={20} 
                        color={colors.success} 
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
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
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
          </View>
          <Text style={styles.disclaimerText}>
            Past performance is not indicative of future results. All trading involves risk, and you should never invest more than you can afford to lose. The profit targets shown are estimates based on historical performance and market conditions.
          </Text>
          <Text style={styles.disclaimerText}>
            We recommend starting with the Conservative Plan if you are new to trading or have a lower risk tolerance. You can always upgrade to a more aggressive plan as you gain experience and confidence.
          </Text>
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoNumber}>
              <Text style={styles.infoNumberText}>1</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Choose Your Plan</Text>
              <Text style={styles.infoItemText}>
                Select a profit plan that aligns with your risk tolerance and goals
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoNumber}>
              <Text style={styles.infoNumberText}>2</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Receive Signals</Text>
              <Text style={styles.infoItemText}>
                Get daily trading signals tailored to your chosen plan
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoNumber}>
              <Text style={styles.infoNumberText}>3</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Execute & Track</Text>
              <Text style={styles.infoItemText}>
                Follow the signals and track your accumulated profits over time
              </Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  plansSection: {
    paddingHorizontal: 24,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  planDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresSection: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
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
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  disclaimerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoSection: {
    padding: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoItemText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
