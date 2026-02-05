
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  console.log('ProfileScreen (Web): Rendering profile screen with theme:', theme);

  const isDarkMode = theme === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 24,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    headerTitleAr: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    section: {
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    sectionTitleAr: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    settingCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingTextContainer: {
      marginLeft: 12,
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    settingTitleAr: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuTextContainer: {
      marginLeft: 12,
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    menuTitleAr: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    footer: {
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 20,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    footerTextAr: {
      fontSize: 11,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerTitleAr}>الملف الشخصي</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.sectionTitleAr}>الإعدادات</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <IconSymbol 
                ios_icon_name={isDarkMode ? "moon.fill" : "sun.max.fill"} 
                android_material_icon_name={isDarkMode ? "dark-mode" : "light-mode"} 
                size={24} 
                color={colors.highlight} 
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingTitleAr}>الوضع الداكن</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.highlight }}
              thumbColor={colors.text}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <IconSymbol 
                ios_icon_name="bell.fill" 
                android_material_icon_name="notifications" 
                size={24} 
                color={colors.highlight} 
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingTitleAr}>الإشعارات</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.highlight }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <Text style={styles.sectionTitleAr}>روابط سريعة</Text>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => {
              console.log('User tapped Subscription Management');
              router.push('/subscription-management-auth');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <IconSymbol 
                ios_icon_name="list.bullet.clipboard" 
                android_material_icon_name="assignment" 
                size={24} 
                color={colors.highlight} 
              />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Subscription Management</Text>
                <Text style={styles.menuTitleAr}>إدارة الاشتراكات</Text>
              </View>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => {
              console.log('User tapped Check Subscription Status');
              router.push('/subscription-lookup');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <IconSymbol 
                ios_icon_name="magnifyingglass" 
                android_material_icon_name="search" 
                size={24} 
                color={colors.highlight} 
              />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Check Subscription Status</Text>
                <Text style={styles.menuTitleAr}>الاستعلام عن الاشتراك</Text>
              </View>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => {
              console.log('User tapped About');
              router.push('/about');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <IconSymbol 
                ios_icon_name="info.circle" 
                android_material_icon_name="info" 
                size={24} 
                color={colors.highlight} 
              />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>About</Text>
                <Text style={styles.menuTitleAr}>حول</Text>
              </View>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 SBM Trading. All rights reserved.</Text>
          <Text style={styles.footerTextAr}>© 2024 SBM للتداول. جميع الحقوق محفوظة.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
