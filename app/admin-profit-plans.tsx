
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { colors } from "@/styles/commonStyles";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import * as DocumentPicker from 'expo-document-picker';
import { BACKEND_URL } from "@/utils/api";
import Modal from "@/components/ui/Modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProfitPlanFile {
  id: string;
  plan_amount: string;
  file_name: string;
  file_url: string;
  description?: string;
  created_at: string;
}

export default function AdminProfitPlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [planAmount, setPlanAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<ProfitPlanFile[]>([]);
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

  console.log('AdminProfitPlansScreen: Loaded admin profit plans management screen');

  useEffect(() => {
    loadFiles();
  }, []);

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

  const loadFiles = async () => {
    console.log('Loading profit plan files from database');
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/profit-plans/files`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
        console.log('Loaded profit plan files:', data.length);
      } else {
        console.error('Failed to load files:', response.status);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickDocument = async () => {
    console.log('User tapped pick document button');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Document selected:', asset.name);
        setSelectedFile({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType || 'application/pdf',
        });
      } else {
        console.log('Document selection cancelled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to pick document. Please try again.',
        'فشل اختيار المستند. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      showModal(
        'warning',
        'No File Selected',
        'لم يتم اختيار ملف',
        'Please select a PDF file first.',
        'يرجى اختيار ملف PDF أولاً.'
      );
      return;
    }

    if (!planAmount.trim()) {
      showModal(
        'warning',
        'Plan Amount Required',
        'مبلغ الخطة مطلوب',
        'Please enter the plan amount (e.g., 250, 500, 1000).',
        'يرجى إدخال مبلغ الخطة (مثل 250، 500، 1000).'
      );
      return;
    }

    console.log('User tapped upload file button');
    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // Add the file
      const fileToUpload: any = {
        uri: selectedFile.uri,
        type: selectedFile.mimeType,
        name: selectedFile.name,
      };
      formData.append('file', fileToUpload);
      
      // Add plan amount and description
      formData.append('plan_amount', planAmount.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }

      console.log('Uploading file to backend:', selectedFile.name, 'for plan amount:', planAmount);

      const response = await fetch(`${BACKEND_URL}/api/profit-plans/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully:', data);
        showModal(
          'success',
          'Upload Successful',
          'تم الرفع بنجاح',
          `File "${selectedFile.name}" has been uploaded successfully for plan amount ${planAmount}.`,
          `تم رفع الملف "${selectedFile.name}" بنجاح لمبلغ الخطة ${planAmount}.`
        );
        
        // Reset form
        setSelectedFile(null);
        setPlanAmount('');
        setDescription('');
        
        // Reload files
        loadFiles();
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        showModal(
          'error',
          'Upload Failed',
          'فشل الرفع',
          `Failed to upload file: ${errorData.error || 'Unknown error'}`,
          `فشل رفع الملف: ${errorData.error || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showModal(
        'error',
        'Upload Error',
        'خطأ في الرفع',
        'An error occurred while uploading the file. Please try again.',
        'حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileId: string, fileName: string) => {
    console.log('User requested to delete file:', fileId);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/profit-plans/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('File deleted successfully');
        showModal(
          'success',
          'Deleted',
          'تم الحذف',
          `File "${fileName}" has been deleted successfully.`,
          `تم حذف الملف "${fileName}" بنجاح.`
        );
        loadFiles();
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        showModal(
          'error',
          'Delete Failed',
          'فشل الحذف',
          `Failed to delete file: ${errorData.error || 'Unknown error'}`,
          `فشل حذف الملف: ${errorData.error || 'خطأ غير معروف'}`
        );
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      showModal(
        'error',
        'Delete Error',
        'خطأ في الحذف',
        'An error occurred while deleting the file. Please try again.',
        'حدث خطأ أثناء حذف الملف. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleBack = () => {
    console.log('User tapped back button');
    router.back();
  };

  const uploadSectionTitle = 'رفع ملف خطة الربح';
  const uploadSectionTitleEn = 'Upload Profit Plan File';
  const planAmountLabel = 'مبلغ الخطة (مثل: 250، 500، 1000)';
  const planAmountLabelEn = 'Plan Amount (e.g., 250, 500, 1000)';
  const descriptionLabel = 'الوصف (اختياري)';
  const descriptionLabelEn = 'Description (optional)';
  const selectFileButton = 'اختيار ملف PDF';
  const uploadButton = 'رفع الملف';
  const uploadingText = 'جاري الرفع...';
  const filesSectionTitle = 'الملفات المرفوعة';
  const filesSectionTitleEn = 'Uploaded Files';
  const noFilesText = 'لا توجد ملفات مرفوعة';
  const noFilesTextEn = 'No files uploaded yet';
  const deleteButtonText = 'حذف';
  const selectedFileText = 'الملف المحدد:';

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top + 16 : insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{uploadSectionTitleEn}</Text>
          <Text style={styles.headerTitleAr}>{uploadSectionTitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="arrow.up.doc.fill" 
              android_material_icon_name="upload" 
              size={28} 
              color={colors.highlight} 
            />
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>{uploadSectionTitleEn}</Text>
              <Text style={styles.sectionTitleAr}>{uploadSectionTitle}</Text>
            </View>
          </View>

          {/* Plan Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{planAmountLabelEn}</Text>
            <Text style={styles.inputLabelAr}>{planAmountLabel}</Text>
            <TextInput
              style={styles.input}
              value={planAmount}
              onChangeText={setPlanAmount}
              placeholder="250"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{descriptionLabelEn}</Text>
            <Text style={styles.inputLabelAr}>{descriptionLabel}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* File Selection */}
          <TouchableOpacity
            style={styles.selectFileButton}
            onPress={pickDocument}
            activeOpacity={0.8}
          >
            <IconSymbol 
              ios_icon_name="doc.fill" 
              android_material_icon_name="description" 
              size={24} 
              color="#1A1A2E" 
            />
            <Text style={styles.selectFileButtonText}>{selectFileButton}</Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.selectedFileContainer}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check-circle" 
                size={20} 
                color={colors.success} 
              />
              <View style={styles.selectedFileTextContainer}>
                <Text style={styles.selectedFileLabel}>{selectedFileText}</Text>
                <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
              </View>
            </View>
          )}

          {/* Upload Button */}
          <TouchableOpacity
            style={[styles.uploadButton, (isUploading || !selectedFile) && styles.uploadButtonDisabled]}
            onPress={uploadFile}
            disabled={isUploading || !selectedFile}
            activeOpacity={0.8}
          >
            {isUploading ? (
              <ActivityIndicator color="#1A1A2E" />
            ) : (
              <IconSymbol 
                ios_icon_name="arrow.up.circle.fill" 
                android_material_icon_name="upload" 
                size={24} 
                color="#1A1A2E" 
              />
            )}
            <Text style={styles.uploadButtonText}>
              {isUploading ? uploadingText : uploadButton}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Files List Section */}
        <View style={styles.filesSection}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="doc.text.fill" 
              android_material_icon_name="description" 
              size={28} 
              color={colors.highlight} 
            />
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>{filesSectionTitleEn}</Text>
              <Text style={styles.sectionTitleAr}>{filesSectionTitle}</Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : files.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol 
                ios_icon_name="doc.text" 
                android_material_icon_name="description" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={styles.emptyText}>{noFilesTextEn}</Text>
              <Text style={styles.emptyTextAr}>{noFilesText}</Text>
            </View>
          ) : (
            files.map((file) => {
              const createdDate = new Date(file.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              
              return (
                <View key={file.id} style={styles.fileCard}>
                  <View style={styles.fileCardHeader}>
                    <IconSymbol 
                      ios_icon_name="doc.fill" 
                      android_material_icon_name="description" 
                      size={24} 
                      color={colors.highlight} 
                    />
                    <View style={styles.fileCardInfo}>
                      <Text style={styles.fileCardName}>{file.file_name}</Text>
                      <Text style={styles.fileCardAmount}>Plan Amount: ${file.plan_amount}</Text>
                      {file.description && (
                        <Text style={styles.fileCardDescription}>{file.description}</Text>
                      )}
                      <Text style={styles.fileCardDate}>{createdDate}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteFile(file.id, file.file_name)}
                    activeOpacity={0.8}
                  >
                    <IconSymbol 
                      ios_icon_name="trash.fill" 
                      android_material_icon_name="delete" 
                      size={20} 
                      color="#FF3B30" 
                    />
                    <Text style={styles.deleteButtonText}>{deleteButtonText}</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  uploadSection: {
    margin: 16,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.highlight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  sectionTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  inputLabelAr: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  selectFileButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  selectFileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: 16,
  },
  selectedFileTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  selectedFileLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  selectedFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginLeft: 8,
  },
  filesSection: {
    margin: 16,
    marginTop: 0,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptyTextAr: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
  fileCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  fileCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fileCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileCardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  fileCardAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.highlight,
    marginBottom: 4,
  },
  fileCardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  fileCardDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginLeft: 6,
  },
});
