
import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";

export default function IntroScreen() {
  const router = useRouter();

  console.log('IntroScreen: Displaying introduction about Moza Al-Balushi');

  const handleContinue = () => {
    console.log('User tapped Continue to App button');
    router.replace('/(tabs)/(home)');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.logo}>SBM</Text>
            <Text style={styles.logoSubtitle}>Trading Channel</Text>
            <Text style={styles.logoSubtitleAr}>قناة التداول</Text>
          </View>
        </LinearGradient>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={48} 
              color={colors.highlight} 
            />
          </View>
          <Text style={styles.welcomeTitle}>Welcome to SBM Trading</Text>
          <Text style={styles.welcomeTitleAr}>مرحباً بك في SBM للتداول</Text>
        </View>

        {/* About Moza Section */}
        <View style={styles.aboutSection}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account-circle" 
              size={32} 
              color={colors.highlight} 
            />
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>About the Analyst</Text>
              <Text style={styles.sectionTitleAr}>عن المحللة</Text>
            </View>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileIconContainer}>
                <IconSymbol 
                  ios_icon_name="person.fill" 
                  android_material_icon_name="person" 
                  size={40} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Moza Al-Balushi</Text>
                <Text style={styles.profileNameAr}>موزة البلوشي</Text>
                <Text style={styles.profileTitle}>International Certified Trader & Analyst</Text>
                <Text style={styles.profileTitleAr}>متداولة ومحللة ومدربة معتمدة دولياً</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bioSection}>
              <Text style={styles.bioTitle}>Who is Moza Al-Balushi?</Text>
              <Text style={styles.bioTitleAr}>من هي موزة البلوشي؟</Text>
              
              <Text style={styles.bioText}>
                Moza Al-Balushi is a trader, analyst, and internationally certified trainer. Her goal is to spread knowledge and culture, proving that trading can change your life for the better, helping the world and guiding them to the right path.
              </Text>
              
              <Text style={styles.bioTextAr}>
                موزة البلوشي هي متداولة، محللة و مُدربه معتمده دُوليًا. هدفها هو نشر العلم والثقافة وإثبات أن التداول قادر على تغيير حياتكم للأفضل، ومساعدة العالم وتوجيههم للطريق الصحيح.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.visionSection}>
              <View style={styles.visionHeader}>
                <IconSymbol 
                  ios_icon_name="eye.fill" 
                  android_material_icon_name="visibility" 
                  size={24} 
                  color={colors.highlight} 
                />
                <Text style={styles.visionTitle}>Vision</Text>
                <Text style={styles.visionTitleAr}>الرؤية</Text>
              </View>
              
              <Text style={styles.visionText}>
                Her vision is to improve society&apos;s perception of the field, educate them, and guide them towards multiple sources of income.
              </Text>
              
              <Text style={styles.visionTextAr}>
                رؤيتها تتمثل في تحسين نظرة المجتمع عن المجال وتثقيفهم وتوجيههم لتعدد مصادر الدخل.
              </Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresSectionTitle}>What We Offer</Text>
          <Text style={styles.featuresSectionTitleAr}>ما نقدمه</Text>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <IconSymbol 
                ios_icon_name="chart.line.uptrend.xyaxis" 
                android_material_icon_name="show-chart" 
                size={28} 
                color={colors.highlight} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Expert Analysis</Text>
              <Text style={styles.featureTitleAr}>تحليل خبير</Text>
              <Text style={styles.featureDescription}>
                Professional market analysis and trading signals
              </Text>
              <Text style={styles.featureDescriptionAr}>
                تحليل احترافي للسوق وإشارات التداول
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <IconSymbol 
                ios_icon_name="book.fill" 
                android_material_icon_name="menu-book" 
                size={28} 
                color={colors.highlight} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Education Programs</Text>
              <Text style={styles.featureTitleAr}>برامج تعليمية</Text>
              <Text style={styles.featureDescription}>
                Comprehensive training courses for all levels
              </Text>
              <Text style={styles.featureDescriptionAr}>
                دورات تدريبية شاملة لجميع المستويات
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <IconSymbol 
                ios_icon_name="person.3.fill" 
                android_material_icon_name="group" 
                size={28} 
                color={colors.highlight} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Community Support</Text>
              <Text style={styles.featureTitleAr}>دعم المجتمع</Text>
              <Text style={styles.featureDescription}>
                Join a community of successful traders
              </Text>
              <Text style={styles.featureDescriptionAr}>
                انضم إلى مجتمع من المتداولين الناجحين
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <IconSymbol 
                ios_icon_name="chart.pie.fill" 
                android_material_icon_name="donut-large" 
                size={28} 
                color={colors.highlight} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Profit Plans</Text>
              <Text style={styles.featureTitleAr}>خطط الربح</Text>
              <Text style={styles.featureDescription}>
                Strategic plans for accumulated profits
              </Text>
              <Text style={styles.featureDescriptionAr}>
                خطط استراتيجية للأرباح المتراكمة
              </Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1E3A8A', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaButtonText}>Continue to App</Text>
              <Text style={styles.ctaButtonTextAr}>المتابعة إلى التطبيق</Text>
              <IconSymbol 
                ios_icon_name="arrow.right.circle.fill" 
                android_material_icon_name="arrow-forward" 
                size={24} 
                color="#FFFFFF" 
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 SBM Trading. All rights reserved.</Text>
          <Text style={styles.footerTextAr}>© 2024 SBM للتداول. جميع الحقوق محفوظة.</Text>
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
    paddingBottom: 40,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 6,
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 2,
    opacity: 0.95,
  },
  logoSubtitleAr: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeTitleAr: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  aboutSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  sectionTitleAr: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  profileNameAr: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  profileTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  profileTitleAr: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  bioSection: {
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  bioTitleAr: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  bioTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'right',
  },
  visionSection: {
    marginTop: 0,
  },
  visionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
  },
  visionTitleAr: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  visionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  visionTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'right',
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuresSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  featuresSectionTitleAr: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featureTitleAr: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 2,
  },
  featureDescriptionAr: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ctaButtonTextAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 24,
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
