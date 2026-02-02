
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiCall } from "@/utils/api";
import Modal from "@/components/ui/Modal";
import { useTheme } from "@/contexts/ThemeContext";

export default function BrokerRegistrationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const brokerId = params.brokerId as string;
  const brokerName = params.brokerName as string;

  console.log('BrokerRegistrationScreen: Rendering registration form for broker:', brokerName);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [brokerAccountNumber, setBrokerAccountNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    titleAr: string;
    message: string;
    messageAr: string;
    onConfirm?: () => void;
  }>({
    type: 'info',
    title: '',
    titleAr: '',
    message: '',
    messageAr: '',
  });

  const showModal = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    titleAr: string,
    message: string,
    messageAr: string,
    onConfirm?: () => void
  ) => {
    setModalConfig({ type, title, titleAr, message, messageAr, onConfirm });
    setModalVisible(true);
  };

  const handleBackPress = () => {
    console.log('User tapped back button on broker registration page');
    router.back();
  };

  const handleSubmit = async () => {
    console.log('User tapped submit button on broker registration form');
    console.log('Form data:', { fullName, email, telegramUsername, brokerAccountNumber, termsAccepted });

    // Validation
    if (!fullName.trim()) {
      showModal(
        'warning',
        'Error',
        'خطأ',
        'Please enter your full name',
        'يرجى إدخال الاسم الكامل'
      );
      return;
    }

    if (!email.trim()) {
      showModal(
        'warning',
        'Error',
        'خطأ',
        'Please enter your email',
        'يرجى إدخال البريد الإلكتروني'
      );
      return;
    }

    if (!email.includes('@')) {
      showModal(
        'warning',
        'Error',
        'خطأ',
        'Please enter a valid email',
        'يرجى إدخال بريد إلكتروني صحيح'
      );
      return;
    }

    if (!telegramUsername.trim()) {
      showModal(
        'warning',
        'Error',
        'خطأ',
        'Please enter your Telegram username',
        'يرجى إدخال يوزر التلقرام'
      );
      return;
    }

    if (!brokerAccountNumber.trim()) {
      showModal(
        'warning',
        'Error',
        'خطأ',
        'Please enter your broker account number',
        'يرجى إدخال رقم حساب البروكر'
      );
      return;
    }

    if (!termsAccepted) {
      showModal(
        'warning',
        'Error',
        'خطأ',
        'Please accept the terms and conditions',
        'يرجى الموافقة على الشروط والأحكام'
      );
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting broker registration to backend...');

    try {
      interface BrokerSubscriberResponse {
        id: string;
        name: string;
        email: string;
        accountNumber: string;
        brokerName: string;
        createdAt: string;
      }

      const data = await apiCall<BrokerSubscriberResponse>('/api/broker-subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          accountNumber: brokerAccountNumber.trim(),
          brokerName: brokerName,
        }),
      });

      console.log('Broker registration successful:', data.id);

      showModal(
        'success',
        'Registration Successful',
        'تم التسجيل بنجاح',
        'Thank you for registering. We will contact you shortly.',
        'شكراً لتسجيلك. سيتم التواصل معك قريباً.',
        () => {
          console.log('Registration successful, navigating back');
          router.back();
        }
      );
    } catch (error) {
      console.error('Error submitting broker registration:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to submit registration. Please try again.',
        'فشل إرسال التسجيل. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;
  const isButtonDisabled = !termsAccepted || isSubmitting;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPaddingTop, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Broker Registration</Text>
          <Text style={[styles.headerTitleAr, { color: colors.textSecondary }]}>تسجيل البروكر</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Broker Info */}
        <View style={styles.brokerInfoSection}>
          <Text style={[styles.brokerInfoTitle, { color: colors.text }]}>تسجيل حساب البروكر</Text>
          <Text style={[styles.brokerInfoText, { color: colors.textSecondary }]}>
            يرجى ملء البيانات التالية لتسجيل حسابك في بروكر {brokerName}
          </Text>
        </View>

        {/* Registration Form */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>الاسم الكامل</Text>
            <Text style={[styles.inputLabelEn, { color: colors.textSecondary }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="أدخل اسمك الكامل"
              placeholderTextColor={colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>البريد الإلكتروني</Text>
            <Text style={[styles.inputLabelEn, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="example@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Telegram Username */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>يوزر التلقرام</Text>
            <Text style={[styles.inputLabelEn, { color: colors.textSecondary }]}>Telegram Username</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="@username"
              placeholderTextColor={colors.textSecondary}
              value={telegramUsername}
              onChangeText={setTelegramUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Broker Account Number */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>رقم حساب البروكر</Text>
            <Text style={[styles.inputLabelEn, { color: colors.textSecondary }]}>Broker Account Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="أدخل رقم حسابك في البروكر"
              placeholderTextColor={colors.textSecondary}
              value={brokerAccountNumber}
              onChangeText={setBrokerAccountNumber}
              keyboardType="numeric"
            />
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }, termsAccepted && { backgroundColor: colors.highlight, borderColor: colors.highlight }]}>
              {termsAccepted && (
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={18} 
                  color="#FFFFFF" 
                />
              )}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={[styles.checkboxText, { color: colors.text }]}>أوافق على الشروط والأحكام</Text>
              <Text style={[styles.checkboxTextEn, { color: colors.textSecondary }]}>I agree to the terms and conditions</Text>
            </View>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: isButtonDisabled ? colors.border : colors.highlight }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isButtonDisabled}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check-circle" 
                  size={24} 
                  color="#FFFFFF" 
                />
                <Text style={styles.submitButtonText}>تسجيل</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Note */}
        <View style={[styles.infoNote, { backgroundColor: colors.accent }]}>
          <IconSymbol 
            ios_icon_name="info.circle" 
            android_material_icon_name="info" 
            size={20} 
            color={colors.textSecondary} 
          />
          <Text style={[styles.infoNoteText, { color: colors.textSecondary }]}>
            سيتم مراجعة بياناتك والتواصل معك عبر التلقرام خلال 24 ساعة.
          </Text>
        </View>
      </ScrollView>

      {/* Custom Modal for feedback */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        titleAr={modalConfig.titleAr}
        message={modalConfig.message}
        messageAr={modalConfig.messageAr}
        onConfirm={modalConfig.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
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
  },
  headerTitleAr: {
    fontSize: 16,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  brokerInfoSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  brokerInfoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  brokerInfoText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'right',
  },
  inputLabelEn: {
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    textAlign: 'right',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 15,
    textAlign: 'right',
  },
  checkboxTextEn: {
    fontSize: 13,
    marginTop: 2,
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  infoNote: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  infoNoteText: {
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
    textAlign: 'right',
  },
});
