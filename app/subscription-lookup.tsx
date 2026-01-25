
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
import { colors } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const backendUrl = Constants.expoConfig?.extra?.backendUrl || 'http://localhost:3000';

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
}

export default function SubscriptionLookupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      return;
    }

    console.log('Searching for subscription with query:', searchValue);
    setLoading(true);
    setNotFound(false);
    setSubscription(null);

    try {
      const body = { query: searchValue.trim() };

      console.log('Sending lookup request to backend:', body);

      const response = await fetch(`${backendUrl}/api/subscriptions/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Lookup response:', data);

      if (data.found && data.subscription) {
        setSubscription(data.subscription);
        setNotFound(false);
      } else {
        setSubscription(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error looking up subscription:', error);
      setNotFound(true);
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
    return channelMap[channelType.toLowerCase()] || channelType;
  };

  const getDurationArabic = (duration: string) => {
    const durationMap: Record<string, string> = {
      monthly: 'شهري',
      quarterly: 'ربع سنوي (3 أشهر)',
      yearly: 'سنوي',
    };
    return durationMap[duration.toLowerCase()] || duration;
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
    if (daysRemaining < 0) {
      return '#EF4444';
    }
    if (daysRemaining <= 7) {
      return '#F59E0B';
    }
    return '#10B981';
  };

  const getStatusText = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return 'منتهي';
    }
    if (daysRemaining === 0) {
      return 'ينتهي اليوم';
    }
    return 'نشط';
  };

  const cardDescriptionText = 'أدخل البريد الإلكتروني أو يوزر تلقرام للاستعلام عن حالة الاشتراك';
  const inputLabelText = 'البريد الإلكتروني أو يوزر تلقرام';
  const inputPlaceholderText = 'أدخل البريد الإلكتروني أو يوزر تلقرام';
  const notFoundDescriptionText = 'لا يوجد اشتراك مسجل بهذا البريد الإلكتروني أو يوزر تلقرام';

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 48 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>البحث عن الاشتراك</Text>
          <Text style={styles.cardDescription}>
            {cardDescriptionText}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{inputLabelText}</Text>
            <TextInput
              style={styles.input}
              placeholder={inputPlaceholderText}
              placeholderTextColor={colors.textSecondary}
              value={searchValue}
              onChangeText={setSearchValue}
              autoCapitalize="none"
              keyboardType="default"
            />
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading || !searchValue.trim()}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.searchButtonText}>بحث</Text>
            )}
          </TouchableOpacity>
        </View>

        {notFound && (
          <View style={styles.notFoundCard}>
            <IconSymbol
              ios_icon_name="exclamationmark.circle"
              android_material_icon_name="error"
              size={48}
              color="#EF4444"
            />
            <Text style={styles.notFoundTitle}>لم يتم العثور على اشتراك</Text>
            <Text style={styles.notFoundDescription}>
              {notFoundDescriptionText}
            </Text>
          </View>
        )}

        {subscription && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>معلومات الاشتراك</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(subscription.daysRemaining) },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {getStatusText(subscription.daysRemaining)}
                </Text>
              </View>
            </View>

            <View style={styles.resultSection}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>الاسم</Text>
                <Text style={styles.resultValue}>{subscription.name}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>البريد الإلكتروني</Text>
                <Text style={styles.resultValue}>{subscription.email}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>يوزر تلقرام</Text>
                <Text style={styles.resultValue}>{subscription.telegramUsername}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultSection}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>نوع القناة</Text>
                <Text style={styles.resultValue}>
                  {getChannelNameArabic(subscription.channelType)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>مدة الاشتراك</Text>
                <Text style={styles.resultValue}>
                  {getDurationArabic(subscription.subscriptionDuration)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>إجمالي الأشهر</Text>
                <Text style={styles.resultValue}>{subscription.totalMonths} شهر</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultSection}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>تاريخ البداية</Text>
                <Text style={styles.resultValue}>
                  {formatDateGregorian(subscription.subscriptionStartDate)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>تاريخ الانتهاء</Text>
                <Text style={styles.resultValue}>
                  {formatDateGregorian(subscription.subscriptionEndDate)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>الأيام المتبقية</Text>
                <Text
                  style={[
                    styles.resultValue,
                    styles.daysRemainingText,
                    { color: getStatusColor(subscription.daysRemaining) },
                  ]}
                >
                  {subscription.daysRemaining >= 0
                    ? `${subscription.daysRemaining} يوم`
                    : 'منتهي'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'right',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notFoundCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultSection: {
    gap: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginLeft: 16,
  },
  daysRemainingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
});
