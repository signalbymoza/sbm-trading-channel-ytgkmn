
import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform, ActivityIndicator } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import * as ImagePicker from 'expo-image-picker';
import { uploadFile, apiCall } from "@/utils/api";

export default function RegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const channelType = params.channel as string;
  const duration = params.duration as string;
  const program = params.program as string;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [idDocument, setIdDocument] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('RegistrationScreen: Channel:', channelType, 'Duration:', duration, 'Program:', program);

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

  const pickDocument = async () => {
    console.log('User tapped upload ID document button');
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('User selected document:', result.assets[0].uri);
      await uploadDocument(result.assets[0].uri);
    }
  };

  const uploadDocument = async (uri: string) => {
    setIsUploading(true);
    console.log('Uploading document to backend...');

    try {
      const data = await uploadFile<{ url: string; filename: string }>(
        '/api/upload/id-document',
        uri,
        'document'
      );

      console.log('Document uploaded successfully:', data.url);
      setIdDocument(data.url);
      Alert.alert('Success', 'Document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    console.log('User tapped Submit button');

    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email');
      return;
    }

    if (!telegramUsername.trim()) {
      Alert.alert('Required Field', 'Please enter your Telegram username');
      return;
    }

    if (showTrainerSelection && !selectedTrainer) {
      Alert.alert('Required Field', 'Please select a trainer');
      return;
    }

    if (!idDocument) {
      Alert.alert('Required Field', 'Please upload your ID or passport');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the terms and conditions');
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

      const data = await apiCall<SubscriptionResponse>('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          telegram_username: telegramUsername.trim(),
          channel_type: channelType,
          subscription_duration: duration,
          program: program,
          trainer: selectedTrainer,
          id_document_url: idDocument,
          terms_accepted: termsAccepted,
        }),
      });

      console.log('Subscription created successfully:', data.id);

      Alert.alert(
        'Success!',
        'Your subscription request has been submitted. We will contact you shortly via Telegram.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/(home)/'),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating subscription:', error);
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const documentUploaded = idDocument !== null;

  const selectTrainerLabelEn = 'Select Trainer';
  const selectTrainerLabelAr = 'اختر المدرب';
  const chooseTrainerEn = 'Choose your trainer';
  const chooseTrainerAr = 'اختر مدربك';

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
              onPress={pickDocument}
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
                  <Text style={[styles.uploadButtonText, documentUploaded && styles.uploadButtonTextSuccess]}>
                    {documentUploaded ? 'Document Uploaded' : 'Upload ID/Passport'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Please upload a clear photo of your ID or passport
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
          <Text style={styles.summaryTitle}>Subscription Summary</Text>
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
          {program && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Program:</Text>
              <Text style={styles.summaryValue}>{program.replace(/_/g, ' ')}</Text>
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
  uploadButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  uploadButtonTextSuccess: {
    color: colors.success,
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
});
