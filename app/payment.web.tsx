
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from '@/components/ui/Modal';

export default function PaymentScreenWeb() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const amount = params.amount as string;
  const currency = params.currency as string || 'USD';
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

  const displayAmount = parseFloat(amount).toFixed(2);
  const currencySymbol = currency === 'USD' ? '$' : currency;

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

  const handleContactForPayment = () => {
    showModal(
      'info',
      'Payment Instructions',
      'تعليمات الدفع',
      'Please contact us via Telegram or email to complete your payment. We support Tappy, Tamara, and bank transfers.',
      'يرجى الاتصال بنا عبر Telegram أو البريد الإلكتروني لإكمال الدفع. ندعم Tappy و Tamara والتحويلات البنكية.'
    );
  };

  const headerPaddingTop = insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on payment page (web)');
            router.back();
          }}
          activeOpacity={0.7}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerTitleAr}>الدفع</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountLabelAr}>المبلغ الإجمالي</Text>
          <Text style={styles.amountValue}>
            {currencySymbol}
            {displayAmount}
          </Text>
          <Text style={styles.currencyCode}>{currency}</Text>
        </View>

        <View style={styles.webNoticeSection}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={48} 
            color={colors.primary} 
          />
          <Text style={styles.webNoticeTitle}>Web Payment</Text>
          <Text style={styles.webNoticeTitleAr}>الدفع عبر الويب</Text>
          <Text style={styles.webNoticeMessage}>
            Card payments are available on our mobile app (iOS & Android). For web payments, please contact us directly.
          </Text>
          <Text style={styles.webNoticeMessageAr}>
            مدفوعات البطاقة متاحة على تطبيق الهاتف المحمول (iOS و Android). للدفع عبر الويب، يرجى الاتصال بنا مباشرة.
          </Text>
        </View>

        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Available Payment Methods</Text>
          <Text style={styles.sectionTitleAr}>طرق الدفع المتاحة</Text>

          <View style={styles.paymentMethodCard}>
            <IconSymbol 
              ios_icon_name="creditcard.fill" 
              android_material_icon_name="credit-card" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodName}>Tappy</Text>
              <Text style={styles.paymentMethodNameAr}>تابي</Text>
              <Text style={styles.paymentMethodDescription}>
                Fast and secure digital payments
              </Text>
              <Text style={styles.paymentMethodDescriptionAr}>
                مدفوعات رقمية سريعة وآمنة
              </Text>
            </View>
          </View>

          <View style={styles.paymentMethodCard}>
            <IconSymbol 
              ios_icon_name="calendar.badge.clock" 
              android_material_icon_name="schedule" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodName}>Tamara</Text>
              <Text style={styles.paymentMethodNameAr}>تمارا</Text>
              <Text style={styles.paymentMethodDescription}>
                Buy now, pay later in installments
              </Text>
              <Text style={styles.paymentMethodDescriptionAr}>
                اشتر الآن وادفع لاحقًا بالتقسيط
              </Text>
            </View>
          </View>

          <View style={styles.paymentMethodCard}>
            <IconSymbol 
              ios_icon_name="building.columns.fill" 
              android_material_icon_name="account-balance" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.paymentMethodContent}>
              <Text style={styles.paymentMethodName}>Bank Transfer</Text>
              <Text style={styles.paymentMethodNameAr}>تحويل بنكي</Text>
              <Text style={styles.paymentMethodDescription}>
                Direct bank transfer
              </Text>
              <Text style={styles.paymentMethodDescriptionAr}>
                تحويل بنكي مباشر
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactForPayment}
          activeOpacity={0.8}
        >
          <IconSymbol 
            ios_icon_name="message.fill" 
            android_material_icon_name="message" 
            size={24} 
            color="#1A1A2E" 
          />
          <Text style={styles.contactButtonText}>Contact Us to Pay</Text>
          <Text style={styles.contactButtonTextAr}>اتصل بنا للدفع</Text>
        </TouchableOpacity>

        <View style={styles.contactInfoSection}>
          <Text style={styles.contactInfoTitle}>Contact Information</Text>
          <Text style={styles.contactInfoTitleAr}>معلومات الاتصال</Text>
          
          <View style={styles.contactInfoItem}>
            <IconSymbol 
              ios_icon_name="paperplane.fill" 
              android_material_icon_name="send" 
              size={20} 
              color={colors.primary} 
            />
            <View style={styles.contactInfoTextContainer}>
              <Text style={styles.contactInfoLabel}>Telegram</Text>
              <Text style={styles.contactInfoValue}>@SBM_Trading</Text>
            </View>
          </View>

          <View style={styles.contactInfoItem}>
            <IconSymbol 
              ios_icon_name="envelope.fill" 
              android_material_icon_name="email" 
              size={20} 
              color={colors.primary} 
            />
            <View style={styles.contactInfoTextContainer}>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>support@sbmtrading.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.securitySection}>
          <IconSymbol 
            ios_icon_name="lock.shield.fill" 
            android_material_icon_name="security" 
            size={24} 
            color={colors.textSecondary} 
          />
          <View style={styles.securityTextContainer}>
            <Text style={styles.securityText}>Secure Payment</Text>
            <Text style={styles.securityTextAr}>دفع آمن</Text>
            <Text style={styles.securitySubtext}>
              All transactions are encrypted and secure
            </Text>
            <Text style={styles.securitySubtextAr}>
              جميع المعاملات مشفرة وآمنة
            </Text>
          </View>
        </View>
      </ScrollView>

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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
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
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.card,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  amountLabelAr: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  webNoticeSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginHorizontal: 24,
    marginTop: 24,
  },
  webNoticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  webNoticeTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  webNoticeMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  webNoticeMessageAr: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentMethodsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
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
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  paymentMethodContent: {
    flex: 1,
    marginLeft: 16,
  },
  paymentMethodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  paymentMethodNameAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  paymentMethodDescriptionAr: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  contactButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 24,
    flexDirection: 'row',
  },
  contactButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginLeft: 8,
    marginRight: 4,
  },
  contactButtonTextAr: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  contactInfoSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  contactInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  contactInfoTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  contactInfoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  contactInfoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  securityTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  securityText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  securityTextAr: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  securitySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  securitySubtextAr: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
