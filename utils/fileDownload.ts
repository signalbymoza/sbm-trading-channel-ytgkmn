
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

/**
 * Download and open a file (image or PDF) from a URL
 * @param fileUrl - The URL of the file to download
 * @param fileName - Optional custom filename
 * @returns Promise that resolves when file is opened/shared
 */
export async function downloadAndOpenFile(fileUrl: string, fileName?: string): Promise<void> {
  console.log('downloadAndOpenFile called with URL:', fileUrl);
  
  try {
    // On web, just open the URL in a new tab
    if (Platform.OS === 'web') {
      console.log('Web platform detected - opening URL in new tab');
      window.open(fileUrl, '_blank');
      return;
    }

    // For native platforms (iOS/Android), download the file first
    console.log('Native platform detected - starting download process');
    
    // Determine file extension from URL or use provided fileName
    let fileExtension = 'pdf';
    const urlLower = fileUrl.toLowerCase();
    
    if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) {
      fileExtension = 'jpg';
    } else if (urlLower.includes('.png')) {
      fileExtension = 'png';
    } else if (urlLower.includes('.pdf')) {
      fileExtension = 'pdf';
    } else if (urlLower.includes('.gif')) {
      fileExtension = 'gif';
    } else if (urlLower.includes('.webp')) {
      fileExtension = 'webp';
    }
    
    const finalFileName = fileName || `document_${Date.now()}.${fileExtension}`;
    const fileUri = `${FileSystem.documentDirectory}${finalFileName}`;
    
    console.log('Downloading file to:', fileUri);
    console.log('File extension detected:', fileExtension);
    
    // Download the file
    const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);
    
    console.log('Download completed with status:', downloadResult.status);
    console.log('File saved to:', downloadResult.uri);
    
    if (downloadResult.status !== 200) {
      throw new Error(`فشل التنزيل مع الحالة: ${downloadResult.status}`);
    }
    
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    
    if (!isSharingAvailable) {
      console.error('Sharing is not available on this device');
      throw new Error('لا يمكن فتح الملف على هذا الجهاز');
    }
    
    console.log('Opening file with system viewer via Sharing API');
    
    // Determine MIME type
    let mimeType = 'application/pdf';
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (fileExtension === 'png') {
      mimeType = 'image/png';
    } else if (fileExtension === 'gif') {
      mimeType = 'image/gif';
    } else if (fileExtension === 'webp') {
      mimeType = 'image/webp';
    }
    
    console.log('Using MIME type:', mimeType);
    
    // Share/open the file with the system viewer
    await Sharing.shareAsync(downloadResult.uri, {
      mimeType: mimeType,
      dialogTitle: 'فتح الملف',
      UTI: fileExtension === 'pdf' ? 'com.adobe.pdf' : `public.${fileExtension}`,
    });
    
    console.log('File opened successfully');
  } catch (error) {
    console.error('Error in downloadAndOpenFile:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

/**
 * Check if a URL is an image
 * @param url - The URL to check
 * @returns true if the URL is an image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Check if a URL is a PDF
 * @param url - The URL to check
 * @returns true if the URL is a PDF
 */
export function isPdfUrl(url: string): boolean {
  if (!url) return false;
  return url.toLowerCase().includes('.pdf');
}
