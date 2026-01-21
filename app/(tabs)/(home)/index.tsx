import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";

export default function HomeScreen() {
  const router = useRouter();

  console.log('HomeScreen: Rendering SBM Trading Channels home screen');

  const handleChannelSelect = (channelType: string) => {
    console.log('User selected channel:', channelType);
    router.push(`/subscription?channel=${channelType}`);
  };

  const handleAboutPress = () => {
    console.log('User tapped About button');
    router.push('/about');
  };

  const handleProfitPlansPress = () => {
    console.log('User tapped Profit Plans button');
    router.push('/profit-plans');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.logo}>SBM</Text>
          <Text style={styles.tagline}>Premium Trading Channels</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to SBM Trading</Text>
          <Text style={styles.welcomeText}>
            Choose your premium trading channel and start your journey to financial success with expert analysis and signals.
          </Text>
        </View>

        {/* Channels Section */}
        <View style={styles.channelsSection}>
          <Text style={styles.sectionTitle}>Select Your Channel</Text>

          {/* Gold Channel */}
          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('gold')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#D4AF37', '#FFD700']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.channelGradient}
            >
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="star.fill" 
                  android_material_icon_name="star" 
                  size={40} 
                  color="#1A1A2E" 
                />
              </View>
              <Text style={styles.channelTitle}>Gold Channel</Text>
              <Text style={styles.channelDescription}>
                Premium gold trading signals and analysis
              </Text>
              <View style={styles.channelFeatures}>
                <Text style={styles.featureText}>• Daily signals</Text>
                <Text style={styles.featureText}>• Expert analysis</Text>
                <Text style={styles.featureText}>• 24/7 support</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Forex Channel */}
          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('forex')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#16213E', '#2A3F5F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.channelGradient}
            >
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="chart.line.uptrend.xyaxis" 
                  android_material_icon_name="show-chart" 
                  size={40} 
                  color="#D4AF37" 
                />
              </View>
              <Text style={styles.channelTitleLight}>Forex Channel</Text>
              <Text style={styles.channelDescriptionLight}>
                Professional forex trading insights
              </Text>
              <View style={styles.channelFeatures}>
                <Text style={styles.featureTextLight}>• Currency pairs</Text>
                <Text style={styles.featureTextLight}>• Market updates</Text>
                <Text style={styles.featureTextLight}>• Risk management</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Analysis Channel */}
          <TouchableOpacity 
            style={styles.channelCard}
            onPress={() => handleChannelSelect('analysis')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.channelGradient}
            >
              <View style={styles.channelIconContainer}>
                <IconSymbol 
                  ios_icon_name="chart.bar.fill" 
                  android_material_icon_name="bar-chart" 
                  size={40} 
                  color="#1A1A2E" 
                />
              </View>
              <Text style={styles.channelTitle}>Analysis Channel</Text>
              <Text style={styles.channelDescription}>
                In-depth market analysis and research
              </Text>
              <View style={styles.channelFeatures}>
                <Text style={styles.featureText}>• Technical analysis</Text>
                <Text style={styles.featureText}>• Market trends</Text>
                <Text style={styles.featureText}>• Weekly reports</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksSection}>
          <TouchableOpacity 
            style={styles.quickLinkButton}
            onPress={handleAboutPress}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="info.circle" 
              android_material_icon_name="info" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.quickLinkText}>About & Payment Methods</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickLinkButton}
            onPress={handleProfitPlansPress}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="chart.pie.fill" 
              android_material_icon_name="pie-chart" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.quickLinkText}>Accumulated Profit Plans</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 SBM Trading. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 2,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  channelsSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
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
    minHeight: 200,
  },
  channelIconContainer: {
    marginBottom: 12,
  },
  channelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  channelTitleLight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  channelDescription: {
    fontSize: 15,
    color: '#1A1A2E',
    marginBottom: 16,
    opacity: 0.8,
  },
  channelDescriptionLight: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
    opacity: 0.9,
  },
  channelFeatures: {
    marginTop: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 4,
    opacity: 0.8,
  },
  featureTextLight: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    opacity: 0.9,
  },
  quickLinksSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  quickLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickLinkText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
