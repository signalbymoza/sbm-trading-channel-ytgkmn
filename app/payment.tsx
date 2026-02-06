
// This file serves as the base payment route
// Platform-specific implementations:
// - payment.native.tsx for iOS/Android (uses Stripe native SDK)
// - payment.web.tsx for web (uses Stripe.js)

// This fallback should rarely be seen as platform-specific files take precedence
// If you see this screen, check that platform-specific files are properly configured

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function PaymentScreen() {
  const router = useRouter();
  
  console.log('PaymentScreen (Base): Fallback payment screen loaded - this should not happen');
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconSymbol 
          ios_icon_name="exclamationmark.triangle.fill" 
          android_material_icon_name="warning" 
          size={48} 
          color={colors.warning} 
        />
        <Text style={styles.title}>Payment Screen</Text>
        <Text style={styles.subtitle}>Platform Configuration Issue</Text>
        <Text style={styles.text}>
          The platform-specific payment screen failed to load.
        </Text>
        <Text style={styles.textAr}>
          فشل تحميل شاشة الدفع الخاصة بالمنصة.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Go Back</Text>
          <Text style={styles.buttonTextAr}>العودة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  textAr: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  buttonTextAr: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
});
