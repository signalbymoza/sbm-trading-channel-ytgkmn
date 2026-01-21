
import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

export default function HomeScreen() {
  const router = useRouter();

  console.log('HomeScreen: Rendering SBM Trading Channels home screen (iOS)');

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

  const handleEducationPress = () => {
    console.log('User tapped Education button');
    router.push('/education-intro');
  };

  const mozaImage = require('@/assets/images/e3bdb5d2-af0c-4e7d-8cdf-b359833dae8e.jpeg');

  return (
    <>
      <Stack.Screen
        options={{
          title: "SBM Trading",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.highlight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/subscription?channel=gold')}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>Subscriptions</Text>
            <Text style={styles.navButtonTextAr}>الاشتراكات</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleProfitPlansPress}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>Profit Plans</Text>
            <Text style={styles.navButtonTextAr}>خطط الربح</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleEducationPress}
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
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.logo}>SBM</Text>
            <Text style={styles.tagline}>Premium Trading Channels</Text>
            <Text style={styles.taglineAr}>قنوات التداول المتميزة</Text>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to SBM Trading</Text>
            <Text style={styles.welcomeTitleAr}>مرحباً بك في SBM للتداول</Text>
            <Text style={styles.welcomeText}>
              Choose your premium trading channel and start your journey to financial success with expert analysis and signals.
            </Text>
            <Text style={styles.welcomeTextAr}>
              اختر قناة التداول المتميزة الخاصة بك وابدأ رحلتك نحو النجاح المالي مع التحليل والإشارات الخبيرة.
            </Text>
          </View>

          {/* About Moza Al-Balushi Section */}
          <View style={styles.aboutMozaSection}>
            <View style={styles.aboutMozaCard}>
              <Image 
                source={resolveImageSource(mozaImage)} 
                style={styles.mozaImage}
                resizeMode="cover"
              />
              <Text style={styles.aboutMozaTitle}>من هي موزة البلوشي؟</Text>
              <Text style={styles.aboutMozaText}>
                موزة البلوشي هي متداولة، محللة و مُدربه معتمده دُوليًا. هدفها هو نشر العلم والثقافة وإثبات أن التداول قادر على تغيير حياتكم للأفضل، ومساعدة العالم وتوجيههم للطريق الصحيح. رؤيتها تتمثل في تحسين نظرة المجتمع عن المجال وتثقيفهم وتوجيههم لتعدد مصادر الدخل.
              </Text>
            </View>
          </View>

          {/* Channels Section */}
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
                style={styles.channelGradient}
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
                style={styles.channelGradient}
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
                style={styles.channelGradient}
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
                color={colors.highlight} 
              />
              <View style={styles.quickLinkTextContainer}>
                <Text style={styles.quickLinkText}>About & Payment Methods</Text>
                <Text style={styles.quickLinkTextAr}>حول وطرق الدفع</Text>
              </View>
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
                color={colors.highlight} 
              />
              <View style={styles.quickLinkTextContainer}>
                <Text style={styles.quickLinkText}>Accumulated Profit Plans</Text>
                <Text style={styles.quickLinkTextAr}>خطط الربح المتراكم</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickLinkButton}
              onPress={handleEducationPress}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="book.fill" 
                android_material_icon_name="menu-book" 
                size={24} 
                color={colors.highlight} 
              />
              <View style={styles.quickLinkTextContainer}>
                <Text style={styles.quickLinkText}>Education Programs</Text>
                <Text style={styles.quickLinkTextAr}>برامج التعليم</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 SBM Trading. All rights reserved.</Text>
            <Text style={styles.footerTextAr}>© 2024 SBM للتداول. جميع الحقوق محفوظة.</Text>
          </View>
        </ScrollView>
      </View>
    </>
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
    color: colors.highlight,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    letterSpacing: 2,
  },
  taglineAr: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
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
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeTitleAr: {
    fontSize: 22,
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
    marginBottom: 8,
  },
  welcomeTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  aboutMozaSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  aboutMozaCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  mozaImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.highlight,
  },
  aboutMozaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutMozaText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  channelsSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  channelCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  channelGradient: {
    padding: 24,
    minHeight: 220,
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
  quickLinkTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  quickLinkText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickLinkTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
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
    marginBottom: 2,
  },
  footerTextAr: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
