
import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminProfitPlansHelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    console.log('User tapped back button');
    router.back();
  };

  const titleEn = 'How to Upload Profit Plan Files';
  const titleAr = 'كيفية رفع ملفات خطط الربح';

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top + 16 : insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{titleEn}</Text>
          <Text style={styles.headerTitleAr}>{titleAr}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={28} 
              color={colors.highlight} 
            />
            <Text style={styles.sectionTitle}>Introduction</Text>
          </View>
          <Text style={styles.sectionTitleAr}>المقدمة</Text>
          <Text style={styles.paragraph}>
            This admin interface allows you to upload and manage profit plan PDF files. When users register for a profit plan, they will be able to download the corresponding file based on the plan amount they selected.
          </Text>
          <Text style={styles.paragraphAr}>
            تتيح لك واجهة الإدارة هذه رفع وإدارة ملفات PDF لخطط الربح. عندما يسجل المستخدمون في خطة ربح، سيتمكنون من تنزيل الملف المقابل بناءً على مبلغ الخطة الذي اختاروه.
          </Text>
        </View>

        {/* Step 1 */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Enter Plan Amount</Text>
          </View>
          <Text style={styles.stepTitleAr}>أدخل مبلغ الخطة</Text>
          <Text style={styles.stepDescription}>
            Enter the plan amount (e.g., 250, 500, 1000) in the first field. This should match the plan amounts available in your app.
          </Text>
          <Text style={styles.stepDescriptionAr}>
            أدخل مبلغ الخطة (مثل 250، 500، 1000) في الحقل الأول. يجب أن يتطابق هذا مع مبالغ الخطط المتاحة في تطبيقك.
          </Text>
        </View>

        {/* Step 2 */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Add Description (Optional)</Text>
          </View>
          <Text style={styles.stepTitleAr}>أضف وصفاً (اختياري)</Text>
          <Text style={styles.stepDescription}>
            You can add a description for the file to help you identify it later. This is optional.
          </Text>
          <Text style={styles.stepDescriptionAr}>
            يمكنك إضافة وصف للملف لمساعدتك في التعرف عليه لاحقاً. هذا اختياري.
          </Text>
        </View>

        {/* Step 3 */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Select PDF File</Text>
          </View>
          <Text style={styles.stepTitleAr}>اختر ملف PDF</Text>
          <Text style={styles.stepDescription}>
            Tap the "Select PDF File" button to choose the profit plan PDF from your device. Make sure the file is in PDF format.
          </Text>
          <Text style={styles.stepDescriptionAr}>
            اضغط على زر "اختيار ملف PDF" لاختيار ملف PDF لخطة الربح من جهازك. تأكد من أن الملف بصيغة PDF.
          </Text>
        </View>

        {/* Step 4 */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Upload File</Text>
          </View>
          <Text style={styles.stepTitleAr}>رفع الملف</Text>
          <Text style={styles.stepDescription}>
            Once you've selected a file and entered the plan amount, tap the "Upload File" button. The file will be uploaded to the database and will be available for users to download.
          </Text>
          <Text style={styles.stepDescriptionAr}>
            بمجرد اختيار ملف وإدخال مبلغ الخطة، اضغط على زر "رفع الملف". سيتم رفع الملف إلى قاعدة البيانات وسيكون متاحاً للمستخدمين للتنزيل.
          </Text>
        </View>

        {/* Important Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle.fill" 
              android_material_icon_name="warning" 
              size={28} 
              color="#FF9500" 
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
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>
                Each plan amount can have only one file. If you upload a new file for the same plan amount, you should delete the old one first.
              </Text>
              <Text style={styles.noteTextAr}>
                يمكن أن يكون لكل مبلغ خطة ملف واحد فقط. إذا قمت برفع ملف جديد لنفس مبلغ الخطة، يجب عليك حذف الملف القديم أولاً.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={20} 
              color={colors.success} 
            />
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>
                Make sure the file name is descriptive and matches the plan (e.g., "خطة الربح التراكمي 250$.pdf").
              </Text>
              <Text style={styles.noteTextAr}>
                تأكد من أن اسم الملف وصفي ويتطابق مع الخطة (مثل "خطة الربح التراكمي 250$.pdf").
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={20} 
              color={colors.success} 
            />
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>
                Users will see the file name when they download it, so use a professional and clear name.
              </Text>
              <Text style={styles.noteTextAr}>
                سيرى المستخدمون اسم الملف عند تنزيله، لذا استخدم اسماً احترافياً وواضحاً.
              </Text>
            </View>
          </View>

          <View style={styles.noteItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={20} 
              color={colors.success} 
            />
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteText}>
                You can view all uploaded files in the "Uploaded Files" section below the upload form.
              </Text>
              <Text style={styles.noteTextAr}>
                يمكنك عرض جميع الملفات المرفوعة في قسم "الملفات المرفوعة" أسفل نموذج الرفع.
              </Text>
            </View>
          </View>
        </View>

        {/* Example */}
        <View style={styles.exampleCard}>
          <View style={styles.exampleHeader}>
            <IconSymbol 
              ios_icon_name="lightbulb.fill" 
              android_material_icon_name="lightbulb" 
              size={24} 
              color="#FFD700" 
            />
            <Text style={styles.exampleTitle}>Example</Text>
          </View>
          <Text style={styles.exampleTitleAr}>مثال</Text>
          <Text style={styles.exampleText}>
            If you have a profit plan for $250, you would:
          </Text>
          <Text style={styles.exampleTextAr}>
            إذا كان لديك خطة ربح بقيمة 250 دولار، فستقوم بما يلي:
          </Text>
          <View style={styles.exampleSteps}>
            <Text style={styles.exampleStep}>1. Enter "250" in the Plan Amount field</Text>
            <Text style={styles.exampleStep}>2. Select your PDF file (e.g., "خطة الربح التراكمي 250$.pdf")</Text>
            <Text style={styles.exampleStep}>3. Tap "Upload File"</Text>
            <Text style={styles.exampleStep}>4. Users who register for the $250 plan will now be able to download this file</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    margin: 16,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  paragraphAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  stepCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.highlight,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  stepTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  stepDescriptionAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noteTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  noteText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  noteTextAr: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  exampleCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: colors.accent,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  exampleTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  exampleTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  exampleSteps: {
    paddingLeft: 8,
  },
  exampleStep: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 4,
  },
});
