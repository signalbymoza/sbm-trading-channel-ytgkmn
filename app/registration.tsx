
import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFile, apiCall } from "@/utils/api";
import Modal from "@/components/ui/Modal";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from "@/contexts/ThemeContext";

export default function RegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const channelType = params.channel as string;
  const duration = params.duration as string;
  const program = params.program as string;
  const planAmount = params.plan_amount as string;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
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

  console.log('RegistrationScreen: Channel:', channelType, 'Duration:', duration, 'Program:', program, 'Plan Amount:', planAmount);

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

  const getTrainerOptions = () => {
    if (program === 'analysis_training') {
      return [
        { id: 'noor', nameEn: 'Trainer Noor', nameAr: 'المدربة نور' }
      ];
    } else if (program === 'trading_training' || program === 'instructions_service') {
      return [
        { id: 'moza', nameEn: 'Trainer Moza Al-Balushi', nameAr: 'المدربة موزة البلوشي' },
        { id: 'omar', nameEn: 'Trainer Omar Al-Mazrouei', nameAr: 'المدرب عمر المزروعي' },
        { id: 'wafaa', nameEn: 'Trainer Wafaa Al-Ahbabi', nameAr: 'المدربة وفاء الاحبابي' }
      ];
    }
    return [];
  };

  const trainerOptions = getTrainerOptions();
  const showTrainerSelection = trainerOptions.length > 0;

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
        quality: 0.8,
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
        console.log('Image dimensions:', asset.width, 'x', asset.height);
        
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
    console.log('Starting document upload...', { uri, fileName, mimeType });

    try {
      console.log('Calling uploadFile API...');
      const data = await uploadFile<{ url: string; filename: string }>(
        '/api/upload/id-document',
        uri,
        'document'
      );

      console.log('Document uploaded successfully! URL:', data.url);
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
      
      let errorMessageEn = 'Failed to upload file. Please try again.';
      let errorMessageAr = 'فشل تحميل الملف. يرجى المحاولة مرة أخرى.';
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        if (error.message.includes('File size exceeds') || error.message.includes('10MB')) {
          errorMessageEn = 'The file exceeds the 10MB limit. Please select a smaller file.';
          errorMessageAr = 'حجم الملف يتجاوز حد 10 ميجابايت. يرجى اختيار ملف أصغر.';
        } else if (error.message.includes('Unsupported file')) {
          errorMessageEn = 'Unsupported file type. Please upload a JPG, PNG, or PDF file.';
          errorMessageAr = 'نوع الملف غير مدعوم. يرجى تحميل ملف JPG أو PNG أو PDF.';
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          errorMessageEn = 'Network error. Please check your internet connection and try again.';
          errorMessageAr = 'خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
        }
      }
      
      showModal(
        'error',
        'Upload Error',
        'خطأ في التحميل',
        errorMessageEn,
        errorMessageAr
      );
    } finally {
      setIsUploading(false);
      console.log('Upload process completed (success or failure)');
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

    if (showTrainerSelection && !selectedTrainer) {
      showModal(
        'warning',
        'Required Field',
        'حقل مطلوب',
        'Please select a trainer',
        'يرجى اختيار مدرب'
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
    console.log('Submitting registration:', { name, email, telegramUsername, channelType, duration, program, selectedTrainer });

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

      const requestBody: {
        name: string;
        email: string;
        telegram_username: string;
        channel_type?: string;
        subscription_duration?: string;
        program: string;
        trainer?: string;
        plan_amount?: string;
        id_document_url: string;
        terms_accepted: boolean;
      } = {
        name: name.trim(),
        email: email.trim(),
        telegram_username: telegramUsername.trim(),
        program: program,
        id_document_url: idDocument,
        terms_accepted: termsAccepted,
      };

      if (channelType) {
        requestBody.channel_type = channelType;
      }
      if (duration) {
        requestBody.subscription_duration = duration;
      }
      if (selectedTrainer) {
        requestBody.trainer = selectedTrainer;
      }
      if (planAmount) {
        requestBody.plan_amount = planAmount;
      }

      console.log('Submitting registration with body:', requestBody);

      const data = await apiCall<SubscriptionResponse>('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Subscription created successfully! ID:', data.id);

      if (channelType && duration) {
        console.log('Channel subscription - navigating to payment screen');
        const priceParam = params.price as string;
        const currencyParam = params.currency as string || 'USD';
        router.push(`/payment?amount=${priceParam}&currency=${currencyParam}&subscriptionId=${data.id}&channel=${channelType}&duration=${duration}`);
      } else if (program === 'profit_plan') {
        console.log('Profit plan registration - navigating to payment screen');
        router.push(`/payment?amount=${planAmount}&currency=USD&subscriptionId=${data.id}&program=profit_plan&plan_amount=${planAmount}`);
      } else {
        showModal(
          'success',
          'Success!',
          'نجح!',
          'Your registration has been submitted successfully! A confirmation email has been sent to your email address. We will contact you shortly via Telegram.',
          'تم إرسال تسجيلك بنجاح! تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني. سنتواصل معك قريباً عبر تيليجرام.',
          () => router.push('/(tabs)/(home)/')
        );
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      
      let errorMessageEn = 'Failed to submit registration. Please try again.';
      let errorMessageAr = 'فشل إرسال التسجيل. يرجى المحاولة مرة أخرى.';
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        if (error.message.includes('network') || error.message.includes('connection')) {
          errorMessageEn = 'Network error. Please check your internet connection and try again.';
          errorMessageAr = 'خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
        } else if (error.message.includes('email') && error.message.includes('already')) {
          errorMessageEn = 'This email is already registered. Please use a different email or contact support.';
          errorMessageAr = 'هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد إلكتروني مختلف أو الاتصال بالدعم.';
        }
      }
      
      showModal(
        'error',
        'Registration Error',
        'خطأ في التسجيل',
        errorMessageEn,
        errorMessageAr
      );
    } finally {
      setIsSubmitting(false);
      console.log('Registration submission completed (success or failure)');
    }
  };

  const documentUploaded = idDocument !== null;

  const selectTrainerLabelEn = 'Select Trainer';
  const selectTrainerLabelAr = 'اختر المدرب';

  const headerPaddingTop = insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerBar, { paddingTop: headerPaddingTop, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on registration page');
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Registration</Text>
          <Text style={[styles.headerTitleAr, { color: colors.textSecondary }]}>التسجيل</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Complete Your Registration</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Fill in your details to complete the subscription process
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Telegram Username</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="@username"
              placeholderTextColor={colors.textSecondary}
              value={telegramUsername}
              onChangeText={setTelegramUsername}
              autoCapitalize="none"
            />
          </View>

          {showTrainerSelection && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{selectTrainerLabelEn}</Text>
              <Text style={[styles.labelAr, { color: colors.textSecondary }]}>{selectTrainerLabelAr}</Text>
              <View style={styles.trainerSelectionContainer}>
                {trainerOptions.map((trainer) => {
                  const isSelected = selectedTrainer === trainer.id;
                  return (
                    <TouchableOpacity
                      key={trainer.id}
                      style={[
                        styles.trainerOption,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        isSelected && { borderColor: colors.highlight, backgroundColor: colors.accent },
                      ]}
                      onPress={() => {
                        console.log('User selected trainer:', trainer.id);
                        setSelectedTrainer(trainer.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.trainerRadio, { borderColor: colors.border }, isSelected && { borderColor: colors.highlight }]}>
                        {isSelected && (
                          <View style={[styles.trainerRadioInner, { backgroundColor: colors.highlight }]} />
                        )}
                      </View>
                      <View style={styles.trainerTextContainer}>
                        <Text style={[styles.trainerName, { color: colors.text }]}>
                          {trainer.nameEn}
                        </Text>
                        <Text style={[styles.trainerNameAr, { color: colors.textSecondary }]}>
                          {trainer.nameAr}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>ID or Passport Document</Text>
            <Text style={[styles.labelAr, { color: colors.textSecondary }]}>وثيقة الهوية أو جواز السفر</Text>
            
            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  documentUploaded && { borderColor: colors.success, backgroundColor: colors.accent }
                ]}
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
                    <Text style={[styles.uploadButtonText, { color: colors.text }, documentUploaded && { color: colors.success }]}>
                      {documentUploaded ? 'Uploaded' : 'From Album'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  documentUploaded && { borderColor: colors.success, backgroundColor: colors.accent }
                ]}
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
                    <Text style={[styles.uploadButtonText, { color: colors.text }, documentUploaded && { color: colors.success }]}>
                      {documentUploaded ? 'Uploaded' : 'From Files'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {documentFileName && (
              <View style={[styles.fileNameContainer, { backgroundColor: colors.accent, borderColor: colors.success }]}>
                <IconSymbol 
                  ios_icon_name="doc.fill" 
                  android_material_icon_name="description" 
                  size={16} 
                  color={colors.success} 
                />
                <Text style={[styles.fileNameText, { color: colors.success }]} numberOfLines={1}>
                  {documentFileName}
                </Text>
              </View>
            )}

            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Upload from photo album or select a file (JPG, PNG, or PDF, max 10MB)
            </Text>
            <Text style={[styles.helperTextAr, { color: colors.textSecondary }]}>
              رفع من ألبوم الصور أو اختيار ملف (JPG أو PNG أو PDF، حد أقصى 10 ميجابايت)
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              console.log('User toggled terms acceptance:', !termsAccepted);
              setTermsAccepted(!termsAccepted);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }, termsAccepted && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              {termsAccepted && (
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={16} 
                  color="#1A1A2E" 
                />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>
              I agree to the terms and conditions
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.summarySection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Registration Summary</Text>
          <Text style={[styles.summaryTitleAr, { color: colors.text }]}>ملخص التسجيل</Text>
          {program && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Program:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {program === 'profit_plan' ? 'Profit Plan / خطة الربح' : program.replace(/_/g, ' ')}
              </Text>
            </View>
          )}
          {planAmount && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Plan Amount:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>${planAmount}</Text>
            </View>
          )}
          {channelType && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Channel:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{channelType}</Text>
            </View>
          )}
          {duration && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Duration:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{duration}</Text>
            </View>
          )}
          {selectedTrainer && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Trainer:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {trainerOptions.find(t => t.id === selectedTrainer)?.nameEn || selectedTrainer}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
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
              <Text style={styles.submitButtonText}>Submit Registration</Text>
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
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
    marginBottom: 2,
  },
  labelAr: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  trainerSelectionContainer: {
    gap: 12,
  },
  trainerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  trainerRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trainerRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  trainerTextContainer: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  trainerNameAr: {
    fontSize: 14,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  fileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  fileNameText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 13,
    marginTop: 8,
  },
  helperTextAr: {
    fontSize: 12,
    marginTop: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 15,
    flex: 1,
  },
  summarySection: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginRight: 8,
  },
});
