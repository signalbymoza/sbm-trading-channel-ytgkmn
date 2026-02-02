
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Linking } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import Modal from "@/components/ui/Modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfitPlanSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const planAmount = params.plan_amount as string || '250';
  const insets = useSafeAreaInsets();
  const [isDownloading, setIsDownloading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    titleAr: string;
    message: string;
    messageAr: string;
  }>({
    type: 'info',
    title: '',
    titleAr: '',
    message: '',
    messageAr: '',
  });

  console.log('ProfitPlanSuccessScreen: Registration successful, showing download option for plan amount:', planAmount);

  const showModal = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    titleAr: string,
    message: string,
    messageAr: string
  ) => {
    setModalConfig({ type, title, titleAr, message, messageAr });
    setModalVisible(true);
  };

  const handleDownloadFile = async () => {
    console.log('User tapped download file button - opening Google Drive link');
    setIsDownloading(true);

    try {
      // Google Drive link for the profit plan file
      const googleDriveUrl = 'https://drive.google.com/file/d/1eCQ007FTirGiNHIo5GERDNUejlh1DlsM/view?usp=share_link';
      
      console.log('Opening Google Drive link:', googleDriveUrl);
      const canOpen = await Linking.canOpenURL(googleDriveUrl);
      
      if (canOpen) {
        await Linking.openURL(googleDriveUrl);
        showModal(
          'success',
          'Opening File',
          'فتح الملف',
          'The file will open in your browser or Google Drive app.',
          'سيتم فتح الملف في المتصفح أو تطبيق Google Drive.'
        );
      } else {
        showModal(
          'error',
          'Cannot Open Link',
          'لا يمكن فتح الرابط',
          'Unable to open the link. Please try again.',
          'غير قادر على فتح الرابط. يرجى المحاولة مرة أخرى.'
        );
      }
    } catch (error) {
      console.error('Error opening Google Drive link:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to open the file. Please try again.',
        'فشل فتح الملف. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBackToHome = () => {
    console.log('User tapped back to home button');
    router.push('/(tabs)/(home)/');
  };

  const successTitleEn = 'Registration Successful!';
  const successTitleAr = 'تم التسجيل بنجاح!';
  const successMessageEn = 'Your registration for the Accumulated Profit Plan has been submitted successfully. A confirmation email has been sent to your email address.';
  const successMessageAr = 'تم إرسال تسجيلك في خطة الربح التراكمي بنجاح. تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني.';
  const downloadTitleEn = 'Download Your Plan Document';
  const downloadTitleAr = 'قم بتنزيل مستند الخطة الخاص بك';
  const downloadDescriptionEn = 'Download the detailed plan document with all information about your profit plan.';
  const downloadDescriptionAr = 'قم بتنزيل مستند الخطة المفصل مع جميع المعلومات حول خطة الربح الخاصة بك.';
  const downloadButtonText = 'تنزيل الملف';
  const downloadingText = 'جاري الفتح...';
  const backToHomeText = 'العودة إلى الصفحة الرئيسية';

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPaddingTop + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIconCircle}>
            <IconSymbol 
              ios_icon_name="checkmark" 
              android_material_icon_name="check" 
              size={64} 
              color={colors.success} 
            />
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.messageSection}>
          <Text style={styles.successTitle}>{successTitleEn}</Text>
          <Text style={styles.successTitleAr}>{successTitleAr}</Text>
          <Text style={styles.successMessage}>{successMessageEn}</Text>
          <Text style={styles.successMessageAr}>{successMessageAr}</Text>
        </View>

        {/* Download Section */}
        <View style={styles.downloadSection}>
          <View style={styles.downloadHeader}>
            <IconSymbol 
              ios_icon_name="doc.fill" 
              android_material_icon_name="description" 
              size={32} 
              color={colors.highlight} 
            />
            <View style={styles.downloadHeaderText}>
              <Text style={styles.downloadTitle}>{downloadTitleEn}</Text>
              <Text style={styles.downloadTitleAr}>{downloadTitleAr}</Text>
            </View>
          </View>

          <Text style={styles.downloadDescription}>{downloadDescriptionEn}</Text>
          <Text style={styles.downloadDescriptionAr}>{downloadDescriptionAr}</Text>

          <TouchableOpacity
            style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
            onPress={handleDownloadFile}
            disabled={isDownloading}
            activeOpacity={0.8}
          >
            <IconSymbol 
              ios_icon_name="arrow.down.circle.fill" 
              android_material_icon_name="download" 
              size={24} 
              color="#1A1A2E" 
            />
            <Text style={styles.downloadButtonText}>
              {isDownloading ? downloadingText : downloadButtonText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Detailed profit plan strategy</Text>
              <Text style={styles.featureTextAr}>استراتيجية خطة الربح المفصلة</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Risk management guidelines</Text>
              <Text style={styles.featureTextAr}>إرشادات إدارة المخاطر</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Monthly performance tracking</Text>
              <Text style={styles.featureTextAr}>تتبع الأداء الشهري</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureText}>Direct support via Telegram</Text>
              <Text style={styles.featureTextAr}>دعم مباشر عبر تيليجرام</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <IconSymbol 
            ios_icon_name="house.fill" 
            android_material_icon_name="home" 
            size={20} 
            color="#1A1A2E" 
          />
          <Text style={styles.backButtonText}>{backToHomeText}</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal for feedback */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        titleAr={modalConfig.titleAr}
        message={modalConfig.message}
        messageAr={modalConfig.messageAr}
      />
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
  successIconContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.success,
  },
  messageSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  successTitleAr: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 4,
  },
  successMessageAr: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  downloadSection: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.highlight,
    marginBottom: 24,
  },
  downloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  downloadHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  downloadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  downloadTitleAr: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  downloadDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  downloadDescriptionAr: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  downloadButtonDisabled: {
    opacity: 0.5,
  },
  downloadButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginLeft: 8,
  },
  featuresSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    backgroundColor: colors.highlight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginLeft: 8,
  },
});
