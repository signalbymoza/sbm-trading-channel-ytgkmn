
import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";

export default function EducationIntroScreen() {
  const router = useRouter();

  console.log('EducationIntroScreen: Rendering education introduction page');

  const handleLearnMore = () => {
    console.log('User tapped Learn More button - navigating to education programs');
    router.push('/education');
  };

  const handleStartTraining = () => {
    console.log('User tapped Start Training button - navigating to education programs');
    router.push('/education');
  };

  const features = [
    { textEn: 'Master trading fundamentals', textAr: 'إتقان أساسيات التداول' },
    { textEn: 'Private follow-up with trainer', textAr: 'متابعة خاصة مع المدرب' },
    { textEn: 'Cumulative profit schedule', textAr: 'جدول الربح التراكمي' },
    { textEn: 'Professional risk management', textAr: 'إدارة المخاطر باحترافية' },
    { textEn: 'Trade with confidence and discipline', textAr: 'التداول بثقة وانضباط' },
  ];

  const trainers = [
    {
      nameEn: 'Moza Al Balushi',
      nameAr: 'موزة البلوشي',
      descriptionEn: 'Owner of Signals by Moza channel, licensed analyst and internationally certified trainer. My goal is to spread knowledge and culture and prove that trading can change your life for the better.',
      descriptionAr: 'صاحبة قناة Signals by moza محللة مرخصه ومدربة معتمدة دُوليًا ، هدفي هو نشر العلم والثقافة وإثبات أن التداول قادر على تغيير حياتكم للأفضل .',
    },
    {
      nameEn: 'Omar Ibrahim Al Mazrouei',
      nameAr: 'عمر إبراهيم المزروعي',
      descriptionEn: 'Internationally certified trader and trainer with two years of trading experience. Understanding the basics and commitment equals success, financial stability, and a happy life.',
      descriptionAr: 'متداول ومدرب معتمد دوليًا خبرتي فالتداول سنتين ، فهم الاساسيات والالتزام يساوي نجاح واستقرار مادي وحياة سعيدة .',
    },
    {
      nameEn: 'Wafaa Al Ahbabi',
      nameAr: 'وفاء الأحبابي',
      descriptionEn: 'Trader, teacher, and internationally certified trainer with at least two years of trading experience. I always strive for development and excellence. My goal is to use simple language that beginner traders can understand.',
      descriptionAr: 'متداولة ومعلمة ومدربة مُعتمدة دوليًا، خبرة لا تقل عن سنتين في مجال التداول اسعى دائمًا للتطور والأفضل، هدفي هو استخدام لغة بسيطة يفهمها مبتدئ التداول .',
    },
  ];

  const paymentMethods = [
    {
      nameEn: 'Tabby',
      nameAr: 'تابي',
      descriptionEn: 'Split your payments into four installments',
      descriptionAr: 'قسم دفعاتك على اربع دفعات',
    },
    {
      nameEn: 'Tamara',
      nameAr: 'تمارا',
      descriptionEn: 'Split into four installments with no interest',
      descriptionAr: 'قسمها على اربع دفعات بدون فوائد',
    },
  ];

  return (
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
          onPress={() => router.push('/profit-plans')}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Profit Plans</Text>
          <Text style={styles.navButtonTextAr}>خطط الربح</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
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
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primary, colors.highlight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <IconSymbol 
            ios_icon_name="chart.line.uptrend.xyaxis" 
            android_material_icon_name="show-chart" 
            size={64} 
            color={colors.text} 
          />
          <Text style={styles.heroTitle}>Trade with Confidence and Professionalism</Text>
          <Text style={styles.heroTitleAr}>تداول بثقة واحترافية</Text>
          <Text style={styles.heroSubtitle}>
            Get personalized guidance to help you make informed trading decisions and achieve sustainable profits.
          </Text>
          <Text style={styles.heroSubtitleAr}>
            احصل على إرشاد فردي يساعدك في اتخاذ قرارات تداول مدروسة وتحقيق أرباح مستدامة.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={handleLearnMore}
            activeOpacity={0.8}
          >
            <Text style={styles.heroButtonText}>Learn About Our Services</Text>
            <Text style={styles.heroButtonTextAr}>تعرف على خدماتنا</Text>
            <IconSymbol 
              ios_icon_name="arrow.right" 
              android_material_icon_name="arrow-forward" 
              size={20} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Personal Training Service Features</Text>
          <Text style={styles.sectionTitleAr}>مميزات خدمة التدريب الشخصي</Text>

          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.checkmarkContainer}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={20} 
                  color={colors.success} 
                />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureText}>{feature.textEn}</Text>
                <Text style={styles.featureTextAr}>{feature.textAr}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartTraining}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Your Training Now</Text>
            <Text style={styles.startButtonTextAr}>ابدأ تدربيك الآن</Text>
            <IconSymbol 
              ios_icon_name="arrow.right" 
              android_material_icon_name="arrow-forward" 
              size={20} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>

        {/* Trainers Section */}
        <View style={styles.trainersSection}>
          <Text style={styles.sectionTitle}>Meet Your Favorite Trainer</Text>
          <Text style={styles.sectionTitleAr}>تعرف على مدربك المفضل</Text>

          {trainers.map((trainer, index) => (
            <View key={index} style={styles.trainerCard}>
              <View style={styles.trainerHeader}>
                <View style={styles.trainerAvatar}>
                  <IconSymbol 
                    ios_icon_name="person.fill" 
                    android_material_icon_name="person" 
                    size={40} 
                    color={colors.highlight} 
                  />
                </View>
                <View style={styles.trainerNameContainer}>
                  <Text style={styles.trainerName}>{trainer.nameEn}</Text>
                  <Text style={styles.trainerNameAr}>{trainer.nameAr}</Text>
                </View>
              </View>
              <Text style={styles.trainerDescription}>{trainer.descriptionEn}</Text>
              <Text style={styles.trainerDescriptionAr}>{trainer.descriptionAr}</Text>
            </View>
          ))}
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>New Payment Methods</Text>
          <Text style={styles.sectionTitleAr}>وسائل دفع جديدة</Text>

          {paymentMethods.map((method, index) => (
            <View key={index} style={styles.paymentCard}>
              <View style={styles.paymentIconContainer}>
                <IconSymbol 
                  ios_icon_name="creditcard.fill" 
                  android_material_icon_name="credit-card" 
                  size={32} 
                  color={colors.highlight} 
                />
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentName}>{method.nameEn}</Text>
                <Text style={styles.paymentNameAr}>{method.nameAr}</Text>
                <Text style={styles.paymentDescription}>{method.descriptionEn}</Text>
                <Text style={styles.paymentDescriptionAr}>{method.descriptionAr}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Final CTA */}
        <View style={styles.finalCTA}>
          <TouchableOpacity
            style={styles.finalButton}
            onPress={handleStartTraining}
            activeOpacity={0.8}
          >
            <Text style={styles.finalButtonText}>View Training Programs</Text>
            <Text style={styles.finalButtonTextAr}>عرض برامج التدريب</Text>
            <IconSymbol 
              ios_icon_name="arrow.right" 
              android_material_icon_name="arrow-forward" 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
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
  heroSection: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  heroTitleAr: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 4,
    opacity: 0.9,
  },
  heroSubtitleAr: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.85,
  },
  heroButton: {
    backgroundColor: colors.text,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 280,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 4,
  },
  heroButtonTextAr: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: colors.card,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionTitleAr: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  checkmarkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureTextAr: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  startButton: {
    backgroundColor: colors.highlight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 4,
  },
  startButtonTextAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  trainersSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 24,
  },
  trainerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  trainerNameContainer: {
    flex: 1,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  trainerNameAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.highlight,
  },
  trainerDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  trainerDescriptionAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  paymentSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: colors.card,
    marginBottom: 24,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentContent: {
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  paymentNameAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.highlight,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  paymentDescriptionAr: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  finalCTA: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  finalButton: {
    backgroundColor: colors.highlight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  finalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 4,
  },
  finalButtonTextAr: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
});
