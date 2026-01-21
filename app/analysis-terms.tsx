
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";

export default function AnalysisTermsScreen() {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);

  console.log('AnalysisTermsScreen: Displaying terms and conditions for analysis training');

  const handleContinue = () => {
    if (!termsAccepted) {
      console.log('User must accept terms before continuing');
      return;
    }
    console.log('User accepted terms, navigating to registration');
    router.push('/registration?channel=education&program=analysis_training');
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
          <IconSymbol 
            ios_icon_name="doc.text.fill" 
            android_material_icon_name="description" 
            size={48} 
            color={colors.highlight} 
          />
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.titleAr}>قوانين وشروط تعليم مادة التحليل من الصفر</Text>
        </View>

        {/* Registration Rules Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="person.badge.plus" 
              android_material_icon_name="person-add" 
              size={28} 
              color={colors.highlight} 
            />
            <Text style={styles.sectionTitle}>Registration Rules</Text>
          </View>
          <Text style={styles.sectionTitleAr}>شروط التسجيل</Text>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>1</Text>
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleText}>
                Registration is available for a limited number (10 trainees only).
              </Text>
              <Text style={styles.ruleTextAr}>
                التسجيل متاح لعدد محدود (10 متدربين فقط).
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>2</Text>
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleText}>
                Registration period is from the 1st to the 5th day of every two months.
              </Text>
              <Text style={styles.ruleTextAr}>
                فترة التسجيل من اليوم الأول حتى اليوم الخامس من كل شهرين.
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>3</Text>
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleText}>
                Priority is given to those who complete registration and payment procedures first.
              </Text>
              <Text style={styles.ruleTextAr}>
                الأولوية لمن يكمل إجراءات التسجيل والدفع أولاً.
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>4</Text>
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleText}>
                Training duration is 2 months.
              </Text>
              <Text style={styles.ruleTextAr}>
                مدة التعليم شهرين.
              </Text>
            </View>
          </View>
        </View>

        {/* Teaching Mechanism Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="book.fill" 
              android_material_icon_name="menu-book" 
              size={28} 
              color={colors.highlight} 
            />
            <Text style={styles.sectionTitle}>Teaching Mechanism</Text>
          </View>
          <Text style={styles.sectionTitleAr}>آلية التعليم</Text>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>1</Text>
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleText}>
                Analysis training from scratch is conducted according to the analyst's agreement with trainees (number of sessions, times, topics).
              </Text>
              <Text style={styles.ruleTextAr}>
                يتم تعليم التحليل من الصفر حسب اتفاق المحللة مع المتدربين (عدد الجلسات، الأوقات، المحاور).
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>2</Text>
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleText}>
                All lessons are recorded on video and saved as a reference for trainees.
              </Text>
              <Text style={styles.ruleTextAr}>
                تُسجَّل جميع الدروس بالفيديو وتُحفظ كمرجع للمتدربين.
              </Text>
            </View>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>3</Text>
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleText}>
                Commitment to lesson schedules is essential, and any postponement is done in prior coordination with the analyst.
              </Text>
              <Text style={styles.ruleTextAr}>
                الالتزام بمواعيد الدروس شرط أساسي، وأي تأجيل يتم بالتنسيق المسبق مع المحللة.
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle.fill" 
              android_material_icon_name="warning" 
              size={28} 
              color={colors.warning} 
            />
            <Text style={styles.sectionTitle}>Important Notes</Text>
          </View>
          <Text style={styles.sectionTitleAr}>ملاحظات مهمة</Text>

          <View style={styles.noteItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={20} 
              color={colors.success} 
            />
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>Training with analyst Nour</Text>
              <Text style={styles.noteTextAr}>التعليم مع المحللة نور</Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <IconSymbol 
              ios_icon_name="person.2.fill" 
              android_material_icon_name="group" 
              size={20} 
              color={colors.highlight} 
            />
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>Seats are limited and non-expandable.</Text>
              <Text style={styles.noteTextAr}>المقاعد محدودة وغير قابلة للزيادة.</Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <IconSymbol 
              ios_icon_name="xmark.circle.fill" 
              android_material_icon_name="cancel" 
              size={20} 
              color={colors.error} 
            />
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>No refunds after the course starts.</Text>
              <Text style={styles.noteTextAr}>لا يمكن استرجاع المبلغ بعد بدء الدورة.</Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <IconSymbol 
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock" 
              size={20} 
              color={colors.highlight} 
            />
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>
                Lessons are recorded for educational purposes only and may not be shared outside the group.
              </Text>
              <Text style={styles.noteTextAr}>
                الدروس مسجلة لأغراض تعليمية فقط ولا يُسمح بمشاركتها خارج المجموعة.
              </Text>
            </View>
          </View>
        </View>

        {/* Terms Acceptance */}
        <View style={styles.acceptanceSection}>
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
                  color={colors.background} 
                />
              )}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabel}>
                I have read and agree to all terms and conditions
              </Text>
              <Text style={styles.checkboxLabelAr}>
                لقد قرأت ووافقت على جميع الشروط والأحكام
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button */}
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
          <Text style={styles.continueButtonText}>Continue to Registration</Text>
          <Text style={styles.continueButtonTextAr}>متابعة إلى التسجيل</Text>
          <IconSymbol 
            ios_icon_name="arrow.right" 
            android_material_icon_name="arrow-forward" 
            size={20} 
            color={termsAccepted ? colors.text : colors.textSecondary} 
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
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 60 : 32,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  sectionTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ruleNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  ruleContent: {
    flex: 1,
  },
  ruleText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  ruleTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
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
  noteContent: {
    flex: 1,
    marginLeft: 12,
  },
  noteText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  noteTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  acceptanceSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
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
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  checkboxLabelAr: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
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
