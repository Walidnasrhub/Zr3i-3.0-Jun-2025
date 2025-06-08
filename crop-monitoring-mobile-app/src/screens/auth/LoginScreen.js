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

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const styles = createStyles(theme, isRTL);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = t('errors.validationError');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.invalidEmail');
    }
    
    if (!password) {
      newErrors.password = t('errors.validationError');
    } else if (password.length < 6) {
      newErrors.password = t('auth.passwordTooShort');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert(t('errors.authError'), result.error);
      }
    } catch (error) {
      Alert.alert(t('errors.authError'), t('auth.loginError'));
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
            <Text style={styles.title}>{t('auth.loginTitle')}</Text>
            <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>{t('auth.signIn')}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.dontHaveAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpText}>{t('auth.signUp')}</Text>
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
  forgotPassword: {
    alignSelf: isRTL ? 'flex-start' : 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  loginButtonText: {
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
  signUpText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});

