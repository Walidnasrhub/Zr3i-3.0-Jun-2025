import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const styles = createStyles(theme, isRTL);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.validationError');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.validationError');
    }
    
    if (!formData.email) {
      newErrors.email = t('errors.validationError');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.invalidEmail');
    }
    
    if (!formData.password) {
      newErrors.password = t('errors.validationError');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.passwordTooShort');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await register(formData);
      if (!result.success) {
        Alert.alert(t('errors.authError'), result.error);
      }
    } catch (error) {
      Alert.alert(t('errors.authError'), t('auth.registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name={isRTL ? "chevron-forward" : "chevron-back"}
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>{t('auth.registerTitle')}</Text>
            <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.firstNamePlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.firstName}
                onChangeText={(value) => updateFormData('firstName', value)}
              />
            </View>
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.lastNamePlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.lastName}
                onChangeText={(value) => updateFormData('lastName', value)}
              />
            </View>
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.phoneNumberPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData('phoneNumber', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>{t('auth.signUp')}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.alreadyHaveAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: isRTL ? 'right' : 'left',
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: isRTL ? 'right' : 'left',
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.text,
    marginHorizontal: theme.spacing.sm,
    textAlign: isRTL ? 'right' : 'left',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.md,
    textAlign: isRTL ? 'right' : 'left',
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginTop: theme.spacing.md,
  },
  registerButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  footer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
  signInText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});

