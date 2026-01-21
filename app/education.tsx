
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";

export default function EducationScreen() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  console.log('EducationScreen: Rendering education programs page');

  const educationPrograms = [
    {
      id: 'analysis_training',
      titleEn: 'Analysis Training from Scratch',
      titleAr: 'تعليم التحليل من الصفر',
      descriptionEn: 'Comprehensive technical and fundamental analysis training for beginners',
      descriptionAr: 'تدريب شامل على التحليل الفني والأساسي للمبتدئين',
      icon: 'bar-chart',
      color: '#1E3A8A',
      features: [
        { en: 'Chart patterns and indicators', ar: 'أنماط الرسوم البيانية والمؤشرات' },
        { en: 'Support and resistance levels', ar: 'مستويات الدعم والمقاومة' },
        { en: 'Trend analysis techniques', ar: 'تقنيات تحليل الاتجاهات' },
        { en: 'Risk management basics', ar: 'أساسيات إدارة المخاطر' },
      ],
      price: '$299',
      duration: '8 weeks',
      durationAr: '8 أسابيع',
    },
    {
      id: 'trading_training',
      titleEn: 'Trading Training from Scratch',
      titleAr: 'تعليم التداول من الصفر',
      descriptionEn: 'Complete trading course from basics to advanced strategies',
      descriptionAr: 'دورة تداول كاملة من الأساسيات إلى الاستراتيجيات المتقدمة',
      icon: 'show-chart',
      color: '#3B82F6',
      priceAED: 'د.إ 606.00',
      priceUSD: '$165',
      duration: '1 month',
      durationAr: 'شهر واحد',
      features: [
        { en: 'Teaching the basics', ar: '١ – تعليم الاساسيات' },
        { en: 'Private follow-up from the trainer', ar: '٢ – متابعة خاصه من المدرب' },
        { en: 'Cumulative profit schedule', ar: '٣ – جدول الربح التراكمي' },
      ],
    },
    {
      id: 'instructions_service',
      titleEn: 'Instructions Service',
      titleAr: 'خدمة التعليمات',
      descriptionEn: 'Personalized guidance and support for your trading journey',
      descriptionAr: 'إرشاد ودعم شخصي لرحلة التداول الخاصة بك',
      icon: 'help',
      color: '#10B981',
      features: [
        { en: 'One-on-one mentoring', ar: 'إرشاد فردي' },
        { en: 'Trade review and feedback', ar: 'مراجعة الصفقات والملاحظات' },
        { en: 'Custom trading plan', ar: 'خطة تداول مخصصة' },
        { en: 'Direct messaging support', ar: 'دعم الرسائل المباشرة' },
      ],
      price: '$199/month',
      duration: 'Ongoing',
      durationAr: 'مستمر',
    },
  ];

  const handleProgramSelect = (programId: string) => {
    console.log('User selected education program:', programId);
    setSelectedProgram(programId);
  };

  const handleEnroll = () => {
    if (!selectedProgram) {
      console.log('No program selected');
      return;
    }
    console.log('User enrolling in program:', selectedProgram);
    router.push(`/registration?channel=education&program=${selectedProgram}`);
  };

  const selectedProgramData = educationPrograms.find(p => p.id === selectedProgram);

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
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="book.fill" 
            android_material_icon_name="menu-book" 
            size={48} 
            color={colors.highlight} 
          />
          <Text style={styles.title}>Education Programs</Text>
          <Text style={styles.titleAr}>برامج التعليم</Text>
          <Text style={styles.subtitle}>
            Master trading with our comprehensive education programs
          </Text>
          <Text style={styles.subtitleAr}>
            أتقن التداول مع برامجنا التعليمية الشاملة
          </Text>
        </View>

        {/* Programs Section */}
        <View style={styles.programsSection}>
          {educationPrograms.map((program, index) => {
            const isSelected = selectedProgram === program.id;
            const priceDisplay = program.priceAED || program.price;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.programCard,
                  isSelected && styles.programCardSelected,
                ]}
                onPress={() => handleProgramSelect(program.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected ? [program.color, colors.highlight] : [colors.card, colors.card]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.programGradient}
                >
                  <View style={styles.programHeader}>
                    <IconSymbol 
                      ios_icon_name={program.icon} 
                      android_material_icon_name={program.icon} 
                      size={40} 
                      color={isSelected ? colors.text : colors.highlight} 
                    />
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol 
                          ios_icon_name="checkmark.circle.fill" 
                          android_material_icon_name="check-circle" 
                          size={24} 
                          color={colors.success} 
                        />
                      </View>
                    )}
                  </View>

                  <Text style={[styles.programTitle, isSelected && styles.programTitleSelected]}>
                    {program.titleEn}
                  </Text>
                  <Text style={[styles.programTitleAr, isSelected && styles.programTitleArSelected]}>
                    {program.titleAr}
                  </Text>

                  <View style={styles.programInfo}>
                    <View style={styles.infoItem}>
                      <IconSymbol 
                        ios_icon_name="clock.fill" 
                        android_material_icon_name="access-time" 
                        size={20} 
                        color={isSelected ? colors.text : colors.highlight} 
                      />
                      <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoText, isSelected && styles.infoTextSelected]}>
                          {program.duration}
                        </Text>
                        <Text style={[styles.infoTextAr, isSelected && styles.infoTextArSelected]}>
                          {program.durationAr}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <IconSymbol 
                        ios_icon_name="tag.fill" 
                        android_material_icon_name="local-offer" 
                        size={20} 
                        color={isSelected ? colors.text : colors.highlight} 
                      />
                      <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
                        {priceDisplay}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featuresSection}>
                    <Text style={[styles.featuresTitle, isSelected && styles.featuresTitleSelected]}>
                      The service includes:
                    </Text>
                    <Text style={[styles.featuresTitleAr, isSelected && styles.featuresTitleArSelected]}>
                      الخدمة تشمل:
                    </Text>
                    {program.features.map((feature, featureIndex) => (
                      <View key={featureIndex} style={styles.featureItem}>
                        <IconSymbol 
                          ios_icon_name="checkmark.circle" 
                          android_material_icon_name="check-circle" 
                          size={18} 
                          color={isSelected ? colors.text : colors.success} 
                        />
                        <View style={styles.featureTextContainer}>
                          <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
                            {feature.en}
                          </Text>
                          <Text style={[styles.featureTextAr, isSelected && styles.featureTextArSelected]}>
                            {feature.ar}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Choose Our Education Programs?</Text>
          <Text style={styles.benefitsTitleAr}>لماذا تختار برامجنا التعليمية؟</Text>

          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={24} 
              color={colors.highlight} 
            />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>Expert instructors with years of trading experience</Text>
              <Text style={styles.benefitTextAr}>مدربون خبراء بسنوات من الخبرة في التداول</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="video.fill" 
              android_material_icon_name="videocam" 
              size={24} 
              color={colors.highlight} 
            />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>Video lessons and live sessions</Text>
              <Text style={styles.benefitTextAr}>دروس فيديو وجلسات مباشرة</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="doc.text.fill" 
              android_material_icon_name="description" 
              size={24} 
              color={colors.highlight} 
            />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>Comprehensive study materials and resources</Text>
              <Text style={styles.benefitTextAr}>مواد دراسية وموارد شاملة</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.seal.fill" 
              android_material_icon_name="verified" 
              size={24} 
              color={colors.highlight} 
            />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitText}>Certificate of completion</Text>
              <Text style={styles.benefitTextAr}>شهادة إتمام</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Enroll Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.enrollButton,
            !selectedProgram && styles.enrollButtonDisabled,
          ]}
          onPress={handleEnroll}
          disabled={!selectedProgram}
          activeOpacity={0.8}
        >
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
          <Text style={styles.enrollButtonTextAr}>سجل الآن</Text>
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
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  titleAr: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  subtitleAr: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  programsSection: {
    paddingHorizontal: 24,
  },
  programCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  programCardSelected: {
    borderColor: colors.highlight,
  },
  programGradient: {
    padding: 20,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedBadge: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 4,
  },
  programTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  programTitleSelected: {
    color: colors.text,
  },
  programTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  programTitleArSelected: {
    color: colors.text,
  },
  programInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoTextSelected: {
    color: colors.text,
  },
  infoTextAr: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoTextArSelected: {
    color: colors.text,
    opacity: 0.8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.highlight,
    marginLeft: 8,
  },
  priceTextSelected: {
    color: colors.text,
  },
  featuresSection: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  featuresTitleSelected: {
    color: colors.text,
  },
  featuresTitleAr: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  featuresTitleArSelected: {
    color: colors.text,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  featureTextSelected: {
    color: colors.text,
  },
  featureTextAr: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  featureTextArSelected: {
    color: colors.text,
    opacity: 0.85,
  },
  benefitsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  benefitsTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  benefitTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
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
  enrollButton: {
    backgroundColor: colors.highlight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  enrollButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  enrollButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 4,
  },
  enrollButtonTextAr: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
});
