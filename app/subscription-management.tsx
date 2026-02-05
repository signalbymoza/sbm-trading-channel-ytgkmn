
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  Image,
  Modal as RNModal,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import Constants from 'expo-constants';
import Modal from '@/components/ui/Modal';
import { downloadAndOpenFile, isImageUrl, isPdfUrl } from '@/utils/fileDownload';
import { getSubscriptionPayments, formatPaymentStatus } from '@/utils/api';
import type { PaymentDetails } from '@/utils/stripe';

const backendUrl = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:3000';

interface SubscriptionStats {
  activeCount: number;
  expiredCount: number;
  expiringTodayCount: number;
  totalCount: number;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  telegramUsername: string;
  channelType: string;
  subscriptionEndDate: string;
  subscriptionStartDate: string;
  status: string;
  daysRemaining: number;
  idDocumentUrl?: string;
  createdAt: string;
  planAmount?: string | null;
}

interface BrokerSubscriber {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  brokerName: string;
  createdAt: string;
}

interface Opinion {
  id: string;
  name: string;
  email: string;
  opinion: string;
  approved: boolean;
  created_at: string;
}

type SortOrder = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

export default function SubscriptionManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [brokerSubscribers, setBrokerSubscribers] = useState<BrokerSubscriber[]>([]);
  const [pendingOpinions, setPendingOpinions] = useState<Opinion[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'stats' | 'subscribers' | 'brokers' | 'opinions'>('stats');
  const [exporting, setExporting] = useState(false);
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
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [downloadingDocument, setDownloadingDocument] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedSubscriberForPayments, setSelectedSubscriberForPayments] = useState<string | null>(null);
  const [subscriberPayments, setSubscriberPayments] = useState<PaymentDetails[]>([]);
  const [loadingSubscriberPayments, setLoadingSubscriberPayments] = useState(false);
  const [paymentsModalVisible, setPaymentsModalVisible] = useState(false);

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

  const loadData = useCallback(async () => {
    console.log('Loading subscription management data');
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching from backend URL:', backendUrl);
      
      const statsResponse = await fetch(`${backendUrl}/api/subscriptions/stats`);
      console.log('Stats response status:', statsResponse.status);
      
      if (!statsResponse.ok) {
        const errorText = await statsResponse.text();
        console.error('Stats error response:', errorText);
        
        let errorMessage = `فشل تحميل الإحصائيات (${statsResponse.status})`;
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message && errorJson.message.includes('relation') && errorJson.message.includes('does not exist')) {
            errorMessage = 'جاري إعداد قاعدة البيانات. يرجى الانتظار لحظات ثم المحاولة مرة أخرى.';
          }
        } catch (e) {
          console.log('Could not parse error as JSON');
        }
        
        throw new Error(errorMessage);
      }
      
      const statsData = await statsResponse.json();
      console.log('Stats loaded successfully:', statsData);
      setStats(statsData);

      const subscribersResponse = await fetch(`${backendUrl}/api/subscriptions`);
      console.log('Subscribers response status:', subscribersResponse.status);
      
      if (!subscribersResponse.ok) {
        const errorText = await subscribersResponse.text();
        console.error('Subscribers error response:', errorText);
        throw new Error(`فشل تحميل قائمة المشتركين (${subscribersResponse.status})`);
      }
      
      const subscribersData = await subscribersResponse.json();
      console.log('Subscribers loaded successfully:', subscribersData.length);
      console.log('Sample subscriber data:', subscribersData[0]);
      
      const formattedSubscribers = subscribersData.map((sub: any) => {
        const idDocUrl = sub.id_document_url;
        const planAmount = sub.plan_amount;
        console.log('Subscriber:', sub.name, 'ID Document URL:', idDocUrl, 'Plan Amount:', planAmount);
        
        return {
          id: sub.id,
          name: sub.name,
          email: sub.email,
          telegramUsername: sub.telegram_username,
          channelType: sub.channel_type,
          subscriptionEndDate: sub.subscription_end_date,
          subscriptionStartDate: sub.subscription_start_date,
          status: sub.status,
          daysRemaining: calculateDaysRemaining(sub.subscription_end_date),
          idDocumentUrl: idDocUrl,
          createdAt: sub.created_at,
          planAmount: planAmount,
        };
      });
      
      console.log('Formatted subscribers with document URLs:', formattedSubscribers.filter((s: Subscriber) => s.idDocumentUrl).length);
      setSubscribers(formattedSubscribers);

      const brokersResponse = await fetch(`${backendUrl}/api/broker-subscribers`);
      console.log('Broker subscribers response status:', brokersResponse.status);
      
      if (!brokersResponse.ok) {
        const errorText = await brokersResponse.text();
        console.error('Broker subscribers error response:', errorText);
        throw new Error(`فشل تحميل مشتركي البروكر (${brokersResponse.status})`);
      }
      
      const brokersData = await brokersResponse.json();
      console.log('Broker subscribers loaded successfully:', brokersData.length);
      setBrokerSubscribers(brokersData);

      const opinionsResponse = await fetch(`${backendUrl}/api/opinions/pending`);
      console.log('Pending opinions response status:', opinionsResponse.status);
      
      if (!opinionsResponse.ok) {
        const errorText = await opinionsResponse.text();
        console.error('Pending opinions error response:', errorText);
        throw new Error(`فشل تحميل الآراء المعلقة (${opinionsResponse.status})`);
      }
      
      const opinionsData = await opinionsResponse.json();
      console.log('Pending opinions loaded successfully:', opinionsData.length);
      setPendingOpinions(opinionsData);

    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشل تحميل البيانات';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const calculateDaysRemaining = (endDateString: string | null): number => {
    if (!endDateString) return 0;
    const endDate = new Date(endDateString);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExportSubscriptions = async () => {
    console.log('Exporting subscriptions');
    setExporting(true);
    try {
      const url = `${backendUrl}/api/subscriptions/export`;
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error exporting subscriptions:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to export data. Please try again.',
        'فشل تصدير البيانات. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setExporting(false);
    }
  };

  const handleExportBrokerSubscribers = async () => {
    console.log('Exporting broker subscribers, broker:', selectedBroker);
    setExporting(true);
    try {
      const url = selectedBroker === 'all'
        ? `${backendUrl}/api/broker-subscribers/export`
        : `${backendUrl}/api/broker-subscribers/export?broker=${selectedBroker}`;
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error exporting broker subscribers:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to export data. Please try again.',
        'فشل تصدير البيانات. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setExporting(false);
    }
  };

  const handleApproveOpinion = async (opinionId: string) => {
    console.log('User tapped approve opinion button for opinion ID:', opinionId);
    
    try {
      const response = await fetch(`${backendUrl}/api/opinions/${opinionId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Approve opinion error response:', errorText);
        throw new Error(`فشل الموافقة على الرأي (${response.status})`);
      }
      
      console.log('Opinion approved successfully');
      
      setPendingOpinions(prev => prev.filter(op => op.id !== opinionId));
      
      showModal(
        'success',
        'Success',
        'نجح',
        'Opinion approved successfully.',
        'تمت الموافقة على الرأي بنجاح.'
      );
    } catch (error) {
      console.error('Error approving opinion:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to approve opinion. Please try again.',
        'فشل الموافقة على الرأي. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleDeleteOpinion = async (opinionId: string) => {
    console.log('User tapped delete opinion button for opinion ID:', opinionId);
    
    try {
      const response = await fetch(`${backendUrl}/api/opinions/${opinionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete opinion error response:', errorText);
        throw new Error(`فشل حذف الرأي (${response.status})`);
      }
      
      console.log('Opinion deleted successfully');
      
      setPendingOpinions(prev => prev.filter(op => op.id !== opinionId));
      
      showModal(
        'success',
        'Success',
        'نجح',
        'Opinion deleted successfully.',
        'تم حذف الرأي بنجاح.'
      );
    } catch (error) {
      console.error('Error deleting opinion:', error);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to delete opinion. Please try again.',
        'فشل حذف الرأي. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleViewDocument = async (subscriberId: string, documentUrl: string) => {
    console.log('User tapped view document button for subscriber ID:', subscriberId);
    console.log('Original document URL:', documentUrl);
    
    if (!documentUrl || documentUrl.trim() === '') {
      console.error('Invalid document URL: empty or null');
      showModal(
        'error',
        'Error',
        'خطأ',
        'Invalid document URL. Please contact support.',
        'رابط المستند غير صالح. يرجى الاتصال بالدعم.'
      );
      return;
    }
    
    setImageLoadError(false);
    setDocumentLoading(true);
    
    try {
      console.log('Fetching fresh signed URL from backend for subscriber:', subscriberId);
      const response = await fetch(`${backendUrl}/api/subscriptions/${subscriberId}/document-url`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch fresh document URL:', response.status, errorText);
        throw new Error(`فشل تحميل رابط المستند (${response.status})`);
      }
      
      const data = await response.json();
      const freshUrl = data.url;
      
      console.log('Received fresh signed URL from backend');
      console.log('Fresh URL:', freshUrl);
      
      setSelectedDocumentUrl(freshUrl);
      
      if (isImageUrl(freshUrl)) {
        console.log('Document is an image - showing in modal');
        setDocumentModalVisible(true);
        setDocumentLoading(false);
      } else {
        console.log('Document is a PDF - downloading and opening');
        setDocumentModalVisible(false);
        setDocumentLoading(false);
        handleDownloadDocument(freshUrl);
      }
    } catch (error) {
      console.error('Error fetching fresh document URL:', error);
      setDocumentLoading(false);
      
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to load document. Please try again.',
        'فشل تحميل المستند. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const handleViewPaymentHistory = async (subscriberId: string, subscriberName: string) => {
    console.log('User tapped view payment history for subscriber:', subscriberName);
    setSelectedSubscriberForPayments(subscriberId);
    setLoadingSubscriberPayments(true);
    setPaymentsModalVisible(true);
    
    try {
      const payments = await getSubscriptionPayments(subscriberId);
      console.log('Loaded payments for subscriber:', payments);
      setSubscriberPayments(payments);
    } catch (error) {
      console.error('Error loading payment history:', error);
      setSubscriberPayments([]);
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to load payment history.',
        'فشل تحميل سجل الدفعات.'
      );
    } finally {
      setLoadingSubscriberPayments(false);
    }
  };

  const handleDownloadDocument = async (documentUrl: string) => {
    console.log('Downloading and opening document:', documentUrl);
    setDownloadingDocument(true);
    
    try {
      await downloadAndOpenFile(documentUrl);
      console.log('Document opened successfully');
      
      showModal(
        'success',
        'Success',
        'نجح',
        'Document opened successfully.',
        'تم فتح المستند بنجاح.'
      );
    } catch (error) {
      console.error('Error opening document:', error);
      
      showModal(
        'error',
        'Error',
        'خطأ',
        'Failed to open document. Please try again.',
        'فشل فتح المستند. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setDownloadingDocument(false);
    }
  };

  const formatDateGregorian = (dateString: string) => {
    if (!dateString) return 'غير متوفر';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString();
    return `${dayStr}/${monthStr}/${yearStr}`;
  };

  const getChannelNameArabic = (channelType: string) => {
    if (!channelType) return 'غير محدد';
    const channelMap: Record<string, string> = {
      gold: 'قناة الذهب',
      forex: 'قناة الفوركس',
      analysis: 'قناة التحليل',
    };
    return channelMap[channelType?.toLowerCase()] || channelType;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: '#10B981',
      expired: '#EF4444',
      expiring_today: '#F59E0B',
    };
    return statusColors[status] || '#6B7280';
  };

  const getStatusTextArabic = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'نشط',
      expired: 'منتهي',
      expiring_today: 'ينتهي اليوم',
    };
    return statusMap[status] || status;
  };

  const getSortedSubscribers = () => {
    const sorted = [...subscribers];
    
    switch (sortOrder) {
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'oldest':
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateA - dateB;
        });
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name, 'ar'));
        break;
    }
    
    return sorted;
  };

  const filteredBrokerSubscribers = selectedBroker === 'all'
    ? brokerSubscribers
    : brokerSubscribers.filter(sub => sub.brokerName === selectedBroker);

  const brokers = ['XTB', 'AXI', 'Exness'];

  const statsTitle = 'إحصائيات الاشتراكات';
  const subscribersTitle = 'قاعدة بيانات المشتركين';
  const brokersTitle = 'المشتركين عن طريق البروكر';

  const topPaddingTop = insets.top;

  const sortedSubscribers = getSortedSubscribers();

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
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      backgroundColor: colors.background,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      gap: 16,
      backgroundColor: colors.background,
    },
    errorTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    errorMessage: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    retryButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'right',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    exportButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    exportButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    sortContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    sortButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    sortButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    sortButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    sortButtonTextActive: {
      color: '#FFFFFF',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      width: '48%',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      gap: 8,
    },
    statValue: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    statLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    tableContainer: {
      gap: 12,
    },
    subscriberCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    subscriberHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    subscriberName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      textAlign: 'right',
    },
    subscriberStatusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    subscriberStatusText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    subscriberRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    subscriberLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    subscriberValue: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'right',
      flex: 1,
      marginLeft: 12,
    },
    viewDocumentButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
    },
    viewDocumentButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    brokerFilterContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    brokerFilterButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    brokerFilterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    brokerFilterText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    brokerFilterTextActive: {
      color: '#FFFFFF',
    },
    brokerCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    brokerCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    brokerCardName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      textAlign: 'right',
    },
    brokerBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    brokerBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    brokerCardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    brokerCardLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    brokerCardValue: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'right',
      flex: 1,
      marginLeft: 12,
    },
    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 40,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    documentModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    documentModalContent: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      gap: 16,
    },
    documentModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    documentModalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    documentModalCloseButton: {
      padding: 8,
    },
    documentImageContainer: {
      width: '100%',
      height: 400,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    documentImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    documentLoadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    documentLoadingText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    downloadDocumentButton: {
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
    downloadDocumentButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    documentErrorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      padding: 20,
    },
    documentErrorTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#EF4444',
      textAlign: 'center',
    },
    documentErrorMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    documentErrorUrl: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      marginTop: 8,
      paddingHorizontal: 12,
    },
    viewPaymentsButton: {
      backgroundColor: colors.highlight,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
    },
    viewPaymentsButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    paymentsModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paymentsModalContent: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      gap: 16,
    },
    paymentsModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentsModalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    paymentsModalCloseButton: {
      padding: 8,
    },
    paymentsScrollView: {
      maxHeight: 400,
    },
    paymentCard: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
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
      paddingVertical: 20,
    },
    paymentsLoadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
      gap: 12,
    },
    opinionCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    opinionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    opinionName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      textAlign: 'right',
    },
    opinionBadge: {
      backgroundColor: '#F59E0B',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    opinionBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    opinionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    opinionLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    opinionValue: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'right',
      flex: 1,
      marginLeft: 12,
    },
    opinionTextContainer: {
      gap: 8,
      marginTop: 8,
    },
    opinionText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      textAlign: 'right',
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    opinionActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    approveButton: {
      flex: 1,
      backgroundColor: '#10B981',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    approveButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    deleteButton: {
      flex: 1,
      backgroundColor: '#EF4444',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    deleteButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('User tapped back button on subscription management page - navigating to home');
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
        <Text style={styles.headerTitle}>إدارة الاشتراكات</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
          onPress={() => setActiveTab('stats')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
            الإحصائيات
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'subscribers' && styles.tabActive]}
          onPress={() => setActiveTab('subscribers')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'subscribers' && styles.tabTextActive]}>
            المشتركين
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'brokers' && styles.tabActive]}
          onPress={() => setActiveTab('brokers')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'brokers' && styles.tabTextActive]}>
            البروكر
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'opinions' && styles.tabActive]}
          onPress={() => setActiveTab('opinions')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'opinions' && styles.tabTextActive]}>
            الآراء
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="error"
            size={64}
            color="#EF4444"
          />
          <Text style={styles.errorTitle}>حدث خطأ</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadData}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="arrow.clockwise"
              android_material_icon_name="refresh"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'stats' && stats && (
            <View>
              <Text style={styles.sectionTitle}>{statsTitle}</Text>
              
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={32}
                    color="#FFFFFF"
                  />
                  <Text style={styles.statValue}>{stats.activeCount}</Text>
                  <Text style={styles.statLabel}>مشتركين نشطين</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#EF4444' }]}>
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={32}
                    color="#FFFFFF"
                  />
                  <Text style={styles.statValue}>{stats.expiredCount}</Text>
                  <Text style={styles.statLabel}>اشتراكات منتهية</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#F59E0B' }]}>
                  <IconSymbol
                    ios_icon_name="clock.fill"
                    android_material_icon_name="schedule"
                    size={32}
                    color="#FFFFFF"
                  />
                  <Text style={styles.statValue}>{stats.expiringTodayCount}</Text>
                  <Text style={styles.statLabel}>ينتهي اليوم</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
                  <IconSymbol
                    ios_icon_name="person.3.fill"
                    android_material_icon_name="group"
                    size={32}
                    color="#FFFFFF"
                  />
                  <Text style={styles.statValue}>{stats.totalCount}</Text>
                  <Text style={styles.statLabel}>إجمالي المشتركين</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'subscribers' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{subscribersTitle}</Text>
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={handleExportSubscriptions}
                  disabled={exporting}
                  activeOpacity={0.7}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <React.Fragment>
                      <IconSymbol
                        ios_icon_name="arrow.down.doc.fill"
                        android_material_icon_name="download"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text style={styles.exportButtonText}>تصدير Excel</Text>
                    </React.Fragment>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.sortContainer}>
                <TouchableOpacity
                  style={[styles.sortButton, sortOrder === 'newest' && styles.sortButtonActive]}
                  onPress={() => {
                    console.log('User selected sort order: newest');
                    setSortOrder('newest');
                  }}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="arrow.down"
                    android_material_icon_name="arrow-downward"
                    size={16}
                    color={sortOrder === 'newest' ? '#FFFFFF' : colors.text}
                  />
                  <Text style={[styles.sortButtonText, sortOrder === 'newest' && styles.sortButtonTextActive]}>
                    الأحدث
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sortButton, sortOrder === 'oldest' && styles.sortButtonActive]}
                  onPress={() => {
                    console.log('User selected sort order: oldest');
                    setSortOrder('oldest');
                  }}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="arrow.up"
                    android_material_icon_name="arrow-upward"
                    size={16}
                    color={sortOrder === 'oldest' ? '#FFFFFF' : colors.text}
                  />
                  <Text style={[styles.sortButtonText, sortOrder === 'oldest' && styles.sortButtonTextActive]}>
                    الأقدم
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sortButton, sortOrder === 'name-asc' && styles.sortButtonActive]}
                  onPress={() => {
                    console.log('User selected sort order: name ascending');
                    setSortOrder('name-asc');
                  }}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="textformat"
                    android_material_icon_name="sort-by-alpha"
                    size={16}
                    color={sortOrder === 'name-asc' ? '#FFFFFF' : colors.text}
                  />
                  <Text style={[styles.sortButtonText, sortOrder === 'name-asc' && styles.sortButtonTextActive]}>
                    الاسم (أ-ي)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sortButton, sortOrder === 'name-desc' && styles.sortButtonActive]}
                  onPress={() => {
                    console.log('User selected sort order: name descending');
                    setSortOrder('name-desc');
                  }}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="textformat"
                    android_material_icon_name="sort-by-alpha"
                    size={16}
                    color={sortOrder === 'name-desc' ? '#FFFFFF' : colors.text}
                  />
                  <Text style={[styles.sortButtonText, sortOrder === 'name-desc' && styles.sortButtonTextActive]}>
                    الاسم (ي-أ)
                  </Text>
                </TouchableOpacity>
              </View>

              {sortedSubscribers.length === 0 ? (
                <View style={styles.emptyCard}>
                  <IconSymbol
                    ios_icon_name="person.slash"
                    android_material_icon_name="person-off"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.emptyText}>لا يوجد مشتركين</Text>
                </View>
              ) : (
                <View style={styles.tableContainer}>
                  {sortedSubscribers.map((subscriber, index) => (
                    <View key={index} style={styles.subscriberCard}>
                      <View style={styles.subscriberHeader}>
                        <Text style={styles.subscriberName}>{subscriber.name}</Text>
                        <View
                          style={[
                            styles.subscriberStatusBadge,
                            { backgroundColor: getStatusColor(subscriber.status) },
                          ]}
                        >
                          <Text style={styles.subscriberStatusText}>
                            {getStatusTextArabic(subscriber.status)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.subscriberRow}>
                        <Text style={styles.subscriberLabel}>البريد الإلكتروني:</Text>
                        <Text style={styles.subscriberValue}>{subscriber.email}</Text>
                      </View>

                      <View style={styles.subscriberRow}>
                        <Text style={styles.subscriberLabel}>يوزر تلقرام:</Text>
                        <Text style={styles.subscriberValue}>{subscriber.telegramUsername}</Text>
                      </View>

                      <View style={styles.subscriberRow}>
                        <Text style={styles.subscriberLabel}>القناة:</Text>
                        <Text style={styles.subscriberValue}>
                          {getChannelNameArabic(subscriber.channelType)}
                        </Text>
                      </View>

                      {subscriber.planAmount && (
                        <View style={styles.subscriberRow}>
                          <Text style={styles.subscriberLabel}>خطة الربح التراكمي:</Text>
                          <Text style={[styles.subscriberValue, { color: colors.primary, fontWeight: '700' }]}>
                            {subscriber.planAmount}
                          </Text>
                        </View>
                      )}

                      <View style={styles.subscriberRow}>
                        <Text style={styles.subscriberLabel}>تاريخ الاشتراك:</Text>
                        <Text style={styles.subscriberValue}>
                          {formatDateGregorian(subscriber.createdAt)}
                        </Text>
                      </View>

                      {subscriber.subscriptionEndDate && (
                        <React.Fragment>
                          <View style={styles.subscriberRow}>
                            <Text style={styles.subscriberLabel}>تاريخ الانتهاء:</Text>
                            <Text style={styles.subscriberValue}>
                              {formatDateGregorian(subscriber.subscriptionEndDate)}
                            </Text>
                          </View>

                          <View style={styles.subscriberRow}>
                            <Text style={styles.subscriberLabel}>الأيام المتبقية:</Text>
                            <Text
                              style={[
                                styles.subscriberValue,
                                { color: getStatusColor(subscriber.status) },
                              ]}
                            >
                              {subscriber.daysRemaining >= 0
                                ? `${subscriber.daysRemaining} يوم`
                                : 'منتهي'}
                            </Text>
                          </View>
                        </React.Fragment>
                      )}

                      {subscriber.idDocumentUrl && subscriber.idDocumentUrl.trim() !== '' && (
                        <TouchableOpacity
                          style={styles.viewDocumentButton}
                          onPress={() => {
                            console.log('View document button pressed for subscriber:', subscriber.name);
                            console.log('Subscriber ID:', subscriber.id);
                            console.log('Document URL:', subscriber.idDocumentUrl);
                            handleViewDocument(subscriber.id, subscriber.idDocumentUrl!);
                          }}
                          disabled={downloadingDocument || documentLoading}
                          activeOpacity={0.7}
                        >
                          {(downloadingDocument || documentLoading) ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <React.Fragment>
                              <IconSymbol
                                ios_icon_name="doc.text.fill"
                                android_material_icon_name="description"
                                size={20}
                                color="#FFFFFF"
                              />
                              <Text style={styles.viewDocumentButtonText}>عرض الهوية / الجواز</Text>
                            </React.Fragment>
                          )}
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.viewPaymentsButton}
                        onPress={() => handleViewPaymentHistory(subscriber.id, subscriber.name)}
                        activeOpacity={0.7}
                      >
                        <IconSymbol
                          ios_icon_name="creditcard.fill"
                          android_material_icon_name="payment"
                          size={20}
                          color={colors.text}
                        />
                        <Text style={styles.viewPaymentsButtonText}>عرض سجل الدفعات</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'brokers' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{brokersTitle}</Text>
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={handleExportBrokerSubscribers}
                  disabled={exporting}
                  activeOpacity={0.7}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <React.Fragment>
                      <IconSymbol
                        ios_icon_name="arrow.down.doc.fill"
                        android_material_icon_name="download"
                        size={18}
                        color="#FFFFFF"
                      />
                      <Text style={styles.exportButtonText}>تصدير Excel</Text>
                    </React.Fragment>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.brokerFilterContainer}>
                <TouchableOpacity
                  style={[
                    styles.brokerFilterButton,
                    selectedBroker === 'all' && styles.brokerFilterButtonActive,
                  ]}
                  onPress={() => setSelectedBroker('all')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.brokerFilterText,
                      selectedBroker === 'all' && styles.brokerFilterTextActive,
                    ]}
                  >
                    الكل
                  </Text>
                </TouchableOpacity>
                {brokers.map((broker) => (
                  <TouchableOpacity
                    key={broker}
                    style={[
                      styles.brokerFilterButton,
                      selectedBroker === broker && styles.brokerFilterButtonActive,
                    ]}
                    onPress={() => setSelectedBroker(broker)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.brokerFilterText,
                        selectedBroker === broker && styles.brokerFilterTextActive,
                      ]}
                    >
                      {broker}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {filteredBrokerSubscribers.length === 0 ? (
                <View style={styles.emptyCard}>
                  <IconSymbol
                    ios_icon_name="person.slash"
                    android_material_icon_name="person-off"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.emptyText}>لا يوجد مشتركين لهذا البروكر</Text>
                </View>
              ) : (
                <View style={styles.tableContainer}>
                  {filteredBrokerSubscribers.map((subscriber, index) => (
                    <View key={index} style={styles.brokerCard}>
                      <View style={styles.brokerCardHeader}>
                        <Text style={styles.brokerCardName}>{subscriber.name}</Text>
                        <View style={styles.brokerBadge}>
                          <Text style={styles.brokerBadgeText}>{subscriber.brokerName}</Text>
                        </View>
                      </View>

                      <View style={styles.brokerCardRow}>
                        <Text style={styles.brokerCardLabel}>البريد الإلكتروني:</Text>
                        <Text style={styles.brokerCardValue}>{subscriber.email}</Text>
                      </View>

                      <View style={styles.brokerCardRow}>
                        <Text style={styles.brokerCardLabel}>رقم الحساب:</Text>
                        <Text style={styles.brokerCardValue}>{subscriber.accountNumber}</Text>
                      </View>

                      <View style={styles.brokerCardRow}>
                        <Text style={styles.brokerCardLabel}>تاريخ التسجيل:</Text>
                        <Text style={styles.brokerCardValue}>
                          {formatDateGregorian(subscriber.createdAt)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'opinions' && (
            <View>
              <Text style={styles.sectionTitle}>إدارة الآراء</Text>
              
              {pendingOpinions.length === 0 ? (
                <View style={styles.emptyCard}>
                  <IconSymbol
                    ios_icon_name="text.bubble"
                    android_material_icon_name="comment"
                    size={48}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.emptyText}>لا توجد آراء معلقة</Text>
                </View>
              ) : (
                <View style={styles.tableContainer}>
                  {pendingOpinions.map((opinion, index) => (
                    <View key={index} style={styles.opinionCard}>
                      <View style={styles.opinionHeader}>
                        <Text style={styles.opinionName}>{opinion.name}</Text>
                        <View style={styles.opinionBadge}>
                          <Text style={styles.opinionBadgeText}>معلق</Text>
                        </View>
                      </View>

                      <View style={styles.opinionRow}>
                        <Text style={styles.opinionLabel}>البريد الإلكتروني:</Text>
                        <Text style={styles.opinionValue}>{opinion.email}</Text>
                      </View>

                      <View style={styles.opinionRow}>
                        <Text style={styles.opinionLabel}>التاريخ:</Text>
                        <Text style={styles.opinionValue}>
                          {formatDateGregorian(opinion.created_at)}
                        </Text>
                      </View>

                      <View style={styles.opinionTextContainer}>
                        <Text style={styles.opinionLabel}>الرأي:</Text>
                        <Text style={styles.opinionText}>{opinion.opinion}</Text>
                      </View>

                      <View style={styles.opinionActions}>
                        <TouchableOpacity
                          style={styles.approveButton}
                          onPress={() => handleApproveOpinion(opinion.id)}
                          activeOpacity={0.7}
                        >
                          <IconSymbol
                            ios_icon_name="checkmark.circle.fill"
                            android_material_icon_name="check-circle"
                            size={20}
                            color="#FFFFFF"
                          />
                          <Text style={styles.approveButtonText}>موافقة</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteOpinion(opinion.id)}
                          activeOpacity={0.7}
                        >
                          <IconSymbol
                            ios_icon_name="trash.fill"
                            android_material_icon_name="delete"
                            size={20}
                            color="#FFFFFF"
                          />
                          <Text style={styles.deleteButtonText}>حذف</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        titleAr={modalConfig.titleAr}
        message={modalConfig.message}
        messageAr={modalConfig.messageAr}
      />

      <RNModal
        visible={paymentsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setPaymentsModalVisible(false);
          setSelectedSubscriberForPayments(null);
          setSubscriberPayments([]);
        }}
      >
        <View style={styles.paymentsModalOverlay}>
          <View style={styles.paymentsModalContent}>
            <View style={styles.paymentsModalHeader}>
              <Text style={styles.paymentsModalTitle}>سجل الدفعات</Text>
              <TouchableOpacity
                style={styles.paymentsModalCloseButton}
                onPress={() => {
                  console.log('User closed payments modal');
                  setPaymentsModalVisible(false);
                  setSelectedSubscriberForPayments(null);
                  setSubscriberPayments([]);
                }}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            {loadingSubscriberPayments ? (
              <View style={styles.paymentsLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.noPaymentsText}>جاري تحميل سجل الدفعات...</Text>
              </View>
            ) : (
              <ScrollView style={styles.paymentsScrollView} showsVerticalScrollIndicator={false}>
                {subscriberPayments.length > 0 ? (
                  subscriberPayments.map((payment, index) => {
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
                  <Text style={styles.noPaymentsText}>لا توجد دفعات مسجلة لهذا المشترك</Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </RNModal>

      <RNModal
        visible={documentModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDocumentModalVisible(false)}
      >
        <View style={styles.documentModalOverlay}>
          <View style={styles.documentModalContent}>
            <View style={styles.documentModalHeader}>
              <Text style={styles.documentModalTitle}>صورة الهوية / الجواز</Text>
              <TouchableOpacity
                style={styles.documentModalCloseButton}
                onPress={() => {
                  console.log('User closed document modal');
                  setDocumentModalVisible(false);
                  setSelectedDocumentUrl(null);
                  setImageLoadError(false);
                  setDocumentLoading(false);
                }}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.documentImageContainer}>
              {selectedDocumentUrl && !imageLoadError ? (
                <Image
                  source={{ uri: selectedDocumentUrl }}
                  style={styles.documentImage}
                  onLoadStart={() => {
                    console.log('Document image loading started for URL:', selectedDocumentUrl);
                    setDocumentLoading(true);
                    setImageLoadError(false);
                  }}
                  onLoadEnd={() => {
                    console.log('Document image loading completed successfully');
                    setDocumentLoading(false);
                  }}
                  onError={(error) => {
                    console.error('Document image loading error:', error.nativeEvent);
                    console.error('Failed URL:', selectedDocumentUrl);
                    setDocumentLoading(false);
                    setImageLoadError(true);
                  }}
                />
              ) : null}
              
              {documentLoading && !imageLoadError && (
                <View style={[styles.documentLoadingContainer, { position: 'absolute' }]}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.documentLoadingText}>جاري تحميل الصورة...</Text>
                </View>
              )}
              
              {imageLoadError && (
                <View style={styles.documentErrorContainer}>
                  <IconSymbol
                    ios_icon_name="exclamationmark.triangle.fill"
                    android_material_icon_name="error"
                    size={48}
                    color="#EF4444"
                  />
                  <Text style={styles.documentErrorTitle}>فشل تحميل الصورة</Text>
                  <Text style={styles.documentErrorMessage}>
                    لا يمكن عرض الصورة. يرجى تنزيل الملف للعرض.
                  </Text>
                  <Text style={styles.documentErrorUrl} numberOfLines={2}>
                    {selectedDocumentUrl}
                  </Text>
                </View>
              )}
            </View>

            {selectedDocumentUrl && (
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  style={styles.downloadDocumentButton}
                  onPress={async () => {
                    console.log('Download button pressed in modal');
                    console.log('Current URL:', selectedDocumentUrl);
                    await handleDownloadDocument(selectedDocumentUrl);
                  }}
                  disabled={downloadingDocument}
                  activeOpacity={0.7}
                >
                  {downloadingDocument ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <React.Fragment>
                      <IconSymbol
                        ios_icon_name="arrow.down.circle.fill"
                        android_material_icon_name="download"
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text style={styles.downloadDocumentButtonText}>تنزيل الملف</Text>
                    </React.Fragment>
                  )}
                </TouchableOpacity>
                
                {imageLoadError && (
                  <TouchableOpacity
                    style={[styles.downloadDocumentButton, { backgroundColor: '#6B7280' }]}
                    onPress={() => {
                      console.log('Retry loading image - resetting error state');
                      setImageLoadError(false);
                      setDocumentLoading(true);
                      const currentUrl = selectedDocumentUrl;
                      setSelectedDocumentUrl(null);
                      setTimeout(() => setSelectedDocumentUrl(currentUrl), 100);
                    }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      ios_icon_name="arrow.clockwise"
                      android_material_icon_name="refresh"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.downloadDocumentButtonText}>إعادة المحاولة</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </RNModal>
    </View>
  );
}
