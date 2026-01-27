
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Linking } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import Modal from "@/components/ui/Modal";

export default function ChannelSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const channelType = params.channel as string;
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

  console.log('ChannelSuccessScreen: Registration successful for channel:', channelType);

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

  // Telegram channel invite link
  const telegramLink = 'https://t.me/+9ckhkN9-kfJjZDk8';

  const handleJoinChannel = async () => {
    console.log('User tapped join channel button - opening Telegram link');

    try {
      const canOpen = await Linking.canOpenURL(telegramLink);
      
      if (canOpen) {
        await Linking.openURL(telegramLink);
        showModal(
          'success',
          'Opening Telegram',
          'فتح تيليجرام',
          'The Telegram app will open. Click "Join" to access the channel.',
          'سيتم فتح تطبيق تيليجرام. انقر على "انضمام" للوصول إلى القناة.'
        );
      } else {
        showModal(
          'error',
          'Cannot Open Link',
          'لا يمكن فتح الرابط',
          'Unable to open Telegram. Please make sure Telegram is installed.',
          'غير قادر على فتح تيليجرام. يرجى التأكد من تثبيت تيليجرام.'
        );
      }
    } catch (error) {
      console.error('Error opening Telegram link:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to open Telegram. Please try again.',
        'فشل فتح تيليجرام. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleCopyLink = async () => {
    console.log('User tapped copy link button');
    
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(telegramLink);
        showModal(
          'success',
          'Link Copied',
          'تم نسخ الرابط',
          'The Telegram link has been copied to your clipboard.',
          'تم نسخ رابط تيليجرام إلى الحافظة الخاصة بك.'
        );
      } catch (error) {
        console.error('Error copying link:', error);
        showModal(
          'error',
          'Error',
          'خطأ',
          'Failed to copy link. Please try again.',
          'فشل نسخ الرابط. يرجى المحاولة مرة أخرى.'
        );
      }
    } else {
      // For native platforms, we'll just show the link in a modal
      showModal(
        'info',
        'Channel Link',
        'رابط القناة',
        telegramLink,
        telegramLink
      );
    }
  };

  const handleBackToHome = () => {
    console.log('User tapped back to home button');
    router.push('/(tabs)/(home)/');
  };

  const successTitleEn = 'Registration Successful!';
  const successTitleAr = 'تم التسجيل بنجاح!';
  const successMessageEn = 'Your subscription request has been submitted successfully. A confirmation email has been sent to your email address.';
  const successMessageAr = 'تم إرسال طلب الاشتراك الخاص بك بنجاح. تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني.';
  const channelAccessTitleEn = 'Join the Channel';
  const channelAccessTitleAr = 'انضم إلى القناة';
  const channelAccessDescriptionEn = 'Click the button below to join the Telegram channel and start receiving trading signals and analysis.';
  const channelAccessDescriptionAr = 'انقر على الزر أدناه للانضمام إلى قناة تيليجرام والبدء في تلقي إشارات التداول والتحليل.';
  const joinChannelButtonText = 'انضم إلى القناة';
  const copyLinkButtonText = 'نسخ الرابط';
  const backToHomeText = 'العودة إلى الصفحة الرئيسية';

  const channelNameEn = channelType === 'gold' ? 'Gold Channel' : channelType === 'forex' ? 'Forex Channel' : 'Analysis Channel';
  const channelNameAr = channelType === 'gold' ? 'قناة الذهب' : channelType === 'forex' ? 'قناة الفوركس' : 'قناة التحليل';

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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

        {/* Channel Info */}
        <View style={styles.channelInfoSection}>
          <View style={styles.channelBadge}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.channelBadgeText}>{channelNameEn}</Text>
          </View>
          <View style={styles.channelBadge}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.channelBadgeText}>{channelNameAr}</Text>
          </View>
        </View>

        {/* Telegram Channel Access Section */}
        <View style={styles.telegramSection}>
          <View style={styles.telegramHeader}>
            <IconSymbol 
              ios_icon_name="paperplane.fill" 
              android_material_icon_name="send" 
              size={32} 
              color={colors.highlight} 
            />
            <View style={styles.telegramHeaderText}>
              <Text style={styles.telegramTitle}>{channelAccessTitleEn}</Text>
              <Text style={styles.telegramTitleAr}>{channelAccessTitleAr}</Text>
            </View>
          </View>

          <Text style={styles.telegramDescription}>{channelAccessDescriptionEn}</Text>
          <Text style={styles.telegramDescriptionAr}>{channelAccessDescriptionAr}</Text>

          {/* Telegram Link Display */}
          <View style={styles.linkContainer}>
            <IconSymbol 
              ios_icon_name="link" 
              android_material_icon_name="link" 
              size={20} 
              color={colors.textSecondary} 
            />
            <Text style={styles.linkText} numberOfLines={1}>
              {telegramLink}
            </Text>
          </View>

          {/* Join Channel Button */}
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinChannel}
            activeOpacity={0.8}
          >
            <IconSymbol 
              ios_icon_name="paperplane.fill" 
              android_material_icon_name="send" 
              size={24} 
              color="#1A1A2E" 
            />
            <Text style={styles.joinButtonText}>{joinChannelButtonText}</Text>
          </TouchableOpacity>

          {/* Copy Link Button */}
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyLink}
            activeOpacity={0.8}
          >
            <IconSymbol 
              ios_icon_name="doc.on.doc" 
              android_material_icon_name="content-copy" 
              size={20} 
              color={colors.text} 
            />
            <Text style={styles.copyButtonText}>{copyLinkButtonText}</Text>
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
              <Text style={styles.featureText}>Real-time trading signals</Text>
              <Text style={styles.featureTextAr}>إشارات التداول في الوقت الفعلي</Text>
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
              <Text style={styles.featureText}>Expert market analysis</Text>
              <Text style={styles.featureTextAr}>تحليل السوق من الخبراء</Text>
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
              <Text style={styles.featureText}>Daily market updates</Text>
              <Text style={styles.featureTextAr}>تحديثات السوق اليومية</Text>
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
              <Text style={styles.featureText}>Direct support from experts</Text>
              <Text style={styles.featureTextAr}>دعم مباشر من الخبراء</Text>
            </View>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.noteSection}>
          <View style={styles.noteHeader}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={24} 
              color={colors.highlight} 
            />
            <Text style={styles.noteTitle}>Important Note</Text>
          </View>
          <Text style={styles.noteText}>
            Please make sure you have Telegram installed on your device. If you don't have it, download it from your app store before joining the channel.
          </Text>
          <Text style={styles.noteTextAr}>
            يرجى التأكد من تثبيت تيليجرام على جهازك. إذا لم يكن لديك، قم بتنزيله من متجر التطبيقات قبل الانضمام إلى القناة.
          </Text>
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
    paddingTop: Platform.OS === 'android' ? 60 : 40,
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
    marginBottom: 24,
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
  channelInfoSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  channelBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  telegramSection: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.highlight,
    marginBottom: 24,
  },
  telegramHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  telegramHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  telegramTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  telegramTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  telegramDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  telegramDescriptionAr: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  joinButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  joinButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginLeft: 8,
  },
  copyButton: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
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
  noteSection: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: colors.accent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.highlight,
    marginBottom: 24,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  noteText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  noteTextAr: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
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
