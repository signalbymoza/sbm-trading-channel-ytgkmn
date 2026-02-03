
// This is the base payment file that will be used as a fallback
// Expo Router will automatically use payment.native.tsx for iOS/Android
// and payment.web.tsx for web, so this file should rarely be loaded

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function PaymentScreen() {
  console.log('WARNING: Base payment.tsx loaded - platform-specific file should have been used');
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.message}>
          Please use the mobile app (iOS or Android) for payment processing.
        </Text>
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
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
