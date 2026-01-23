
import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Image, ImageSourcePropType } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  console.log('HomeScreen: Rendering SBM Trading Channels home screen');

  const handleProfitPlansPress = () => {
    console.log('User tapped Profit Plans button');
    router.push('/profit-plans');
  };

  const handleEducationPress = () => {
    console.log('User tapped Education button');
    router.push('/education-intro');
  };

  const handleEducationBasicsPress = () => {
    console.log('User tapped Education Basics service card');
    router.push('/education-intro');
  };

  const handleRecommendationChannelsPress = () => {
    console.log('User tapped Recommendation Channels service card');
    router.push('/subscription?channel=gold');
  };

  const handleDiscoverChannelsPress = () => {
    console.log('User tapped Discover Our Channels button');
    router.push('/subscription?channel=gold');
  };

  const mozaImage = require('@/assets/images/e3bdb5d2-af0c-4e7d-8cdf-b359833dae8e.jpeg');

  const topNavPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={[styles.topNav, { paddingTop: topNavPaddingTop }]}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/subscription-lookup')}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Check Status</Text>
          <Text style={styles.navButtonTextAr}>الاستعلام</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/brokers')}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Brokers</Text>
          <Text style={styles.navButtonTextAr}>البروكرات</Text>
        </TouchableOpacity>
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

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesSectionTitle}>تعرف على خدماتنا</Text>
          
          {/* Teaching Basics Service */}
          <TouchableOpacity 
            style={styles.serviceCard}
            onPress={handleEducationBasicsPress}
            activeOpacity={0.8}
          >
            <View style={styles.serviceIconContainer}>
              <IconSymbol 
                ios_icon_name="book.fill" 
                android_material_icon_name="menu-book" 
                size={32} 
                color={colors.highlight} 
              />
            </View>
            <Text style={styles.serviceTitle}>تعليم الأساسيات</Text>
            <Text style={styles.serviceDescription}>
              عند انضمامك إلى أحد باقاتنا، ستحصل على التعليم الشامل الذي يجهزك بكل الأساسيات لتصبح مؤهلاً لهذا المجال.
            </Text>
            <View style={styles.serviceFeatures}>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.featureItemText}>طريقة التأمين وحجز الأرباح</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.featureItemText}>طريقة إدارة راس المال</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.featureItemText}>تعليم التداول من الصفر</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.featureItemText}>جداول الربح التراكمي مناسب لـ راس المال</Text>
              </View>
            </View>
            <View style={styles.serviceButtonContainer}>
              <View style={styles.serviceButton}>
                <Text style={styles.serviceButtonText}>اكتشف باقاتنا</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Recommendations Channels Service */}
          <TouchableOpacity 
            style={styles.serviceCard}
            onPress={handleRecommendationChannelsPress}
            activeOpacity={0.8}
          >
            <View style={styles.serviceIconContainer}>
              <IconSymbol 
                ios_icon_name="chart.line.uptrend.xyaxis" 
                android_material_icon_name="show-chart" 
                size={32} 
                color={colors.highlight} 
              />
            </View>
            <Text style={styles.serviceTitle}>قنوات توصيات</Text>
            <Text style={styles.serviceDescription}>
              هي عبارة عن شراء او بيع تقدم من المحللة تتضمن التوصية نقطة الدخول والأهداف ووقف الخسارة
            </Text>
            <View style={styles.serviceFeatures}>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.featureItemText}>مجتمع متفاعل</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.featureItemText}>توصيات واخبار</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.serviceButton}
              onPress={handleDiscoverChannelsPress}
              activeOpacity={0.8}
            >
              <Text style={styles.serviceButtonText}>اكتشف قنواتنا</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Cumulative Profit Plans Service */}
          <View style={styles.serviceCard}>
            <View style={styles.serviceIconContainer}>
              <IconSymbol 
                ios_icon_name="chart.pie.fill" 
                android_material_icon_name="donut-large" 
                size={32} 
                color={colors.highlight} 
              />
            </View>
            <Text style={styles.serviceTitle}>خطط الربح التراكمي</Text>
            <Text style={styles.serviceDescription}>
              وضع خطط الربح التراكمي لمساعدة المتداولين في الاستمرار
            </Text>
            <View style={styles.serviceFeatures}>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={20} 
                  color={colors.highlight} 
                />
                <Text style={styles.featureItemText}>خطط مختلفة لجميع الأشخاص</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.serviceButton}
              onPress={handleProfitPlansPress}
              activeOpacity={0.8}
            >
              <Text style={styles.serviceButtonText}>حمل الخطط</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentSectionTitle}>Payment Methods</Text>
          <Text style={styles.paymentSectionTitleAr}>طرق الدفع</Text>
          <Text style={styles.paymentSectionDescription}>
            We accept the following payment methods for your convenience
          </Text>
          <Text style={styles.paymentSectionDescriptionAr}>
            نقبل طرق الدفع التالية لراحتك
          </Text>

          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <IconSymbol 
                ios_icon_name="creditcard.fill" 
                android_material_icon_name="credit-card" 
                size={32} 
                color={colors.highlight} 
              />
              <Text style={styles.paymentName}>tabby</Text>
            </View>
            <Text style={styles.paymentDescription}>
              Fast and secure digital payments. Instant processing with full buyer protection.
            </Text>
            <Text style={styles.paymentDescriptionAr}>
              مدفوعات رقمية سريعة وآمنة. معالجة فورية مع حماية كاملة للمشتري.
            </Text>
          </View>

          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <IconSymbol 
                ios_icon_name="creditcard.fill" 
                android_material_icon_name="credit-card" 
                size={32} 
                color={colors.highlight} 
              />
              <Text style={styles.paymentName}>Tamara</Text>
            </View>
            <Text style={styles.paymentDescription}>
              Buy now, pay later option. Split your payment into flexible installments with no interest.
            </Text>
            <Text style={styles.paymentDescriptionAr}>
              اشتري الآن وادفع لاحقاً. قسّم دفعتك إلى أقساط مرنة بدون فوائد.
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
          <View style={styles.paymentNote}>
            <IconSymbol 
              ios_icon_name="info.circle" 
              android_material_icon_name="info" 
              size={20} 
              color={colors.textSecondary} 
            />
            <Text style={styles.paymentNoteTextAr}>
              جميع المدفوعات تتم بشكل آمن. معلوماتك المالية محمية بتشفير معياري صناعي.
            </Text>
          </View>
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
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  servicesSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  servicesSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIconContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  serviceDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'right',
  },
  serviceFeatures: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureItemText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
  serviceButtonContainer: {
    marginTop: 8,
  },
  serviceButton: {
    backgroundColor: colors.highlight,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  serviceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  paymentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  paymentSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  paymentSectionTitleAr: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  paymentSectionDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  paymentSectionDescriptionAr: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
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
    marginBottom: 8,
  },
  paymentDescriptionAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'right',
  },
  paymentNote: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  paymentNoteText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  paymentNoteTextAr: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
    textAlign: 'right',
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
