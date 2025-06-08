import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { fieldService } from '../services/apiService';

export default function FieldsScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const styles = createStyles(theme, isRTL);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    setIsLoading(true);
    const result = await fieldService.getFields();
    if (result.success) {
      setFields(result.data);
    } else {
      Alert.alert(t('common.error'), result.error);
    }
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFields();
    setIsRefreshing(false);
  };

  const handleDeleteField = async (fieldId) => {
    Alert.alert(
      t('fields.deleteField'),
      t('fields.deleteConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          onPress: async () => {
            const result = await fieldService.deleteField(fieldId);
            if (result.success) {
              Alert.alert(t('common.success'), t('fields.fieldDeleted'));
              loadFields();
            } else {
              Alert.alert(t('common.error'), result.error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderFieldItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fieldCard}
      onPress={() => navigation.navigate('FieldDetail', { field: item })}
    >
      <View style={styles.fieldInfo}>
        <Text style={styles.fieldName}>{item.name}</Text>
        <Text style={styles.fieldDetails}>
          {t('fields.cropType')}: {item.crop_type || t('common.notSpecified')}
        </Text>
        <Text style={styles.fieldDetails}>
          {t('fields.fieldSize')}: {item.size || t('common.notSpecified')} {t('fields.hectares')}
        </Text>
      </View>
      <View style={styles.fieldActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddField', { field: item })}
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteField(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('fields.myFields')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddField')}
        >
          <Ionicons name="add-circle-outline" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {isLoading && fields.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : fields.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={80} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>{t('fields.noFields')}</Text>
          <Text style={styles.emptySubtitle}>{t('fields.addFirstField')}</Text>
          <TouchableOpacity
            style={styles.addFirstFieldButton}
            onPress={() => navigation.navigate('AddField')}
          >
            <Text style={styles.addFirstFieldButtonText}>{t('fields.addField')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={fields}
          renderItem={renderFieldItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
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
  addButton: {
    padding: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  fieldCard: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  fieldInfo: {
    flex: 1,
    alignItems: isRTL ? 'flex-end' : 'flex-start',
  },
  fieldName: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  fieldDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  fieldActions: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  addFirstFieldButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
  },
  addFirstFieldButtonText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
});

