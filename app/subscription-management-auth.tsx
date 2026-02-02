
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import Modal from '@/components/ui/Modal';

const ADMIN_PASSWORD = 'admin123';

export default function SubscriptionManagementAuthScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  console.log('SubscriptionManagementAuthScreen: Rendering password prompt');

  const handleSubmit = () => {
    console.log('User attempting to access subscription management');
    
    if (password === ADMIN_PASSWORD) {
      console.log('Password correct, navigating to subscription management');
      router.replace('/subscription-management');
    } else {
      console.log('Password incorrect');
      setModalVisible(true);
      setPassword('');
    }
  };

  const passwordLabel = 'كلمة المرور';
  const submitButtonText = 'دخول';
  const titleText = 'إدارة الاشتراكات';
  const subtitleText = 'يرجى إدخال كلمة المرور للوصول';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { 
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? 48 : insets.top 
      }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{titleText}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={64}
            color={colors.primary}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{titleText}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitleText}</Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>{passwordLabel}</Text>
          <View style={[styles.passwordInputWrapper, { 
            backgroundColor: colors.card,
            borderColor: colors.border 
          }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="أدخل كلمة المرور"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                android_material_icon_name={showPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={[styles.submitButtonText, { color: '#FFFFFF' }]}>{submitButtonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal for incorrect password */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type="error"
        title="Incorrect Password"
        titleAr="كلمة المرور غير صحيحة"
        message="The password you entered is incorrect. Please try again."
        messageAr="كلمة المرور التي أدخلتها غير صحيحة. يرجى المحاولة مرة أخرى."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'right',
  },
  eyeButton: {
    padding: 16,
  },
  submitButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
