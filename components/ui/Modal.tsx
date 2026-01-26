
import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  titleAr?: string;
  message?: string;
  messageAr?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  confirmTextAr?: string;
  onConfirm?: () => void;
  cancelText?: string;
  cancelTextAr?: string;
  showCancel?: boolean;
}

export default function Modal({
  visible,
  onClose,
  title,
  titleAr,
  message,
  messageAr,
  type = 'info',
  confirmText = 'OK',
  confirmTextAr = 'حسناً',
  onConfirm,
  cancelText = 'Cancel',
  cancelTextAr = 'إلغاء',
  showCancel = false,
}: ModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          ios: 'checkmark.circle.fill',
          android: 'check-circle',
          color: colors.success,
        };
      case 'error':
        return {
          ios: 'xmark.circle.fill',
          android: 'error',
          color: '#FF4444',
        };
      case 'warning':
        return {
          ios: 'exclamationmark.triangle.fill',
          android: 'warning',
          color: '#FFA500',
        };
      default:
        return {
          ios: 'info.circle.fill',
          android: 'info',
          color: colors.highlight,
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name={iconConfig.ios}
              android_material_icon_name={iconConfig.android}
              size={48}
              color={iconConfig.color}
            />
          </View>

          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {titleAr && <Text style={styles.titleAr}>{titleAr}</Text>}
            </View>
          )}

          {message && (
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{message}</Text>
              {messageAr && <Text style={styles.messageAr}>{messageAr}</Text>}
            </View>
          )}

          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                {cancelTextAr && (
                  <Text style={styles.cancelButtonTextAr}>{cancelTextAr}</Text>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, showCancel && styles.buttonHalf]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
              {confirmTextAr && (
                <Text style={styles.confirmButtonTextAr}>{confirmTextAr}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: colors.border,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleAr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  messageAr: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonHalf: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  confirmButtonTextAr: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  cancelButtonTextAr: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
