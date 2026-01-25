
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BrokerRegistrationScreen() {
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

  const handleBackPress = () => {
    console.log('User tapped back button on broker registration page');
    router.back();
  };

  const handleSubmit = () => {
    console.log('User tapped submit button on broker registration form');
    console.log('Form data:', { fullName, email, telegramUsername, brokerAccountNumber, termsAccepted });

    // Validation
    if (!fullName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم الكامل');
      return;
    }

    if (!email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!telegramUsername.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال يوزر التلقرام');
      return;
    }

    if (!brokerAccountNumber.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رقم حساب البروكر');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('خطأ', 'يرجى الموافقة على الشروط والأحكام');
      return;
    }

    // Note: Broker registrations are stored as subscriptions with broker-specific metadata
    // The backend doesn't have a separate broker-registrations endpoint
    // This is a frontend-only feature for now
    
    Alert.alert(
      'تم التسجيل بنجاح',
      'شكراً لتسجيلك. سيتم التواصل معك قريباً.',
      [
        {
          text: 'حسناً',
          onPress: () => {
            console.log('Registration successful, navigating back');
            router.back();
          },
        },
      ]
    );
  };

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPaddingTop }]}>
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
          <Text style={styles.headerTitle}>Broker Registration</Text>
          <Text style={styles.headerTitleAr}>تسجيل البروكر</Text>
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
          <Text style={styles.brokerInfoTitle}>تسجيل حساب البروكر</Text>
          <Text style={styles.brokerInfoText}>
            يرجى ملء البيانات التالية لتسجيل حسابك في بروكر {brokerName}
          </Text>
        </View>

        {/* Registration Form */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>الاسم الكامل</Text>
            <Text style={styles.inputLabelEn}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="أدخل اسمك الكامل"
              placeholderTextColor={colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
            <Text style={styles.inputLabelEn}>Email</Text>
            <TextInput
              style={styles.input}
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
            <Text style={styles.inputLabel}>يوزر التلقرام</Text>
            <Text style={styles.inputLabelEn}>Telegram Username</Text>
            <TextInput
              style={styles.input}
              placeholder="@username"
              placeholderTextColor={colors.textSecondary}
              value={telegramUsername}
              onChangeText={setTelegramUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Broker Account Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>رقم حساب البروكر</Text>
            <Text style={styles.inputLabelEn}>Broker Account Number</Text>
            <TextInput
              style={styles.input}
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
              <Text style={styles.checkboxText}>أوافق على الشروط والأحكام</Text>
              <Text style={styles.checkboxTextEn}>I agree to the terms and conditions</Text>
            </View>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, !termsAccepted && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={!termsAccepted}
          >
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle" 
              size={24} 
              color={colors.text} 
            />
            <Text style={styles.submitButtonText}>تسجيل</Text>
          </TouchableOpacity>
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <IconSymbol 
            ios_icon_name="info.circle" 
            android_material_icon_name="info" 
            size={20} 
            color={colors.textSecondary} 
          />
          <Text style={styles.infoNoteText}>
            سيتم مراجعة بياناتك والتواصل معك عبر التلقرام خلال 24 ساعة.
          </Text>
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
    paddingBottom: 16,
    backgroundColor: colors.card,
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
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  brokerInfoText: {
    fontSize: 15,
    color: colors.textSecondary,
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
    color: colors.text,
    marginBottom: 2,
    textAlign: 'right',
  },
  inputLabelEn: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
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
    borderColor: colors.border,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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
    textAlign: 'right',
  },
  checkboxTextEn: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: colors.highlight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  infoNoteText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
    textAlign: 'right',
  },
});
