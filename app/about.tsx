
import React from "react";
import { StyleSheet, View, Text, ScrollView, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  console.log('AboutScreen: Rendering about page');

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPaddingTop + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Owner Section */}
        <View style={styles.ownerSection}>
          <View style={styles.ownerImagePlaceholder}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account-circle" 
              size={80} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.ownerName}>Moza Al-Balushi</Text>
          <Text style={styles.ownerTitle}>Founder & Chief Trading Analyst</Text>
          <Text style={styles.ownerBio}>
            With over 10 years of experience in financial markets, Moza Al-Balushi has established herself as a leading expert in gold and forex trading. Her analytical approach combines technical analysis with fundamental market insights to deliver consistent results for subscribers.
          </Text>
        </View>

        {/* About SBM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About SBM Trading</Text>
          <Text style={styles.sectionText}>
            SBM Trading is a premium trading signals and analysis service dedicated to helping traders achieve their financial goals. We provide expert insights, real-time signals, and comprehensive market analysis across multiple trading channels.
          </Text>
          <Text style={styles.sectionText}>
            Our mission is to empower traders with the knowledge and tools they need to make informed trading decisions and maximize their profit potential in the financial markets.
          </Text>
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose SBM?</Text>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Expert Analysis</Text>
              <Text style={styles.featureDescription}>
                Professional market analysis from experienced traders
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="chart.line.uptrend.xyaxis" 
              android_material_icon_name="show-chart" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Proven Track Record</Text>
              <Text style={styles.featureDescription}>
                Consistent results with transparent performance history
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="person.2.fill" 
              android_material_icon_name="group" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Community Support</Text>
              <Text style={styles.featureDescription}>
                Active Telegram community with 24/7 support
              </Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="shield.fill" 
              android_material_icon_name="security" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Risk Management</Text>
              <Text style={styles.featureDescription}>
                Comprehensive risk management strategies included
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <Text style={styles.sectionText}>
            We accept the following payment methods for your convenience:
          </Text>

          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <IconSymbol 
                ios_icon_name="creditcard.fill" 
                android_material_icon_name="credit-card" 
                size={32} 
                color={colors.primary} 
              />
              <Text style={styles.paymentName}>Tappy</Text>
            </View>
            <Text style={styles.paymentDescription}>
              Fast and secure digital payments. Instant processing with full buyer protection.
            </Text>
          </View>

          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <IconSymbol 
                ios_icon_name="creditcard.fill" 
                android_material_icon_name="credit-card" 
                size={32} 
                color={colors.primary} 
              />
              <Text style={styles.paymentName}>Tamara</Text>
            </View>
            <Text style={styles.paymentDescription}>
              Buy now, pay later option. Split your payment into flexible installments with no interest.
            </Text>
          </View>

          <View style={styles.paymentNote}>
            <IconSymbol 
              ios_icon_name="info.circle" 
              android_material_icon_name="info" 
              size={20} 
              color={colors.textSecondary} 
            />
            <Text style={styles.paymentNoteText}>
              All payments are processed securely. Your financial information is protected with industry-standard encryption.
            </Text>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactItem}>
            <IconSymbol 
              ios_icon_name="envelope.fill" 
              android_material_icon_name="email" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.contactText}>support@sbmtrading.com</Text>
          </View>
          <View style={styles.contactItem}>
            <IconSymbol 
              ios_icon_name="paperplane.fill" 
              android_material_icon_name="send" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.contactText}>@SBMTrading on Telegram</Text>
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
  ownerSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ownerImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  ownerTitle: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: 16,
    fontWeight: '600',
  },
  ownerBio: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  paymentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  paymentNote: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  paymentNoteText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
  },
});
