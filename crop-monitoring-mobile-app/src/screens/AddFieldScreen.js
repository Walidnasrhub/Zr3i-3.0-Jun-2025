import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Polygon, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { fieldService } from '../../services/apiService';
import { storeData, getData, removeData } from '../../utils/offlineStorage';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

export default function AddFieldScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const [fieldName, setFieldName] = useState('');
  const [cropType, setCropType] = useState('');
  const [fieldSize, setFieldSize] = useState('');
  const [notes, setNotes] = useState('');
  const [drawingMode, setDrawingMode] = useState(null); // 'polygon' or 'circle'
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [circleCenter, setCircleCenter] = useState(null);
  const [circleRadius, setCircleRadius] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const mapRef = useRef(null);

  const styles = createStyles(theme, isRTL);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    loadOfflineFields();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      syncOfflineFields();
    }
  }, [isConnected]);

  const loadOfflineFields = async () => {
    const offlineFields = await getData('offlineFields');
    if (offlineFields) {
      // Optionally display these to the user or prepare for sync
      console.log('Loaded offline fields:', offlineFields);
    }
  };

  const syncOfflineFields = async () => {
    const offlineFields = await getData('offlineFields');
    if (offlineFields && offlineFields.length > 0) {
      Alert.alert(
        t('common.offlineData'),
        t('common.syncPrompt'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.syncNow'),
            onPress: async () => {
              setIsLoading(true);
              for (const field of offlineFields) {
                try {
                  await fieldService.createField(field);
                } catch (error) {
                  console.error('Error syncing field:', field, error);
                  // Handle individual field sync errors
                }
              }
              await removeData('offlineFields');
              setIsLoading(false);
              Alert.alert(t('common.success'), t('common.syncComplete'));
            },
          },
        ]
      );
    }
  };

  const handleMapPress = (e) => {
    if (drawingMode === 'polygon') {
      setPolygonCoordinates([...polygonCoordinates, e.nativeEvent.coordinate]);
    } else if (drawingMode === 'circle') {
      setCircleCenter(e.nativeEvent.coordinate);
    }
  };

  const handleCircleRadiusChange = (value) => {
    setCircleRadius(parseFloat(value));
  };

  const saveField = async () => {
    if (!fieldName || !cropType || !fieldSize) {
      Alert.alert(t('common.error'), t('fields.fillAllFields'));
      return;
    }

    let geojson = null;
    if (drawingMode === 'polygon' && polygonCoordinates.length >= 3) {
      geojson = {
        type: 'Polygon',
        coordinates: [[...polygonCoordinates.map(c => [c.longitude, c.latitude]), polygonCoordinates[0] ? [polygonCoordinates[0].longitude, polygonCoordinates[0].latitude] : []]],
      };
    } else if (drawingMode === 'circle' && circleCenter && circleRadius > 0) {
      geojson = {
        type: 'Point',
        coordinates: [circleCenter.longitude, circleCenter.latitude],
        radius: circleRadius,
      };
    } else {
      Alert.alert(t('common.error'), t('fields.drawFieldBoundary'));
      return;
    }

    const fieldData = {
      name: fieldName,
      crop_type: cropType,
      size: parseFloat(fieldSize),
      notes,
      geojson,
    };

    setIsLoading(true);
    try {
      if (isConnected) {
        await fieldService.createField(fieldData);
        Alert.alert(t('common.success'), t('fields.fieldAddedSuccessfully'));
      } else {
        const offlineFields = (await getData('offlineFields')) || [];
        offlineFields.push(fieldData);
        await storeData('offlineFields', offlineFields);
        Alert.alert(t('common.offline'), t('fields.fieldSavedOffline'));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('common.error'), t('fields.errorAddingField'));
      console.error('Error adding field:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('fields.addField')}</Text>
          <View style={{ width: 24 }} />{/* Spacer */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('fields.fieldDetails')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('fields.fieldName')}
            placeholderTextColor={theme.colors.textSecondary}
            value={fieldName}
            onChangeText={setFieldName}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t('fields.cropType')}
            placeholderTextColor={theme.colors.textSecondary}
            value={cropType}
            onChangeText={setCropType}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t('fields.fieldSize') + ' (' + t('fields.hectares') + ')'}
            placeholderTextColor={theme.colors.textSecondary}
            value={fieldSize}
            onChangeText={setFieldSize}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            placeholder={t('fields.notes')}
            placeholderTextColor={theme.colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('fields.drawFieldBoundary')}</Text>
          <View style={styles.drawingModeContainer}>
            <TouchableOpacity
              style={[
                styles.drawingModeButton,
                drawingMode === 'polygon' && styles.drawingModeButtonActive,
              ]}
              onPress={() => setDrawingMode('polygon')}
            >
              <Text style={styles.drawingModeButtonText}>{t('fields.drawPolygon')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.drawingModeButton,
                drawingMode === 'circle' && styles.drawingModeButtonActive,
              ]}
              onPress={() => setDrawingMode('circle')}
            >
              <Text style={styles.drawingModeButtonText}>{t('fields.drawCircle')}</Text>
            </TouchableOpacity>
          </View>

          {drawingMode === 'circle' && (
            <TextInput
              style={styles.textInput}
              placeholder={t('fields.circleRadius') + ' (meters)'}
              placeholderTextColor={theme.colors.textSecondary}
              value={circleRadius.toString()}
              onChangeText={handleCircleRadiusChange}
              keyboardType="numeric"
            />
          )}

          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 30.0,
              longitude: 31.0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {drawingMode === 'polygon' && polygonCoordinates.length > 0 && (
              <Polygon
                coordinates={polygonCoordinates}
                strokeColor={theme.colors.primary}
                fillColor={`${theme.colors.primary}33`}
                strokeWidth={2}
              />
            )}
            {drawingMode === 'circle' && circleCenter && circleRadius > 0 && (
              <Circle
                center={circleCenter}
                radius={circleRadius}
                strokeColor={theme.colors.primary}
                fillColor={`${theme.colors.primary}33`}
                strokeWidth={2}
              />
            )}
          </MapView>
          {drawingMode === 'polygon' && polygonCoordinates.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setPolygonCoordinates([])}>
              <Text style={styles.clearButtonText}>{t('fields.clearDrawing')}</Text>
            </TouchableOpacity>
          )}
          {drawingMode === 'circle' && circleCenter && (
            <TouchableOpacity style={styles.clearButton} onPress={() => { setCircleCenter(null); setCircleRadius(0); }}>
              <Text style={styles.clearButtonText}>{t('fields.clearDrawing')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveField} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <Text style={styles.saveButtonText}>{t('common.save')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
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
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.md,
    textAlign: isRTL ? 'right' : 'left',
  },
  drawingModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
  },
  drawingModeButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  drawingModeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}20`,
  },
  drawingModeButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  clearButton: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  clearButtonText: {
    color: theme.colors.card,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    margin: theme.spacing.lg,
  },
  saveButtonText: {
    color: theme.colors.card,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
});

