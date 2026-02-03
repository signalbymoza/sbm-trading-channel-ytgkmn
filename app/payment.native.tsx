
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StripeProvider, useStripe, CardField } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import Modal from '@/components/ui/Modal';
import * as Linking from 'expo-linking';
import { createPaymentIntent } from '@/utils/api';
import { STRIPE_CONFIG, isStripeConfigured } from '@/utils/stripe';

const stripePublishableKey = STRIPE_CONFIG.publishableKey;
const backendUrl = Constants.expoConfig?.extra?.backendUrl || '';

function PaymentContent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { confirmPayment, initPaymentSheet, presentPaymentSheet } = useStripe();

  const amount = params.amount as string;
  const currency = params.currency as string || 'USD';
  const subscriptionId = params.subscriptionId as string;
  const channelType = params.channel as string;
  const duration = params.duration as string;

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
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

  console.log('PaymentScreen (Native): Amount:', amount, 'Currency:', currency, 'SubscriptionId:', subscriptionId);

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

  const amountInCents = Math.round(parseFloat(amount) * 100);
  const displayAmount = parseFloat(amount).toFixed(2);
  const currencySymbol = currency === 'USD' ? '$' : currency;

  const handlePayWithCard = async () => {
    if (!cardComplete) {
      showModal(
        'warning',
        'Incomplete Card Details',
        'بيانات البطاقة غير مكتملة',
        'Please enter complete card details',
        'يرجى إدخال بيانات البطاقة كاملة'
      );
      return;
    }

    setIsProcessing(true);
    console.log('User tapped Pay with Card - creating payment intent...');

    try {
      const data = await createPaymentIntent({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        subscriptionId,
        metadata: {
          channelType,
          duration,
        },
      });

      const clientSecret = data.clientSecret;
      console.log('Payment intent created:', data.paymentIntentId);

      const result = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      console.log('Payment result:', result);

      if (result.error) {
        console.error('Payment failed:', result.error);
        showModal(
          'error',
          'Payment Failed',
          'فشل الدفع',
          result.error.message || 'Payment failed. Please try again.',
          result.error.localizedMessage || 'فشل الدفع. يرجى المحاولة مرة أخرى.'
        );
      } else {
        console.log('Payment succeeded!');
        showModal(
          'success',
          'Payment Successful!',
          'تم الدفع بنجاح!',
          'Your payment has been processed successfully. You will receive a confirmation email shortly.',
          'تم معالجة دفعتك بنجاح. ستتلقى بريدًا إلكترونيًا للتأكيد قريبًا.',
          () => {
            if (channelType) {
              router.push(`/channel-success?channel=${channelType}`);
            } else {
              router.push('/(tabs)/(home)/');
            }
          }
        );
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to process payment. Please try again.',
        'فشل معالجة الدفع. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWithApplePay = async () => {
    if (Platform.OS !== 'ios') {
      showModal(
        'warning',
        'Not Available',
        'غير متاح',
        'Apple Pay is only available on iOS devices',
        'Apple Pay متاح فقط على أجهزة iOS'
      );
      return;
    }

    setIsProcessing(true);
    console.log('User tapped Pay with Apple Pay - initializing payment sheet...');

    try {
      const data = await createPaymentIntent({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        subscriptionId,
        metadata: {
          channelType,
          duration,
        },
      });

      const clientSecret = data.clientSecret;
      console.log('Payment intent created for Apple Pay:', data.paymentIntentId);

      const initResult = await initPaymentSheet({
        merchantDisplayName: 'SBM Trading Channel',
        paymentIntentClientSecret: clientSecret,
        applePay: {
          merchantCountryCode: 'US',
        },
        style: 'automatic',
      });

      if (initResult.error) {
        console.error('Failed to initialize payment sheet:', initResult.error);
        throw new Error(initResult.error.message);
      }

      const presentResult = await presentPaymentSheet();

      if (presentResult.error) {
        console.error('Payment sheet dismissed:', presentResult.error);
        if (presentResult.error.code !== 'Canceled') {
          showModal(
            'error',
            'Payment Failed',
            'فشل الدفع',
            presentResult.error.message || 'Payment failed. Please try again.',
            presentResult.error.localizedMessage || 'فشل الدفع. يرجى المحاولة مرة أخرى.'
          );
        }
      } else {
        console.log('Payment succeeded with Apple Pay!');
        showModal(
          'success',
          'Payment Successful!',
          'تم الدفع بنجاح!',
          'Your payment has been processed successfully. You will receive a confirmation email shortly.',
          'تم معالجة دفعتك بنجاح. ستتلقى بريدًا إلكترونيًا للتأكيد قريبًا.',
          () => {
            if (channelType) {
              router.push(`/channel-success?channel=${channelType}`);
            } else {
              router.push('/(tabs)/(home)/');
            }
          }
        );
      }
    } catch (error) {
      console.error('Error processing Apple Pay:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to process payment. Please try again.',
        'فشل معالجة الدفع. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWithGooglePay = async () => {
    if (Platform.OS !== 'android') {
      showModal(
        'warning',
        'Not Available',
        'غير متاح',
        'Google Pay is only available on Android devices',
        'Google Pay متاح فقط على أجهزة Android'
      );
      return;
    }

    setIsProcessing(true);
    console.log('User tapped Pay with Google Pay - initializing payment sheet...');

    try {
      const data = await createPaymentIntent({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        subscriptionId,
        metadata: {
          channelType,
          duration,
        },
      });

      const clientSecret = data.clientSecret;
      console.log('Payment intent created for Google Pay:', data.paymentIntentId);

      const initResult = await initPaymentSheet({
        merchantDisplayName: 'SBM Trading Channel',
        paymentIntentClientSecret: clientSecret,
        googlePay: {
          merchantCountryCode: 'US',
          testEnv: true,
        },
        style: 'automatic',
      });

      if (initResult.error) {
        console.error('Failed to initialize payment sheet:', initResult.error);
        throw new Error(initResult.error.message);
      }

      const presentResult = await presentPaymentSheet();

      if (presentResult.error) {
        console.error('Payment sheet dismissed:', presentResult.error);
        if (presentResult.error.code !== 'Canceled') {
          showModal(
            'error',
            'Payment Failed',
            'فشل الدفع',
            presentResult.error.message || 'Payment failed. Please try again.',
            presentResult.error.localizedMessage || 'فشل الدفع. يرجى المحاولة مرة أخرى.'
          );
        }
      } else {
        console.log('Payment succeeded with Google Pay!');
        showModal(
          'success',
          'Payment Successful!',
          'تم الدفع بنجاح!',
          'Your payment has been processed successfully. You will receive a confirmation email shortly.',
          'تم معالجة دفعتك بنجاح. ستتلقى بريدًا إلكترونيًا للتأكيد قريبًا.',
          () => {
            if (channelType) {
              router.push(`/channel-success?channel=${channelType}`);
            } else {
              router.push('/(tabs)/(home)/');
            }
          }
        );
      }
    } catch (error) {
      console.error('Error processing Google Pay:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to process payment. Please try again.',
        'فشل معالجة الدفع. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const headerPaddingTop = insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on payment page');
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
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerTitleAr}>الدفع</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountLabelAr}>المبلغ الإجمالي</Text>
          <Text style={styles.amountValue}>
            {currencySymbol}
            {displayAmount}
          </Text>
          <Text style={styles.currencyCode}>{currency}</Text>
        </View>

        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <Text style={styles.sectionTitleAr}>طرق الدفع</Text>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.paymentMethodButton}
              onPress={handlePayWithApplePay}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="apple.logo" 
                android_material_icon_name="apple" 
                size={24} 
                color={colors.text} 
              />
              <View style={styles.paymentMethodTextContainer}>
                <Text style={styles.paymentMethodText}>Apple Pay</Text>
                <Text style={styles.paymentMethodSubtext}>Fast and secure</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="arrow-forward" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          )}

          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={styles.paymentMethodButton}
              onPress={handlePayWithGooglePay}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="g.circle.fill" 
                android_material_icon_name="payment" 
                size={24} 
                color={colors.text} 
              />
              <View style={styles.paymentMethodTextContainer}>
                <Text style={styles.paymentMethodText}>Google Pay</Text>
                <Text style={styles.paymentMethodSubtext}>Fast and secure</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="arrow-forward" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.cardSection}>
            <Text style={styles.cardSectionTitle}>Pay with Card</Text>
            <Text style={styles.cardSectionTitleAr}>الدفع بالبطاقة</Text>
            
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: colors.card,
                textColor: colors.text,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
              }}
              style={styles.cardField}
              onCardChange={(cardDetails) => {
                console.log('Card details changed:', cardDetails.complete);
                setCardComplete(cardDetails.complete);
              }}
            />

            <TouchableOpacity
              style={[
                styles.payButton,
                (!cardComplete || isProcessing) && styles.payButtonDisabled,
              ]}
              onPress={handlePayWithCard}
              disabled={!cardComplete || isProcessing}
              activeOpacity={0.8}
            >
              {isProcessing ? (
                <ActivityIndicator color="#1A1A2E" />
              ) : (
                <>
                  <Text style={styles.payButtonText}>
                    Pay {currencySymbol}
                    {displayAmount}
                  </Text>
                  <IconSymbol 
                    ios_icon_name="lock.fill" 
                    android_material_icon_name="lock" 
                    size={20} 
                    color="#1A1A2E" 
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.securitySection}>
          <IconSymbol 
            ios_icon_name="lock.shield.fill" 
            android_material_icon_name="security" 
            size={24} 
            color={colors.textSecondary} 
          />
          <View style={styles.securityTextContainer}>
            <Text style={styles.securityText}>Secure Payment</Text>
            <Text style={styles.securityTextAr}>دفع آمن</Text>
            <Text style={styles.securitySubtext}>
              Your payment information is encrypted and secure
            </Text>
            <Text style={styles.securitySubtextAr}>
              معلومات الدفع الخاصة بك مشفرة وآمنة
            </Text>
          </View>
        </View>
      </ScrollView>

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

export default function PaymentScreen() {
  if (!isStripeConfigured()) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle.fill" 
            android_material_icon_name="warning" 
            size={48} 
            color={colors.error} 
          />
          <Text style={styles.errorTitle}>Stripe Not Configured</Text>
          <Text style={styles.errorTitleAr}>Stripe غير مُعد</Text>
          <Text style={styles.errorMessage}>
            Please add your Stripe publishable key to app.json under extra.stripePublishableKey
          </Text>
          <Text style={styles.errorMessageAr}>
            يرجى إضافة مفتاح Stripe القابل للنشر إلى app.json تحت extra.stripePublishableKey
          </Text>
        </View>
      </View>
    );
  }

  return (
    <StripeProvider 
      publishableKey={stripePublishableKey}
      merchantIdentifier={STRIPE_CONFIG.merchantIdentifier}
    >
      <PaymentContent />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
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
    paddingBottom: 40,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.card,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  amountLabelAr: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  paymentMethodsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  paymentMethodTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  paymentMethodSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
    fontWeight: '600',
  },
  cardSection: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardSectionTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginRight: 8,
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  securityTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  securityText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  securityTextAr: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  securitySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  securitySubtextAr: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  errorTitleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  errorMessageAr: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
