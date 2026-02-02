
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import Modal from "@/components/ui/Modal";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChannelSuccessScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const channelType = params.channel as string;
  const insets = useSafeAreaInsets();
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

  // Get the appropriate Telegram channel link based on channel type
  const getTelegramLink = () => {
    if (channelType === 'gold') {
      return 'https://t.me/+9ckhkN9-kfJjZDk8';
    } else if (channelType === 'forex') {
      return 'https://t.me/+TvFioJaWC1g4YTE0';
    } else if (channelType === 'analysis') {
      return 'https://t.me/+r0gOBR1VpO80OTk0';
    }
    return 'https://t.me/+9ckhkN9-kfJjZDk8'; // Default fallback
  };

  const telegramLink = getTelegramLink();

  const handleJoinChannel = async () => {
    console.log('User tapped join channel button - opening Telegram link:', telegramLink);

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
  const backToHomeText = 'العودة إلى الصفحة الرئيسية';

  const channelNameEn = channelType === 'gold' ? 'Gold Channel' : channelType === 'forex' ? 'Forex Channel' : 'Analysis Channel';
  const channelNameAr = channelType === 'gold' ? 'قناة الذهب' : channelType === 'forex' ? 'قناة الفوركس' : 'قناة التحليل';

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPaddingTop + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={[styles.successIconCircle, { backgroundColor: colors.accent, borderColor: colors.success }]}>
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
          <Text style={[styles.successTitle, { color: colors.text }]}>{successTitleEn}</Text>
          <Text style={[styles.successTitleAr, { color: colors.text }]}>{successTitleAr}</Text>
          <Text style={[styles.successMessage, { color: colors.textSecondary }]}>{successMessageEn}</Text>
          <Text style={[styles.successMessageAr, { color: colors.textSecondary }]}>{successMessageAr}</Text>
        </View>

        {/* Channel Info */}
        <View style={styles.channelInfoSection}>
          <View style={[styles.channelBadge, { backgroundColor: colors.accent, borderColor: colors.primary }]}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={[styles.channelBadgeText, { color: colors.text }]}>{channelNameEn}</Text>
          </View>
          <View style={[styles.channelBadge, { backgroundColor: colors.accent, borderColor: colors.primary }]}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={[styles.channelBadgeText, { color: colors.text }]}>{channelNameAr}</Text>
          </View>
        </View>

        {/* Telegram Channel Access Section */}
        <View style={[styles.telegramSection, { backgroundColor: colors.card, borderColor: colors.highlight }]}>
          <View style={styles.telegramHeader}>
            <IconSymbol 
              ios_icon_name="paperplane.fill" 
              android_material_icon_name="send" 
              size={32} 
              color={colors.highlight} 
            />
            <View style={styles.telegramHeaderText}>
              <Text style={[styles.telegramTitle, { color: colors.text }]}>{channelAccessTitleEn}</Text>
              <Text style={[styles.telegramTitleAr, { color: colors.text }]}>{channelAccessTitleAr}</Text>
            </View>
          </View>

          <Text style={[styles.telegramDescription, { color: colors.textSecondary }]}>{channelAccessDescriptionEn}</Text>
          <Text style={[styles.telegramDescriptionAr, { color: colors.textSecondary }]}>{channelAccessDescriptionAr}</Text>

          {/* Join Channel Button - Only button, no URL display or copy button */}
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: colors.primary }]}
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
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <View style={[styles.featureItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureText, { color: colors.text }]}>Real-time trading signals</Text>
              <Text style={[styles.featureTextAr, { color: colors.textSecondary }]}>إشارات التداول في الوقت الفعلي</Text>
            </View>
          </View>

          <View style={[styles.featureItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureText, { color: colors.text }]}>Expert market analysis</Text>
              <Text style={[styles.featureTextAr, { color: colors.textSecondary }]}>تحليل السوق من الخبراء</Text>
            </View>
          </View>

          <View style={[styles.featureItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureText, { color: colors.text }]}>Daily market updates</Text>
              <Text style={[styles.featureTextAr, { color: colors.textSecondary }]}>تحديثات السوق اليومية</Text>
            </View>
          </View>

          <View style={[styles.featureItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.success} 
            />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureText, { color: colors.text }]}>Direct support from experts</Text>
              <Text style={[styles.featureTextAr, { color: colors.textSecondary }]}>دعم مباشر من الخبراء</Text>
            </View>
          </View>
        </View>

        {/* Important Note */}
        <View style={[styles.noteSection, { backgroundColor: colors.accent, borderColor: colors.highlight }]}>
          <View style={styles.noteHeader}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={24} 
              color={colors.highlight} 
            />
            <Text style={[styles.noteTitle, { color: colors.text }]}>Important Note</Text>
          </View>
          <Text style={[styles.noteText, { color: colors.text }]}>
            Please make sure you have Telegram installed on your device. If you don&apos;t have it, download it from your app store before joining the channel.
          </Text>
          <Text style={[styles.noteTextAr, { color: colors.text }]}>
            يرجى التأكد من تثبيت تيليجرام على جهازك. إذا لم يكن لديك، قم بتنزيله من متجر التطبيقات قبل الانضمام إلى القناة.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomButtonContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.highlight }]}
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  messageSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  successTitleAr: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 4,
  },
  successMessageAr: {
    fontSize: 15,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  channelBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  telegramSection: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
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
    marginBottom: 2,
  },
  telegramTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  telegramDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  telegramDescriptionAr: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  joinButtonText: {
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureTextAr: {
    fontSize: 14,
  },
  noteSection: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
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
    marginLeft: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  noteTextAr: {
    fontSize: 13,
    lineHeight: 20,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopWidth: 1,
  },
  backButton: {
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
