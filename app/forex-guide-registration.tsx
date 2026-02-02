
import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import * as ImagePicker from 'expo-image-picker';
import { uploadFile, apiCall } from "@/utils/api";
import Modal from "@/components/ui/Modal";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForexGuideRegistrationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [idDocument, setIdDocument] = useState<string | null>(null);
  const [documentFileName, setDocumentFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const isPickingRef = useRef(false);

  console.log('ForexGuideRegistrationScreen: Rendering registration form for Forex Guide');

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

  const handleUploadPress = async () => {
    if (isPickingRef.current) {
      console.log('Already picking a file, ignoring duplicate request');
      return;
    }

    console.log('User tapped upload ID document button - opening photo library');
    isPickingRef.current = true;
    
    try {
      console.log('Requesting photo library permissions...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      console.log('Permission result:', permissionResult);
      
      if (!permissionResult.granted) {
        console.log('Photo library permission denied');
        showModal(
          'warning',
          'Permission Required',
          'الإذن مطلوب',
          'Please allow access to your photo library in Settings to upload images.',
          'يرجى السماح بالوصول إلى مكتبة الصور في الإعدادات لتحميل الصور.'
        );
        isPickingRef.current = false;
        return;
      }

      console.log('Permission granted - opening image picker...');
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        exif: false,
      });

      console.log('Image picker result:', JSON.stringify(result, null, 2));

      if (result.canceled) {
        console.log('User cancelled image picker');
        isPickingRef.current = false;
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('User selected image:', asset.uri);
        console.log('Image file name:', asset.fileName);
        
        const fileName = asset.fileName || `id_document_${Date.now()}.jpg`;
        setDocumentFileName(fileName);
        await uploadDocument(asset.uri, fileName, 'image/jpeg');
      } else {
        console.log('No assets in result');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to pick image. Please try again.',
        'فشل اختيار الصورة. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      isPickingRef.current = false;
    }
  };

  const uploadDocument = async (uri: string, fileName: string, mimeType: string) => {
    setIsUploading(true);
    console.log('Uploading document to backend...', { uri, fileName, mimeType });

    try {
      const data = await uploadFile<{ url: string; filename: string }>(
        '/api/upload/id-document',
        uri,
        'document'
      );

      console.log('Document uploaded successfully:', data.url);
      setIdDocument(data.url);
      showModal(
        'success',
        'Success',
        'نجح',
        'Image uploaded successfully!',
        'تم تحميل الصورة بنجاح!'
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to upload image. Please try again.',
        'فشل تحميل الصورة. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    console.log('User tapped Submit button');

    if (!name.trim()) {
      showModal(
        'warning',
        'Required Field',
        'حقل مطلوب',
        'Please enter your name',
        'يرجى إدخال اسمك'
      );
      return;
    }

    if (!email.trim()) {
      showModal(
        'warning',
        'Required Field',
        'حقل مطلوب',
        'Please enter your email',
        'يرجى إدخال بريدك الإلكتروني'
      );
      return;
    }

    if (!telegramUsername.trim()) {
      showModal(
        'warning',
        'Required Field',
        'حقل مطلوب',
        'Please enter your Telegram username',
        'يرجى إدخال اسم المستخدم في تيليجرام'
      );
      return;
    }

    if (!idDocument) {
      showModal(
        'warning',
        'Required Field',
        'حقل مطلوب',
        'Please upload your ID or passport',
        'يرجى تحميل بطاقة الهوية أو جواز السفر'
      );
      return;
    }

    if (!termsAccepted) {
      showModal(
        'warning',
        'Terms Required',
        'الشروط مطلوبة',
        'Please accept the terms and conditions',
        'يرجى قبول الشروط والأحكام'
      );
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting Forex Guide registration:', { name, email, telegramUsername });

    try {
      interface SubscriptionResponse {
        id: string;
        name: string;
        email: string;
        telegram_username: string;
        channel_type: string;
        subscription_duration: string;
        id_document_url: string;
        terms_accepted: boolean;
        created_at: string;
        status: string;
      }

      const data = await apiCall<SubscriptionResponse>('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          telegram_username: telegramUsername.trim(),
          channel_type: 'education',
          subscription_duration: 'N/A',
          program: 'forex_guide',
          trainer: null,
          id_document_url: idDocument,
          terms_accepted: termsAccepted,
        }),
      });

      console.log('Forex Guide subscription created successfully:', data.id);

      showModal(
        'success',
        'Success!',
        'نجح!',
        'Your purchase request has been submitted successfully! A confirmation email has been sent to your email address. We will send you the Forex Guide via email shortly.',
        'تم إرسال طلب الشراء الخاص بك بنجاح! تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني. سنرسل لك دليل الفوركس عبر البريد الإلكتروني قريباً.',
        () => router.push('/(tabs)/(home)/')
      );
    } catch (error) {
      console.error('Error creating subscription:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
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

  const documentUploaded = idDocument !== null;

  const titleEn = 'Complete Your Purchase';
  const titleAr = 'أكمل عملية الشراء';
  const subtitleEn = 'Fill in your details to purchase the Forex Guide for Beginners';
  const subtitleAr = 'املأ بياناتك لشراء دليل الفوركس للمبتدئين';
  const fullNameEn = 'Full Name';
  const fullNameAr = 'الاسم الكامل';
  const emailEn = 'Email Address';
  const emailAr = 'البريد الإلكتروني';
  const telegramEn = 'Telegram Username';
  const telegramAr = 'اسم المستخدم في تيليجرام';
  const idPassportEn = 'ID or Passport Photo';
  const idPassportAr = 'صورة الهوية أو جواز السفر';
  const uploadButtonEn = 'Upload Photo from Album';
  const uploadButtonAr = 'رفع صورة من الألبوم';
  const imageUploadedEn = 'Image Uploaded';
  const imageUploadedAr = 'تم رفع الصورة';
  const helperTextEn = 'Please upload a clear photo of your ID or passport from your photo album';
  const helperTextAr = 'يرجى رفع صورة واضحة للهوية أو جواز السفر من ألبوم الصور';
  const agreeTermsEn = 'I agree to the terms and conditions';
  const agreeTermsAr = 'أوافق على الشروط والأحكام';
  const summaryTitleEn = 'Purchase Summary';
  const summaryTitleAr = 'ملخص الشراء';
  const productEn = 'Product';
  const productAr = 'المنتج';
  const productNameEn = 'Forex Guide for Beginners';
  const productNameAr = 'دليل الفوركس للمبتدئين';
  const priceEn = 'Price';
  const priceAr = 'السعر';
  const priceValueEn = 'AED 300.00';
  const priceValueAr = '٣٠٠ درهم إماراتي';
  const submitButtonEn = 'Submit Purchase';
  const submitButtonAr = 'إتمام الشراء';

  // iPhone 17 Pro Max compatible padding - use safe area insets directly
  const headerPaddingTop = insets.top;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
          <Text style={styles.title}>{titleEn}</Text>
          <Text style={styles.titleAr}>{titleAr}</Text>
          <Text style={styles.subtitle}>{subtitleEn}</Text>
          <Text style={styles.subtitleAr}>{subtitleAr}</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{fullNameEn}</Text>
            <Text style={styles.labelAr}>{fullNameAr}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{emailEn}</Text>
            <Text style={styles.labelAr}>{emailAr}</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{telegramEn}</Text>
            <Text style={styles.labelAr}>{telegramAr}</Text>
            <TextInput
              style={styles.input}
              placeholder="@username"
              placeholderTextColor={colors.textSecondary}
              value={telegramUsername}
              onChangeText={setTelegramUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{idPassportEn}</Text>
            <Text style={styles.labelAr}>{idPassportAr}</Text>
            <TouchableOpacity
              style={[styles.uploadButton, documentUploaded && styles.uploadButtonSuccess]}
              onPress={handleUploadPress}
              disabled={isUploading}
              activeOpacity={0.7}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <IconSymbol 
                    ios_icon_name={documentUploaded ? "checkmark.circle.fill" : "photo.fill"} 
                    android_material_icon_name={documentUploaded ? "check-circle" : "photo"} 
                    size={24} 
                    color={documentUploaded ? colors.success : colors.text} 
                  />
                  <View style={styles.uploadTextContainer}>
                    <Text style={[styles.uploadButtonText, documentUploaded && styles.uploadButtonTextSuccess]}>
                      {documentUploaded ? imageUploadedEn : uploadButtonEn}
                    </Text>
                    <Text style={[styles.uploadButtonTextAr, documentUploaded && styles.uploadButtonTextSuccess]}>
                      {documentUploaded ? imageUploadedAr : uploadButtonAr}
                    </Text>
                    {documentFileName && (
                      <Text style={styles.fileNameText} numberOfLines={1}>
                        {documentFileName}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.helperText}>{helperTextEn}</Text>
            <Text style={styles.helperTextAr}>{helperTextAr}</Text>
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
                  size={16} 
                  color="#1A1A2E" 
                />
              )}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabel}>{agreeTermsEn}</Text>
              <Text style={styles.checkboxLabelAr}>{agreeTermsAr}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>{summaryTitleEn}</Text>
          <Text style={styles.summaryTitleAr}>{summaryTitleAr}</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelContainer}>
              <Text style={styles.summaryLabel}>{productEn}</Text>
              <Text style={styles.summaryLabelAr}>{productAr}</Text>
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summaryValue}>{productNameEn}</Text>
              <Text style={styles.summaryValueAr}>{productNameAr}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelContainer}>
              <Text style={styles.summaryLabel}>{priceEn}</Text>
              <Text style={styles.summaryLabelAr}>{priceAr}</Text>
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summaryValuePrice}>{priceValueEn}</Text>
              <Text style={styles.summaryValuePriceAr}>{priceValueAr}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#1A1A2E" />
          ) : (
            <>
              <View style={styles.submitTextContainer}>
                <Text style={styles.submitButtonText}>{submitButtonEn}</Text>
                <Text style={styles.submitButtonTextAr}>{submitButtonAr}</Text>
              </View>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={20} 
                color="#1A1A2E" 
              />
            </>
          )}
        </TouchableOpacity>
      </View>

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
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  titleAr: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 2,
  },
  subtitleAr: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  labelAr: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  uploadButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonSuccess: {
    borderColor: colors.success,
    backgroundColor: colors.accent,
  },
  uploadTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  uploadButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  uploadButtonTextAr: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  uploadButtonTextSuccess: {
    color: colors.success,
  },
  fileNameText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  helperTextAr: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  checkboxLabelAr: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summarySection: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  summaryTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabelContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  summaryLabelAr: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  summaryValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 2,
  },
  summaryValueAr: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
  },
  summaryValuePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.highlight,
    textAlign: 'right',
    marginBottom: 2,
  },
  summaryValuePriceAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.highlight,
    textAlign: 'right',
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
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitTextContainer: {
    marginRight: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  submitButtonTextAr: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
});
