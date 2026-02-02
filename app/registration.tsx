
import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator, Modal as RNModal } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile, apiCall } from "@/utils/api";
import Modal from "@/components/ui/Modal";

export default function RegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
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
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
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

  const handleUploadPress = () => {
    console.log('User tapped upload ID document button - showing picker options');
    setPickerModalVisible(true);
  };

  const pickFromPhotos = async () => {
    if (isPickingRef.current) {
      console.log('Already picking a file, ignoring duplicate request');
      return;
    }

    console.log('User chose to pick from photos');
    isPickingRef.current = true;
    setPickerModalVisible(false);
    
    // Small delay to ensure modal closes smoothly
    await new Promise(resolve => setTimeout(resolve, 300));
    
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

      console.log('Permission granted - opening image picker with old reliable settings...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
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
        console.log('Image dimensions:', asset.width, 'x', asset.height);
        
        const fileName = asset.fileName || `image_${Date.now()}.jpg`;
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

  const pickFromFiles = async () => {
    if (isPickingRef.current) {
      console.log('Already picking a file, ignoring duplicate request');
      return;
    }

    console.log('User chose to pick from files');
    isPickingRef.current = true;
    setPickerModalVisible(false);
    
    // Small delay to ensure modal closes smoothly
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
        console.log('User selected document:', asset.uri);
        console.log('Document name:', asset.name);
        console.log('Document type:', asset.mimeType);
        console.log('Document size:', asset.size, 'bytes');
        
        setDocumentFileName(asset.name);
        await uploadDocument(asset.uri, asset.name, asset.mimeType || 'application/pdf');
      } else {
        console.log('No assets in result');
      }
    } catch (error: any) {
      console.error('Error picking document:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      if (error.code !== 'ERR_CANCELED' && error.code !== 'DOCUMENT_PICKER_CANCELED') {
        showModal(
          'error',
          'Error',
          'خطأ',
          'Failed to pick document. Please try again.',
          'فشل اختيار المستند. يرجى المحاولة مرة أخرى.'
        );
      }
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
        'Document uploaded successfully!',
        'تم تحميل المستند بنجاح!'
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
        'Failed to upload document. Please try again.',
        'فشل تحميل المستند. يرجى المحاولة مرة أخرى.'
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

      console.log('Subscription created successfully:', data.id);

      if (program === 'profit_plan') {
        console.log('Profit plan registration - navigating to success screen with download option for plan amount:', planAmount);
        router.push(`/profit-plan-success?plan_amount=${planAmount || '250'}`);
      } else if (channelType) {
        console.log('Channel subscription - navigating to channel success screen for channel:', channelType);
        router.push(`/channel-success?channel=${channelType}`);
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

  const selectTrainerLabelEn = 'Select Trainer';
  const selectTrainerLabelAr = 'اختر المدرب';

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Registration</Text>
          <Text style={styles.subtitle}>
            Fill in your details to complete the subscription process
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
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
            <Text style={styles.label}>Email Address</Text>
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
            <Text style={styles.label}>Telegram Username</Text>
            <TextInput
              style={styles.input}
              placeholder="@username"
              placeholderTextColor={colors.textSecondary}
              value={telegramUsername}
              onChangeText={setTelegramUsername}
              autoCapitalize="none"
            />
          </View>

          {showTrainerSelection && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{selectTrainerLabelEn}</Text>
              <Text style={styles.labelAr}>{selectTrainerLabelAr}</Text>
              <View style={styles.trainerSelectionContainer}>
                {trainerOptions.map((trainer) => {
                  const isSelected = selectedTrainer === trainer.id;
                  return (
                    <TouchableOpacity
                      key={trainer.id}
                      style={[
                        styles.trainerOption,
                        isSelected && styles.trainerOptionSelected,
                      ]}
                      onPress={() => {
                        console.log('User selected trainer:', trainer.id);
                        setSelectedTrainer(trainer.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.trainerRadio, isSelected && styles.trainerRadioSelected]}>
                        {isSelected && (
                          <View style={styles.trainerRadioInner} />
                        )}
                      </View>
                      <View style={styles.trainerTextContainer}>
                        <Text style={[styles.trainerName, isSelected && styles.trainerNameSelected]}>
                          {trainer.nameEn}
                        </Text>
                        <Text style={[styles.trainerNameAr, isSelected && styles.trainerNameArSelected]}>
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
            <Text style={styles.label}>ID or Passport</Text>
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
                    ios_icon_name={documentUploaded ? "checkmark.circle.fill" : "doc.fill"} 
                    android_material_icon_name={documentUploaded ? "check-circle" : "description"} 
                    size={24} 
                    color={documentUploaded ? colors.success : colors.text} 
                  />
                  <View style={styles.uploadTextContainer}>
                    <Text style={[styles.uploadButtonText, documentUploaded && styles.uploadButtonTextSuccess]}>
                      {documentUploaded ? 'Document Uploaded' : 'Upload ID/Passport'}
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
            <Text style={styles.helperText}>
              Please upload a clear photo or PDF of your ID or passport
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
            <Text style={styles.checkboxLabel}>
              I agree to the terms and conditions
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Registration Summary</Text>
          <Text style={styles.summaryTitleAr}>ملخص التسجيل</Text>
          {program && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Program:</Text>
              <Text style={styles.summaryValue}>
                {program === 'profit_plan' ? 'Profit Plan / خطة الربح' : program.replace(/_/g, ' ')}
              </Text>
            </View>
          )}
          {planAmount && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plan Amount:</Text>
              <Text style={styles.summaryValue}>${planAmount}</Text>
            </View>
          )}
          {channelType && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Channel:</Text>
              <Text style={styles.summaryValue}>{channelType}</Text>
            </View>
          )}
          {duration && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{duration}</Text>
            </View>
          )}
          {selectedTrainer && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Trainer:</Text>
              <Text style={styles.summaryValue}>
                {trainerOptions.find(t => t.id === selectedTrainer)?.nameEn || selectedTrainer}
              </Text>
            </View>
          )}
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

      <RNModal
        visible={pickerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPickerModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.pickerModalOverlay}>
          <TouchableOpacity 
            style={styles.pickerModalBackdrop}
            activeOpacity={1}
            onPress={() => setPickerModalVisible(false)}
          />
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Choose Upload Method</Text>
              <Text style={styles.pickerModalTitleAr}>اختر طريقة التحميل</Text>
            </View>

            <TouchableOpacity
              style={styles.pickerOption}
              onPress={pickFromPhotos}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="photo.fill" 
                android_material_icon_name="photo" 
                size={28} 
                color={colors.highlight} 
              />
              <View style={styles.pickerOptionTextContainer}>
                <Text style={styles.pickerOptionText}>Choose from Photos</Text>
                <Text style={styles.pickerOptionTextAr}>اختر من الصور</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="arrow-forward" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>

            <View style={styles.pickerDivider} />

            <TouchableOpacity
              style={styles.pickerOption}
              onPress={pickFromFiles}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="doc.fill" 
                android_material_icon_name="description" 
                size={28} 
                color={colors.highlight} 
              />
              <View style={styles.pickerOptionTextContainer}>
                <Text style={styles.pickerOptionText}>Choose from Files</Text>
                <Text style={styles.pickerOptionTextAr}>اختر من الملفات</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="arrow-forward" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerCancelButton}
              onPress={() => setPickerModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.pickerCancelText}>Cancel / إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>

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
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
  trainerSelectionContainer: {
    gap: 12,
  },
  trainerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  trainerOptionSelected: {
    borderColor: colors.highlight,
    backgroundColor: colors.accent,
  },
  trainerRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trainerRadioSelected: {
    borderColor: colors.highlight,
  },
  trainerRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.highlight,
  },
  trainerTextContainer: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  trainerNameSelected: {
    color: colors.text,
  },
  trainerNameAr: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  trainerNameArSelected: {
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
  },
  uploadButtonTextSuccess: {
    color: colors.success,
  },
  fileNameText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
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
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
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
    marginBottom: 4,
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
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
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
  submitButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginRight: 8,
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  pickerModalHeader: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  pickerModalTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 24,
  },
  pickerOptionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  pickerOptionText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  pickerOptionTextAr: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  pickerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 24,
  },
  pickerCancelButton: {
    padding: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    marginTop: 8,
  },
  pickerCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
