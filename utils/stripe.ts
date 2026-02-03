
import Constants from 'expo-constants';

export const STRIPE_CONFIG = {
  publishableKey: Constants.expoConfig?.extra?.stripePublishableKey || '',
  merchantIdentifier: 'merchant.com.sbmtradingchannel',
  merchantDisplayName: 'SBM Trading Channel',
};

export const isStripeConfigured = (): boolean => {
  return STRIPE_CONFIG.publishableKey.length > 0 && 
         !STRIPE_CONFIG.publishableKey.includes('YOUR_STRIPE');
};

export const formatAmount = (amount: number, currency: string): string => {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    SAR: 'ر.س',
    AED: 'د.إ',
    QAR: 'ر.ق',
    BHD: 'د.ب',
    OMR: 'ر.ع',
  };

  const symbol = currencySymbols[currency.toUpperCase()] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

export const convertToStripeAmount = (amount: number): number => {
  // Stripe expects amounts in cents (smallest currency unit)
  return Math.round(amount * 100);
};

export const convertFromStripeAmount = (amount: number): number => {
  // Convert from cents back to dollars
  return amount / 100;
};

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  subscriptionId?: string;
  metadata?: {
    channelType?: string;
    duration?: string;
    program?: string;
    planAmount?: string;
  };
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CheckoutSessionRequest {
  amount: number;
  currency: string;
  subscriptionId?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentDetails {
  id: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  paymentMethod?: string;
  createdAt: string;
}
