
import Constants from 'expo-constants';

// Get backend URL from app.json configuration
export const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:3000';

// Log the backend URL on app startup for debugging
console.log('[API] Backend URL configured:', BACKEND_URL);

/**
 * Helper function for making API calls with proper error handling
 * @param endpoint - API endpoint (e.g., '/api/subscriptions')
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise with the response data
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;
  
  console.log(`[API] ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response:`, errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API] Response data:`, data);
    
    return data as T;
  } catch (error) {
    console.error(`[API] Request failed:`, error);
    throw error;
  }
}

/**
 * Upload a file to the backend
 * @param endpoint - Upload endpoint
 * @param fileUri - Local file URI
 * @param fieldName - Form field name (default: 'file')
 * @returns Promise with the upload response
 */
export async function uploadFile<T = any>(
  endpoint: string,
  fileUri: string,
  fieldName: string = 'file'
): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;
  
  console.log(`[API] Uploading file to ${url}`);
  console.log(`[API] File URI: ${fileUri}`);
  console.log(`[API] Field name: ${fieldName}`);
  console.log(`[API] Platform:`, Constants.platform?.web ? 'web' : 'native');
  
  try {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'file.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    console.log(`[API] File details - name: ${filename}, type: ${type}`);

    // On Web, we need to fetch the file and convert it to a Blob
    // On Native (iOS/Android), we use the { uri, name, type } format
    if (Constants.platform?.web) {
      console.log('[API] Web platform detected - fetching file as blob');
      
      // Fetch the file from the URI and convert to blob
      const fileResponse = await fetch(fileUri);
      const blob = await fileResponse.blob();
      
      console.log(`[API] Blob created - size: ${blob.size}, type: ${blob.type}`);
      
      // Append the blob to FormData
      formData.append(fieldName, blob, filename);
    } else {
      console.log('[API] Native platform detected - using uri format');
      
      // Native platforms (iOS/Android) use the { uri, name, type } format
      formData.append(fieldName, {
        uri: fileUri,
        name: filename,
        type,
      } as any);
    }

    // CRITICAL: Do NOT set Content-Type header manually for multipart/form-data
    // The browser/React Native will automatically set it with the correct boundary parameter
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // No headers - let the browser set Content-Type with boundary automatically
    });

    console.log(`[API] Upload response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Upload error response:`, errorText);
      
      let errorData;
      const errorDataText = errorText;
      try {
        errorData = JSON.parse(errorText);
        errorDataText;
      } catch (e) {
        console.error('[API] Could not parse error response as JSON');
      }
      
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API] Upload response data:`, data);
    
    return data as T;
  } catch (error) {
    console.error(`[API] Upload failed:`, error);
    throw error;
  }
}
