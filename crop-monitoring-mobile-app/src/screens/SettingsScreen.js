import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const { t, changeLanguage, isRTL } = useLanguage();

  const styles = createStyles(theme, isRTL);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('navigation.settings')}</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
        <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
          <Text style={styles.settingText}>{t('settings.toggleTheme')}</Text>
          <Ionicons name="color-palette-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => changeLanguage('en')}>
          <Text style={styles.settingText}>{t('settings.english')}</Text>
          <Ionicons name="language-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => changeLanguage('ar')}>
          <Text style={styles.settingText}>{t('settings.arabic')}</Text>
          <Ionicons name="language-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL ? 'right' : 'left',
  },
  settingItem: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  settingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
});

