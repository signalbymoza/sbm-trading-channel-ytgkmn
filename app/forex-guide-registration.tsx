
import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
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

  const handleUploadFromAlbum = async () => {
    if (isPickingRef.current) {
      console.log('Already picking a file, ignoring duplicate request');
      return;
    }

    console.log('User tapped upload from photo album button');
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
        allowsEditing: true,
        quality: 0.5,
        exif: false,
        aspect: [4, 3],
      });

      console.log('Image picker result:', JSON.stringify(result, null, 2));

      if (result.canceled) {
        console.log('User cancelled image picker');
        isPickingRef.current = false;
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('User selected image from album:', asset.uri);
        console.log('Image file name:', asset.fileName);
        
        const fileName = asset.fileName || `id_document_${Date.now()}.jpg`;
        setDocumentFileName(fileName);
        await uploadDocument(asset.uri, fileName, 'image/jpeg');
      } else {
        console.log('No assets in result');
      }
    } catch (error) {
      console.error('Error picking image from album:', error);
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

  const handleUploadFromFiles = async () => {
    if (isPickingRef.current) {
      console.log('Already picking a file, ignoring duplicate request');
      return;
    }

    console.log('User tapped upload from files button');
    isPickingRef.current = true;
    
    try {
      console.log('Opening document picker...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('Document picker result:', JSON.stringify(result, null, 2));

      if (result.canceled) {
        console.log('User cancelled document picker');
        isPickingRef.current = false;
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('User selected file:', asset.uri);
        console.log('File name:', asset.name);
        console.log('File size:', asset.size);
        console.log('File type:', asset.mimeType);
        
        const fileSizeInMB = asset.size ? asset.size / (1024 * 1024) : 0;
        console.log('File size in MB:', fileSizeInMB.toFixed(2));
        
        if (asset.size && asset.size > 10 * 1024 * 1024) {
          console.log('File size exceeds 10MB limit');
          showModal(
            'warning',
            'File Too Large',
            'الملف كبير جداً',
            'The file size exceeds the 10MB limit. Please select a smaller file.',
            'حجم الملف يتجاوز حد 10 ميجابايت. يرجى اختيار ملف أصغر.'
          );
          isPickingRef.current = false;
          return;
        }
        
        const fileName = asset.name || `id_document_${Date.now()}.pdf`;
        const mimeType = asset.mimeType || 'application/pdf';
        
        setDocumentFileName(fileName);
        await uploadDocument(asset.uri, fileName, mimeType);
      } else {
        console.log('No assets in result');
      }
    } catch (error) {
      console.error('Error picking document from files:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to pick file. Please try again.',
        'فشل اختيار الملف. يرجى المحاولة مرة أخرى.'
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
        'File uploaded successfully!',
        'تم تحميل الملف بنجاح!'
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        if (error.message.includes('413')) {
          showModal(
            'error',
            'File Too Large',
            'الملف كبير جداً',
            'The file is too large. Please select a smaller file.',
            'حجم الملف كبير جداً. يرجى اختيار ملف أصغر.'
          );
          return;
        }
      }
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to upload file. Please try again.',
        'فشل تحميل الملف. يرجى المحاولة مرة أخرى.'
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
  const idPassportEn = 'ID or Passport Document';
  const idPassportAr = 'وثيقة الهوية أو جواز السفر';
  const fromAlbumEn = 'From Album';
  const fromAlbumAr = 'من الألبوم';
  const fromFilesEn = 'From Files';
  const fromFilesAr = 'من الملفات';
  const uploadedEn = 'Uploaded';
  const uploadedAr = 'تم الرفع';
  const helperTextEn = 'Upload from photo album or select a file (JPG, PNG, or PDF, max 10MB)';
  const helperTextAr = 'رفع من ألبوم الصور أو اختيار ملف (JPG أو PNG أو PDF، حد أقصى 10 ميجابايت)';
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

  const headerPaddingTop = insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.headerBar, { paddingTop: headerPaddingTop }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on forex guide registration page');
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
          <Text style={styles.headerTitle}>Registration</Text>
          <Text style={styles.headerTitleAr}>التسجيل</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
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
            
            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity
                style={[styles.uploadButton, documentUploaded && styles.uploadButtonSuccess]}
                onPress={handleUploadFromAlbum}
                disabled={isUploading}
                activeOpacity={0.7}
              >
                {isUploading ? (
                  <ActivityIndicator color={colors.text} size="small" />
                ) : (
                  <>
                    <IconSymbol 
                      ios_icon_name={documentUploaded ? "checkmark.circle.fill" : "photo.fill"} 
                      android_material_icon_name={documentUploaded ? "check-circle" : "photo"} 
                      size={20} 
                      color={documentUploaded ? colors.success : colors.text} 
                    />
                    <View style={styles.uploadTextContainer}>
                      <Text style={[styles.uploadButtonText, documentUploaded && styles.uploadButtonTextSuccess]}>
                        {documentUploaded ? uploadedEn : fromAlbumEn}
                      </Text>
                      <Text style={[styles.uploadButtonTextAr, documentUploaded && styles.uploadButtonTextSuccess]}>
                        {documentUploaded ? uploadedAr : fromAlbumAr}
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, documentUploaded && styles.uploadButtonSuccess]}
                onPress={handleUploadFromFiles}
                disabled={isUploading}
                activeOpacity={0.7}
              >
                {isUploading ? (
                  <ActivityIndicator color={colors.text} size="small" />
                ) : (
                  <>
                    <IconSymbol 
                      ios_icon_name={documentUploaded ? "checkmark.circle.fill" : "folder.fill"} 
                      android_material_icon_name={documentUploaded ? "check-circle" : "folder"} 
                      size={20} 
                      color={documentUploaded ? colors.success : colors.text} 
                    />
                    <View style={styles.uploadTextContainer}>
                      <Text style={[styles.uploadButtonText, documentUploaded && styles.uploadButtonTextSuccess]}>
                        {documentUploaded ? uploadedEn : fromFilesEn}
                      </Text>
                      <Text style={[styles.uploadButtonTextAr, documentUploaded && styles.uploadButtonTextSuccess]}>
                        {documentUploaded ? uploadedAr : fromFilesAr}
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {documentFileName && (
              <View style={styles.fileNameContainer}>
                <IconSymbol 
                  ios_icon_name="doc.fill" 
                  android_material_icon_name="description" 
                  size={16} 
                  color={colors.success} 
                />
                <Text style={styles.fileNameText} numberOfLines={1}>
                  {documentFileName}
                </Text>
              </View>
            )}

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
  headerBar: {
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
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
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
  uploadButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonSuccess: {
    borderColor: colors.success,
    backgroundColor: colors.accent,
  },
  uploadTextContainer: {
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  uploadButtonTextAr: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  uploadButtonTextSuccess: {
    color: colors.success,
  },
  fileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.success,
  },
  fileNameText: {
    flex: 1,
    fontSize: 13,
    color: colors.success,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
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
