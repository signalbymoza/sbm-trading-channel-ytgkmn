
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";

export default function ForexGuideTermsScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  console.log('ForexGuideTermsScreen: Displaying terms for Forex Guide');

  const handleContinue = () => {
    if (!accepted) {
      console.log('User must accept terms before continuing');
      return;
    }
    console.log('User accepted terms, navigating to registration');
    router.push('/forex-guide-registration');
  };

  const titleEn = 'Registration Process';
  const titleAr = 'آلية التسجيل';
  const importantNotesEn = 'Important Notes';
  const importantNotesAr = 'ملاحظات مهمة';
  const continueButtonEn = 'Continue to Registration';
  const continueButtonAr = 'متابعة إلى التسجيل';
  const acceptTermsEn = 'I have read and accept the terms';
  const acceptTermsAr = 'لقد قرأت وأوافق على الشروط';

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={48} 
            color={colors.highlight} 
          />
          <Text style={styles.title}>{titleEn}</Text>
          <Text style={styles.titleAr}>{titleAr}</Text>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.infoBox}>
            <IconSymbol 
              ios_icon_name="checkmark.circle" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>
                Please write your Telegram account correctly to confirm your subscription.
              </Text>
              <Text style={styles.infoTextAr}>
                الرجاء كتابة حسابكم الخاص في تطبيق التيلقرام بشكل صحيح لتأكيد اشتراككم.
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle" 
              android_material_icon_name="warning" 
              size={24} 
              color={colors.warning} 
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>
                If you are unable to receive the PDF file, you can contact us via the support channel (here).
              </Text>
              <Text style={styles.infoTextAr}>
                في حال عدم تمكنكم من استلام ملف الـ PDF، يمكنكم التواصل معنا عبر قناة الدعم (هنا).
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>{importantNotesEn}</Text>
          <Text style={styles.sectionTitleAr}>{importantNotesAr}</Text>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>
                The beginner&apos;s guide does not include a trainer.
              </Text>
              <Text style={styles.noteTextAr}>
                دليل المبتدئين لا يشمل المدرب.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>
                The content includes Forex basics only, and does not include analysis or recommendations.
              </Text>
              <Text style={styles.noteTextAr}>
                المحتوى يشمل أساسيات الفوركس فقط، ولا يتضمن تحليلات أو توصيات.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <View style={styles.bulletPoint} />
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>
                No refunds after payment.
              </Text>
              <Text style={styles.noteTextAr}>
                لا يوجد استرداد للمبلغ بعد الدفع.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.checkboxSection}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              console.log('User toggled terms acceptance:', !accepted);
              setAccepted(!accepted);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && (
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={18} 
                  color="#1A1A2E" 
                />
              )}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabel}>{acceptTermsEn}</Text>
              <Text style={styles.checkboxLabelAr}>{acceptTermsAr}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !accepted && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!accepted}
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
    paddingTop: Platform.OS === 'android' ? 60 : 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  titleAr: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  contentSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  infoTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  notesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.highlight,
    marginTop: 6,
  },
  noteTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  noteText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  noteTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  checkboxSection: {
    paddingHorizontal: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 16,
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
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  checkboxLabelAr: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
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
