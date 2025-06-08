import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const styles = createStyles(theme, isRTL);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="leaf" size={60} color={theme.colors.primary} />
            </View>
            <Text style={styles.logoText}>Zr3i</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('auth.welcomeTitle')}</Text>
            <Text style={styles.subtitle}>{t('auth.welcomeSubtitle')}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Ionicons name="analytics-outline" size={24} color="white" />
              <Text style={styles.featureText}>Smart Monitoring</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="partly-sunny-outline" size={24} color="white" />
              <Text style={styles.featureText}>Weather Insights</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="shield-checkmark-outline" size={24} color="white" />
              <Text style={styles.featureText}>Risk Management</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.primaryButtonText}>{t('common.getStarted')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
    paddingTop: height * 0.1,
    paddingBottom: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
});

