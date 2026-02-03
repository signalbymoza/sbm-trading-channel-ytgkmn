
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import Constants from 'expo-constants';
import Modal from '@/components/ui/Modal';
import { downloadAndOpenFile } from '@/utils/fileDownload';
import { getSubscriptionPayments, formatPaymentStatus } from '@/utils/api';
import type { PaymentDetails } from '@/utils/stripe';

const backendUrl = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:3000';

interface ProfitPlan {
  hasPlan: boolean;
  planAmount: string | null;
  fileUrl: string | null;
  fileName: string | null;
}

interface SubscriptionData {
  id: string;
  name: string;
  email: string;
  telegramUsername: string;
  channelType: string;
  subscriptionDuration: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  totalMonths: number;
  daysRemaining: number;
  status: string;
  createdAt: string;
  profitPlan?: ProfitPlan;
}

const DEFAULT_PROFIT_PLAN_URL = 'https://example.com/default-profit-plan.pdf';

export default function SubscriptionLookupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    titleEn: string;
    titleAr: string;
    messageEn: string;
    messageAr: string;
  }>({
    type: 'info',
    titleEn: '',
    titleAr: '',
    messageEn: '',
    messageAr: '',
  });
  const [downloadingPlan, setDownloadingPlan] = useState(false);
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const showModal = (
    type: 'success' | 'error' | 'warning' | 'info',
    titleEn: string,
    titleAr: string,
    messageEn: string,
    messageAr: string
  ) => {
    setModalConfig({ type, titleEn, titleAr, messageEn, messageAr });
    setModalVisible(true);
  };

  const handleSearch = async () => {
    console.log('User tapped search button with email:', email);
    
    if (!email.trim()) {
      console.log('Email is empty - showing error');
      showModal(
        'warning',
        'Email Required',
        'البريد الإلكتروني مطلوب',
        'Please enter your email address.',
        'يرجى إدخال عنوان البريد الإلكتروني.'
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSubscription(null);

    try {
      console.log('Fetching subscription data from backend');
      const response = await fetch(`${backendUrl}/api/subscriptions/lookup?email=${encodeURIComponent(email)}`);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        if (response.status === 404) {
          showModal(
            'error',
            'Not Found',
            'غير موجود',
            'No subscription found for this email address.',
            'لم يتم العثور على اشتراك لهذا البريد الإلكتروني.'
          );
        } else {
          showModal(
            'error',
            'Error',
            'خطأ',
            'Failed to fetch subscription data. Please try again.',
            'فشل جلب بيانات الاشتراك. يرجى المحاولة مرة أخرى.'
          );
        }
        return;
      }

      const data = await response.json();
      console.log('Subscription data received:', data);

      const now = new Date();
      const endDate = new Date(data.subscription_end_date);
      const diffTime = endDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const subscriptionData: SubscriptionData = {
        id: data.id,
        name: data.name,
        email: data.email,
        telegramUsername: data.telegram_username,
        channelType: data.channel_type,
        subscriptionDuration: data.subscription_duration,
        subscriptionStartDate: data.subscription_start_date,
        subscriptionEndDate: data.subscription_end_date,
        totalMonths: data.total_months,
        daysRemaining: daysRemaining,
        status: daysRemaining > 0 ? 'active' : 'expired',
        createdAt: data.created_at,
        profitPlan: data.profit_plan ? {
          hasPlan: true,
          planAmount: data.profit_plan.plan_amount,
          fileUrl: data.profit_plan.file_url,
          fileName: data.profit_plan.file_name,
        } : {
          hasPlan: false,
          planAmount: null,
          fileUrl: null,
          fileName: null,
        },
      };

      console.log('Formatted subscription data:', subscriptionData);
      setSubscription(subscriptionData);

      // Load payment history for this subscription
      loadPaymentHistory(data.id);

    } catch (error) {
      console.error('Error fetching subscription:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'An error occurred while fetching subscription data.',
        'حدث خطأ أثناء جلب بيانات الاشتراك.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getChannelNameArabic = (channelType: string) => {
    const channelMap: Record<string, string> = {
      gold: 'قناة الذهب',
      forex: 'قناة الفوركس',
      analysis: 'قناة التحليل',
    };
    return channelMap[channelType?.toLowerCase()] || channelType;
  };

  const getDurationArabic = (duration: string) => {
    const durationMap: Record<string, string> = {
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      annual: 'سنوي',
    };
    return durationMap[duration?.toLowerCase()] || duration;
  };

  const formatDateGregorian = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString();
    return `${dayStr}/${monthStr}/${yearStr}`;
  };

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return '#EF4444';
    if (daysRemaining <= 7) return '#F59E0B';
    return '#10B981';
  };

  const getStatusText = (daysRemaining: number) => {
    if (daysRemaining <= 0) return 'منتهي';
    if (daysRemaining === 1) return 'ينتهي اليوم';
    return `${daysRemaining} يوم متبقي`;
  };

  const loadPaymentHistory = async (subscriptionId: string) => {
    console.log('Loading payment history for subscription:', subscriptionId);
    setLoadingPayments(true);
    
    try {
      const paymentData = await getSubscriptionPayments(subscriptionId);
      console.log('Payment history loaded:', paymentData);
      setPayments(paymentData);
    } catch (error) {
      console.error('Error loading payment history:', error);
      // Don't show error modal for payment history - it's optional
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleDownloadProfitPlan = async () => {
    console.log('User tapped download profit plan button');
    
    if (!subscription?.profitPlan?.fileUrl) {
      console.log('No profit plan file URL available');
      showModal(
        'warning',
        'No Plan Available',
        'لا توجد خطة متاحة',
        'No profit plan is available for your subscription.',
        'لا توجد خطة أرباح متاحة لاشتراكك.'
      );
      return;
    }

    setDownloadingPlan(true);
    
    try {
      console.log('Downloading profit plan from URL:', subscription.profitPlan.fileUrl);
      await downloadAndOpenFile(
        subscription.profitPlan.fileUrl,
        subscription.profitPlan.fileName || 'profit-plan.pdf'
      );
      
      console.log('Profit plan downloaded and opened successfully');
      
      showModal(
        'success',
        'Success',
        'نجح',
        'Profit plan opened successfully.',
        'تم فتح خطة الأرباح بنجاح.'
      );
    } catch (error) {
      console.error('Error downloading profit plan:', error);
      
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to open profit plan. Please try again.',
        'فشل فتح خطة الأرباح. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setDownloadingPlan(false);
    }
  };

  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top, 48) : insets.top;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: topPaddingTop,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    searchSection: {
      gap: 16,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'right',
      lineHeight: 20,
      marginBottom: 16,
    },
    inputContainer: {
      gap: 8,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'right',
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      textAlign: 'right',
    },
    searchButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
    },
    searchButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      gap: 16,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultName: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    resultLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    resultValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'right',
      flex: 1,
      marginLeft: 12,
    },
    daysRemainingContainer: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    daysRemainingNumber: {
      fontSize: 36,
      fontWeight: '700',
    },
    daysRemainingLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    profitPlanSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
    profitPlanTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
    },
    profitPlanCard: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      gap: 12,
    },
    profitPlanAmount: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
      textAlign: 'center',
    },
    downloadButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
    },
    downloadButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    noPlanText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    paymentHistorySection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
    paymentHistoryTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
    },
    paymentCard: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    paymentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    paymentAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    paymentStatusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    paymentStatusText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    paymentLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    paymentValue: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'right',
    },
    noPaymentsText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      paddingVertical: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button - navigating to home');
            router.push('/(tabs)/(home)/');
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
        <Text style={styles.headerTitle}>الاستعلام عن الاشتراك</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>ابحث عن اشتراكك</Text>
          <Text style={styles.sectionDescription}>
            أدخل عنوان بريدك الإلكتروني للاستعلام عن تفاصيل اشتراكك وخطة الأرباح الخاصة بك.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <React.Fragment>
                <IconSymbol
                  ios_icon_name="magnifyingglass"
                  android_material_icon_name="search"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.searchButtonText}>بحث</Text>
              </React.Fragment>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>جاري البحث...</Text>
          </View>
        )}

        {subscription && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultName}>{subscription.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(subscription.daysRemaining) }]}>
                <Text style={styles.statusText}>{subscription.status === 'active' ? 'نشط' : 'منتهي'}</Text>
              </View>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>البريد الإلكتروني:</Text>
              <Text style={styles.resultValue}>{subscription.email}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>يوزر تلقرام:</Text>
              <Text style={styles.resultValue}>{subscription.telegramUsername}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>القناة:</Text>
              <Text style={styles.resultValue}>{getChannelNameArabic(subscription.channelType)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>مدة الاشتراك:</Text>
              <Text style={styles.resultValue}>{getDurationArabic(subscription.subscriptionDuration)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>تاريخ البداية:</Text>
              <Text style={styles.resultValue}>{formatDateGregorian(subscription.subscriptionStartDate)}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>تاريخ الانتهاء:</Text>
              <Text style={styles.resultValue}>{formatDateGregorian(subscription.subscriptionEndDate)}</Text>
            </View>

            <View style={styles.daysRemainingContainer}>
              <Text style={[styles.daysRemainingNumber, { color: getStatusColor(subscription.daysRemaining) }]}>
                {subscription.daysRemaining >= 0 ? subscription.daysRemaining : 0}
              </Text>
              <Text style={styles.daysRemainingLabel}>{getStatusText(subscription.daysRemaining)}</Text>
            </View>

            {subscription.profitPlan && (
              <View style={styles.profitPlanSection}>
                <Text style={styles.profitPlanTitle}>خطة الأرباح</Text>
                {subscription.profitPlan.hasPlan ? (
                  <View style={styles.profitPlanCard}>
                    <Text style={styles.profitPlanAmount}>
                      {subscription.profitPlan.planAmount}
                    </Text>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={handleDownloadProfitPlan}
                      disabled={downloadingPlan}
                      activeOpacity={0.7}
                    >
                      {downloadingPlan ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <React.Fragment>
                          <IconSymbol
                            ios_icon_name="arrow.down.doc.fill"
                            android_material_icon_name="download"
                            size={20}
                            color="#FFFFFF"
                          />
                          <Text style={styles.downloadButtonText}>تنزيل خطة الأرباح</Text>
                        </React.Fragment>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.noPlanText}>لا توجد خطة أرباح متاحة حالياً</Text>
                )}
              </View>
            )}

            {/* Payment History Section */}
            <View style={styles.paymentHistorySection}>
              <Text style={styles.paymentHistoryTitle}>سجل الدفعات / Payment History</Text>
              
              {loadingPayments ? (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.noPaymentsText, { marginTop: 8 }]}>جاري التحميل...</Text>
                </View>
              ) : payments.length > 0 ? (
                payments.map((payment, index) => {
                  const statusInfo = formatPaymentStatus(payment.status);
                  const amount = (payment.amount / 100).toFixed(2);
                  const currency = payment.currency.toUpperCase();
                  const date = new Date(payment.createdAt).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  
                  return (
                    <View key={payment.id || index} style={styles.paymentCard}>
                      <View style={styles.paymentHeader}>
                        <Text style={styles.paymentAmount}>
                          {currency === 'USD' ? '$' : currency} {amount}
                        </Text>
                        <View style={[styles.paymentStatusBadge, { backgroundColor: statusInfo.color }]}>
                          <Text style={styles.paymentStatusText}>{statusInfo.textAr}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>التاريخ:</Text>
                        <Text style={styles.paymentValue}>{date}</Text>
                      </View>
                      
                      {payment.paymentMethod && (
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabel}>طريقة الدفع:</Text>
                          <Text style={styles.paymentValue}>{payment.paymentMethod}</Text>
                        </View>
                      )}
                      
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>الحالة:</Text>
                        <Text style={[styles.paymentValue, { color: statusInfo.color }]}>
                          {statusInfo.textAr}
                        </Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.noPaymentsText}>لا توجد دفعات مسجلة</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.titleEn}
        titleAr={modalConfig.titleAr}
        message={modalConfig.messageEn}
        messageAr={modalConfig.messageAr}
      />
    </View>
  );
}
