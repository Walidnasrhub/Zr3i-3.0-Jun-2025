import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AffiliateRegistrationScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    website: '',
    tax_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    payout_method: 'bank_transfer',
    notes: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.email || !formData.first_name || !formData.last_name) {
      Alert.alert(
        t('affiliate.error'),
        t('affiliate.requiredFieldsError')
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/affiliates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          t('affiliate.success'),
          t('affiliate.registrationSuccess'),
          [
            {
              text: t('common.ok'),
              onPress: () => navigation.navigate('AffiliateDashboard')
            }
          ]
        );
      } else {
        Alert.alert(
          t('affiliate.error'),
          data.error || t('affiliate.registrationError')
        );
      }
    } catch (error) {
      Alert.alert(
        t('affiliate.error'),
        t('affiliate.networkError')
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    benefitsSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    benefitsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    benefitIcon: {
      marginRight: theme.spacing.md,
    },
    benefitText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
    },
    formSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputGroup: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    picker: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    termsSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
    },
    termsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    termItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    termBullet: {
      color: theme.colors.primary,
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    termText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('affiliate.joinProgram')}</Text>
          <Text style={styles.headerSubtitle}>{t('affiliate.commissionRate')}</Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>{t('affiliate.whyJoin')}</Text>
          
          <View style={styles.benefitItem}>
            <Ionicons name="cash" size={24} color={theme.colors.primary} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>{t('affiliate.benefit1')}</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="trending-up" size={24} color={theme.colors.primary} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>{t('affiliate.benefit2')}</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="megaphone" size={24} color={theme.colors.primary} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>{t('affiliate.benefit3')}</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="analytics" size={24} color={theme.colors.primary} style={styles.benefitIcon} />
            <Text style={styles.benefitText}>{t('affiliate.benefit4')}</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('affiliate.personalInfo')}</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.firstName')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.first_name}
                onChangeText={(value) => handleInputChange('first_name', value)}
                placeholder={t('affiliate.firstNamePlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.lastName')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.last_name}
                onChangeText={(value) => handleInputChange('last_name', value)}
                placeholder={t('affiliate.lastNamePlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('affiliate.email')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder={t('affiliate.emailPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.phone')}</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder={t('affiliate.phonePlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.company')}</Text>
              <TextInput
                style={styles.input}
                value={formData.company_name}
                onChangeText={(value) => handleInputChange('company_name', value)}
                placeholder={t('affiliate.companyPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('affiliate.website')}</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(value) => handleInputChange('website', value)}
              placeholder={t('affiliate.websitePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('affiliate.addressInfo')}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('affiliate.address1')}</Text>
            <TextInput
              style={styles.input}
              value={formData.address_line1}
              onChangeText={(value) => handleInputChange('address_line1', value)}
              placeholder={t('affiliate.address1Placeholder')}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('affiliate.address2')}</Text>
            <TextInput
              style={styles.input}
              value={formData.address_line2}
              onChangeText={(value) => handleInputChange('address_line2', value)}
              placeholder={t('affiliate.address2Placeholder')}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.city')}</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder={t('affiliate.cityPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.state')}</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                placeholder={t('affiliate.statePlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.postalCode')}</Text>
              <TextInput
                style={styles.input}
                value={formData.postal_code}
                onChangeText={(value) => handleInputChange('postal_code', value)}
                placeholder={t('affiliate.postalCodePlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('affiliate.country')}</Text>
              <TextInput
                style={styles.input}
                value={formData.country}
                onChangeText={(value) => handleInputChange('country', value)}
                placeholder={t('affiliate.countryPlaceholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('affiliate.additionalInfo')}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('affiliate.taxId')}</Text>
            <TextInput
              style={styles.input}
              value={formData.tax_id}
              onChangeText={(value) => handleInputChange('tax_id', value)}
              placeholder={t('affiliate.taxIdPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('affiliate.aboutYourself')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder={t('affiliate.aboutYourselfPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>{t('affiliate.submitApplication')}</Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>{t('affiliate.programTerms')}</Text>
          
          <View style={styles.termItem}>
            <Text style={styles.termBullet}>•</Text>
            <Text style={styles.termText}>{t('affiliate.term1')}</Text>
          </View>
          
          <View style={styles.termItem}>
            <Text style={styles.termBullet}>•</Text>
            <Text style={styles.termText}>{t('affiliate.term2')}</Text>
          </View>
          
          <View style={styles.termItem}>
            <Text style={styles.termBullet}>•</Text>
            <Text style={styles.termText}>{t('affiliate.term3')}</Text>
          </View>
          
          <View style={styles.termItem}>
            <Text style={styles.termBullet}>•</Text>
            <Text style={styles.termText}>{t('affiliate.term4')}</Text>
          </View>
          
          <View style={styles.termItem}>
            <Text style={styles.termBullet}>•</Text>
            <Text style={styles.termText}>{t('affiliate.term5')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AffiliateRegistrationScreen;

