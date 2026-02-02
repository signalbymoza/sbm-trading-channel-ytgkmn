
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme, colors } = useTheme();

  console.log('ProfileScreen: Rendering profile screen with theme:', theme);

  const handleAboutPress = () => {
    console.log('User tapped About button');
    router.push('/about');
  };

  const handleThemeToggle = () => {
    console.log('User tapped theme toggle button');
    toggleTheme();
  };

  // Reduced padding for mobile-friendly layout
  const topPaddingTop = Platform.OS === 'android' ? Math.max(insets.top + 8, 56) : insets.top;

  const themeLabel = theme === 'dark' ? 'خلفية داكنة' : 'خلفية فاتحة';
  const themeDescription = theme === 'dark' 
    ? 'اضغط للتبديل إلى خلفية فاتحة' 
    : 'اضغط للتبديل إلى خلفية داكنة';
  const toggleButtonText = theme === 'dark' ? 'تبديل إلى خلفية فاتحة' : 'تبديل إلى خلفية داكنة';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: topPaddingTop,
      paddingHorizontal: 24,
      paddingBottom: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    section: {
      paddingHorizontal: 24,
      paddingTop: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    themeCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    themeInfo: {
      flex: 1,
    },
    themeLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    themeDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    toggleButton: {
      backgroundColor: colors.highlight,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 12,
    },
    toggleButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    menuItemText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 16,
      flex: 1,
    },
    infoSection: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 40,
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <Text style={styles.headerSubtitle}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Toggle Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المظهر / Appearance</Text>
          
          <View style={styles.themeCard}>
            <View style={styles.themeHeader}>
              <View style={styles.themeInfo}>
                <Text style={styles.themeLabel}>{themeLabel}</Text>
                <Text style={styles.themeDescription}>{themeDescription}</Text>
              </View>
              <IconSymbol 
                ios_icon_name={theme === 'dark' ? 'moon.fill' : 'sun.max.fill'} 
                android_material_icon_name={theme === 'dark' ? 'nightlight' : 'wb-sunny'} 
                size={32} 
                color={colors.highlight} 
              />
            </View>
            
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={handleThemeToggle}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleButtonText}>
                {toggleButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>القائمة / Menu</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleAboutPress}
              activeOpacity={0.7}
            >
              <IconSymbol 
                ios_icon_name="info.circle.fill" 
                android_material_icon_name="info" 
                size={24} 
                color={colors.highlight} 
              />
              <Text style={styles.menuItemText}>حول التطبيق / About</Text>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron-right" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>SBM Trading Channels</Text>
            <Text style={styles.infoText}>
              قنوات التداول المتميزة - Premium Trading Channels
            </Text>
            <Text style={[styles.infoText, { marginTop: 12 }]}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
