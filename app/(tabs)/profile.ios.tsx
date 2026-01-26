
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleAdminProfitPlans = () => {
    console.log('User tapped admin profit plans button');
    router.push('/admin-profit-plans');
  };

  const handleSubscriptionManagement = () => {
    console.log('User tapped subscription management button');
    router.push('/subscription-management-auth');
  };

  const handleSubscriptionLookup = () => {
    console.log('User tapped subscription lookup button');
    router.push('/subscription-lookup');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <GlassView style={styles.profileHeader} glassEffectStyle="regular">
          <IconSymbol ios_icon_name="person.circle.fill" android_material_icon_name="person" size={80} color={theme.colors.primary} />
          <Text style={[styles.name, { color: theme.colors.text }]}>Moza Al-Balushi</Text>
          <Text style={[styles.email, { color: theme.dark ? '#98989D' : '#666' }]}>SBM Trading Channels</Text>
        </GlassView>

        {/* Admin Section */}
        <GlassView style={styles.section} glassEffectStyle="regular">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Admin Tools</Text>
          <Text style={[styles.sectionTitleAr, { color: theme.dark ? '#98989D' : '#666' }]}>أدوات الإدارة</Text>
          
          <TouchableOpacity style={styles.adminButton} onPress={handleAdminProfitPlans} activeOpacity={0.7}>
            <IconSymbol ios_icon_name="doc.text.fill" android_material_icon_name="description" size={24} color={theme.colors.primary} />
            <View style={styles.adminButtonText}>
              <Text style={[styles.adminButtonTitle, { color: theme.colors.text }]}>Manage Profit Plan Files</Text>
              <Text style={[styles.adminButtonSubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>إدارة ملفات خطط الربح</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="arrow-forward" size={20} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.adminButton} onPress={handleSubscriptionManagement} activeOpacity={0.7}>
            <IconSymbol ios_icon_name="person.3.fill" android_material_icon_name="group" size={24} color={theme.colors.primary} />
            <View style={styles.adminButtonText}>
              <Text style={[styles.adminButtonTitle, { color: theme.colors.text }]}>Subscription Management</Text>
              <Text style={[styles.adminButtonSubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>إدارة الاشتراكات</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="arrow-forward" size={20} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.adminButton} onPress={handleSubscriptionLookup} activeOpacity={0.7}>
            <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={24} color={theme.colors.primary} />
            <View style={styles.adminButtonText}>
              <Text style={[styles.adminButtonTitle, { color: theme.colors.text }]}>Subscription Lookup</Text>
              <Text style={[styles.adminButtonSubtitle, { color: theme.dark ? '#98989D' : '#666' }]}>البحث عن الاشتراك</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="arrow-forward" size={20} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>
        </GlassView>

        {/* Contact Section */}
        <GlassView style={styles.section} glassEffectStyle="regular">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Information</Text>
          <Text style={[styles.sectionTitleAr, { color: theme.dark ? '#98989D' : '#666' }]}>معلومات الاتصال</Text>
          
          <View style={styles.infoRow}>
            <IconSymbol ios_icon_name="envelope.fill" android_material_icon_name="email" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>info@sbmtrading.com</Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol ios_icon_name="paperplane.fill" android_material_icon_name="send" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>Telegram: @SBMTrading</Text>
          </View>
        </GlassView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sectionTitleAr: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 8,
  },
  adminButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  adminButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  adminButtonSubtitle: {
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 16,
  },
});
