
import Constants from 'expo-constants';
import type { 
  PaymentIntentRequest, 
  PaymentIntentResponse, 
  CheckoutSessionRequest, 
  CheckoutSessionResponse,
  PaymentDetails 
} from './stripe';

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
 * Stripe Payment API Functions
 */

/**
 * Create a Stripe Payment Intent for mobile payments
 * @param request - Payment intent request data
 * @returns Promise with client secret and payment intent ID
 */
export async function createPaymentIntent(
  request: PaymentIntentRequest
): Promise<PaymentIntentResponse> {
  console.log('[API] Creating payment intent:', request);
  
  return apiCall<PaymentIntentResponse>('/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

/**
 * Create a Stripe Checkout Session for web payments
 * @param request - Checkout session request data
 * @returns Promise with session ID and checkout URL
 */
export async function createCheckoutSession(
  request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  console.log('[API] Creating checkout session:', request);
  
  return apiCall<CheckoutSessionResponse>('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

/**
 * Get payment details by payment ID
 * @param paymentId - Payment ID
 * @returns Promise with payment details
 */
export async function getPaymentDetails(
  paymentId: string
): Promise<PaymentDetails> {
  console.log('[API] Getting payment details for:', paymentId);
  
  return apiCall<PaymentDetails>(`/api/payments/${paymentId}`);
}

/**
 * Get all payments for a subscription
 * @param subscriptionId - Subscription ID
 * @returns Promise with array of payment details
 */
export async function getSubscriptionPayments(
  subscriptionId: string
): Promise<PaymentDetails[]> {
  console.log('[API] Getting payments for subscription:', subscriptionId);
  
  return apiCall<PaymentDetails[]>(`/api/payments/subscription/${subscriptionId}`);
}

/**
 * Format payment status for display
 * @param status - Payment status
 * @returns Formatted status object with color and text
 */
export function formatPaymentStatus(status: string): {
  color: string;
  textEn: string;
  textAr: string;
} {
  const statusMap: Record<string, { color: string; textEn: string; textAr: string }> = {
    pending: { color: '#F59E0B', textEn: 'Pending', textAr: 'قيد الانتظار' },
    succeeded: { color: '#10B981', textEn: 'Succeeded', textAr: 'نجح' },
    failed: { color: '#EF4444', textEn: 'Failed', textAr: 'فشل' },
    canceled: { color: '#6B7280', textEn: 'Canceled', textAr: 'ملغي' },
  };
  
  return statusMap[status] || { color: '#6B7280', textEn: status, textAr: status };
}

/**
 * Upload a file to the backend
 * @param endpoint - Upload endpoint
 * @param fileUri - Local file URI
 * @param fieldName - Form field name (default: 'file')
 * @returns Promise with the upload response
 * 
 * Note: The /api/upload/id-document endpoint supports files up to 10MB
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
    
    // Extract filename from URI
    let filename = 'document.jpg';
    if (fileUri.includes('/')) {
      const parts = fileUri.split('/');
      filename = parts[parts.length - 1];
    }
    
    // Determine file type from extension
    const match = /\.(\w+)$/.exec(filename);
    const extension = match ? match[1].toLowerCase() : 'jpg';
    let mimeType = 'image/jpeg';
    
    if (extension === 'png') {
      mimeType = 'image/png';
    } else if (extension === 'jpg' || extension === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (extension === 'pdf') {
      mimeType = 'application/pdf';
    }

    console.log(`[API] File details - name: ${filename}, type: ${mimeType}`);

    // On Web, we need to fetch the file and convert it to a Blob
    // On Native (iOS/Android), we use the { uri, name, type } format
    if (Constants.platform?.web) {
      console.log('[API] Web platform detected - fetching file as blob');
      
      try {
        // Fetch the file from the URI and convert to blob
        const fileResponse = await fetch(fileUri);
        
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch file: ${fileResponse.status}`);
        }
        
        const blob = await fileResponse.blob();
        
        console.log(`[API] Blob created - size: ${blob.size}, type: ${blob.type}`);
        
        // Create a new blob with the correct MIME type if needed
        const typedBlob = blob.type ? blob : new Blob([blob], { type: mimeType });
        
        console.log(`[API] Final blob - size: ${typedBlob.size}, type: ${typedBlob.type}`);
        
        // Append the blob to FormData with filename
        formData.append(fieldName, typedBlob, filename);
        
        console.log('[API] FormData created successfully for web');
      } catch (fetchError) {
        console.error('[API] Error fetching blob:', fetchError);
        throw new Error(`Failed to prepare file for upload: ${fetchError}`);
      }
    } else {
      console.log('[API] Native platform detected - using uri format');
      
      // Native platforms (iOS/Android) use the { uri, name, type } format
      formData.append(fieldName, {
        uri: fileUri,
        name: filename,
        type: mimeType,
      } as any);
      
      console.log('[API] FormData created successfully for native');
    }

    console.log('[API] Sending upload request...');

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
      try {
        errorData = JSON.parse(errorText);
        console.error('[API] Parsed error data:', errorData);
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
