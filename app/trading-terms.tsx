
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";

export default function TradingTermsScreen() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);

  console.log('TradingTermsScreen: Displaying trading training terms and conditions');

  const handleContinue = () => {
    if (!termsAccepted) {
      console.log('User must accept terms before continuing');
      return;
    }
    console.log('User accepted trading training terms, navigating to registration');
    router.push('/registration?channel=education&program=trading_training');
  };

  const registrationMechanismEn = 'Registration Mechanism:';
  const registrationMechanismAr = 'آلية التسجيل:';

  const importantNotesEn = 'Important Notes:';
  const importantNotesAr = 'ملاحظات مهمة:';

  const mechanismPoint1En = 'Please write your Telegram account correctly to confirm your subscription and ensure follow-up from the trainer.';
  const mechanismPoint1Ar = 'الرجاء كتابة حسابكم الخاص في تطبيق التيلقرام بشكل صحيح لتأكيد اشتراككم وضمان متابعة المدرب معكم.';

  const mechanismPoint2En = 'If you are unable to receive the PDF file, you can contact us via the support channel (here).';
  const mechanismPoint2Ar = 'في حال عدم تمكنكم من استلام ملف الـ PDF، يمكنكم التواصل معنا عبر قناة الدعم (هنا).';

  const note1En = 'No refunds after payment.';
  const note1Ar = 'لا يوجد استرداد للمبلغ بعد الدفع.';

  const note2En = 'Training and follow-up period is one month only. To renew, you can re-subscribe to the service for an additional month.';
  const note2Ar = 'مدة التدريب والمتابعة هي شهر واحد فقط. للتجديد، يمكنك إعادة الاشتراك في الخدمة لشهر إضافي.';

  const note3En = 'Training is conducted via Telegram, where you will be added to the courses channel.';
  const note3Ar = 'التدريب يتم عبر التلقرام، حيث سيتم إدخالك في القناة الخاصة بالكورسات.';

  const acceptTermsEn = 'I have read and accept the terms and conditions';
  const acceptTermsAr = 'لقد قرأت وأوافق على الشروط والأحكام';

  const continueButtonEn = 'Continue to Registration';
  const continueButtonAr = 'متابعة إلى التسجيل';

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="doc.text.fill" 
            android_material_icon_name="description" 
            size={48} 
            color={colors.highlight} 
          />
          <Text style={styles.title}>Trading Training from Scratch</Text>
          <Text style={styles.titleAr}>تعليم التداول من الصفر</Text>
          <Text style={styles.subtitle}>Terms and Conditions</Text>
          <Text style={styles.subtitleAr}>الشروط والأحكام</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={28} 
              color={colors.highlight} 
            />
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>{registrationMechanismEn}</Text>
              <Text style={styles.sectionTitleAr}>{registrationMechanismAr}</Text>
            </View>
          </View>

          <View style={styles.pointCard}>
            <View style={styles.pointNumber}>
              <Text style={styles.pointNumberText}>1</Text>
            </View>
            <View style={styles.pointContent}>
              <Text style={styles.pointText}>{mechanismPoint1En}</Text>
              <Text style={styles.pointTextAr}>{mechanismPoint1Ar}</Text>
            </View>
          </View>

          <View style={styles.pointCard}>
            <View style={styles.pointNumber}>
              <Text style={styles.pointNumberText}>2</Text>
            </View>
            <View style={styles.pointContent}>
              <Text style={styles.pointText}>{mechanismPoint2En}</Text>
              <Text style={styles.pointTextAr}>{mechanismPoint2Ar}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle.fill" 
              android_material_icon_name="warning" 
              size={28} 
              color={colors.warning} 
            />
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>{importantNotesEn}</Text>
              <Text style={styles.sectionTitleAr}>{importantNotesAr}</Text>
            </View>
          </View>

          <View style={styles.noteCard}>
            <IconSymbol 
              ios_icon_name="circle.fill" 
              android_material_icon_name="circle" 
              size={8} 
              color={colors.warning} 
            />
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>{note1En}</Text>
              <Text style={styles.noteTextAr}>{note1Ar}</Text>
            </View>
          </View>

          <View style={styles.noteCard}>
            <IconSymbol 
              ios_icon_name="circle.fill" 
              android_material_icon_name="circle" 
              size={8} 
              color={colors.warning} 
            />
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>{note2En}</Text>
              <Text style={styles.noteTextAr}>{note2Ar}</Text>
            </View>
          </View>

          <View style={styles.noteCard}>
            <IconSymbol 
              ios_icon_name="circle.fill" 
              android_material_icon_name="circle" 
              size={8} 
              color={colors.warning} 
            />
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>{note3En}</Text>
              <Text style={styles.noteTextAr}>{note3Ar}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => {
            console.log('User toggled terms acceptance:', !termsAccepted);
            setTermsAccepted(!termsAccepted);
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && (
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={18} 
                color={colors.text} 
              />
            )}
          </View>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxText}>{acceptTermsEn}</Text>
            <Text style={styles.checkboxTextAr}>{acceptTermsAr}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !termsAccepted && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!termsAccepted}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>{continueButtonEn}</Text>
          <Text style={styles.continueButtonTextAr}>{continueButtonAr}</Text>
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
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  titleAr: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitleAr: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  sectionTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  pointCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pointNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pointNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  pointContent: {
    flex: 1,
  },
  pointText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  pointTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteContent: {
    flex: 1,
    marginLeft: 12,
  },
  noteText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  noteTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  checkboxTextAr: {
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
