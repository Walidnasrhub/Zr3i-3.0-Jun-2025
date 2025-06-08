import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { farmToForkService } from '../../services/apiService';

const { width } = Dimensions.get('window');

export default function FarmToForkScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  const styles = createStyles(theme, isRTL);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setIsLoading(false);
    }
  };

  const uploadTraceabilityData = async () => {
    if (!capturedImage || !location || !statusUpdate) {
      Alert.alert(t('common.error'), t('farmToFork.fillAllFields'));
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri: capturedImage, name: 'trace_image.jpg', type: 'image/jpeg' });
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('timestamp', new Date().toISOString());
      formData.append('statusUpdate', statusUpdate);

      // In a real app, you would send this to your backend:
      // const result = await farmToForkService.uploadTraceData(formData);
      // if (result.success) {
      //   Alert.alert(t('common.success'), t('farmToFork.uploadSuccess'));
      //   setCapturedImage(null);
      //   setStatusUpdate('');
      // } else {
      //   Alert.alert(t('common.error'), t('farmToFork.uploadFailed'));
      // }
      Alert.alert(t('common.success'), t('farmToFork.uploadSuccess'));
      setCapturedImage(null);
      setStatusUpdate('');

    } catch (error) {
      Alert.alert(t('common.error'), t('farmToFork.uploadFailed'));
      console.error('Error uploading traceability data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t('farmToFork.requestingCameraPermission')}</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('farmToFork.noCameraAccess')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('farmToFork.farmToForkTraceability')}</Text>
          <View style={{ width: 24 }} />{/* Spacer */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('farmToFork.captureImage')}</Text>
          <View style={styles.cameraContainer}>
            {capturedImage ? (
              <Image source={{ uri: capturedImage }} style={styles.camera} />
            ) : (
              <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}
                  >
                    <Text style={styles.text}>{t('farmToFork.flipCamera')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.text}>{t('farmToFork.takePhoto')}</Text>
                  </TouchableOpacity>
                </View>
              </Camera>
            )}
          </View>
          {capturedImage && (
            <TouchableOpacity style={styles.retakeButton} onPress={() => setCapturedImage(null)}>
              <Text style={styles.retakeButtonText}>{t('farmToFork.retakePhoto')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('farmToFork.locationAndTimestamp')}</Text>
          <View style={styles.dataCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('farmToFork.latitude')}:</Text>
              <Text style={styles.detailValue}>{location ? location.latitude.toFixed(4) : t('common.notAvailable')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('farmToFork.longitude')}:</Text>
              <Text style={styles.detailValue}>{location ? location.longitude.toFixed(4) : t('common.notAvailable')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('farmToFork.timestamp')}:</Text>
              <Text style={styles.detailValue}>{new Date().toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('farmToFork.statusUpdate')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('farmToFork.enterStatusUpdate')}
            placeholderTextColor={theme.colors.textSecondary}
            value={statusUpdate}
            onChangeText={setStatusUpdate}
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={uploadTraceabilityData}
          disabled={isLoading || !capturedImage || !location || !statusUpdate}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <Text style={styles.uploadButtonText}>{t('farmToFork.uploadTraceData')}</Text>
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
  cameraContainer: {
    width: '100%',
    height: 300,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  button: {
    flex: 0.5,
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  retakeButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  retakeButtonText: {
    color: theme.colors.card,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  dataCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: isRTL ? 'right' : 'left',
  },
  detailValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '500',
    textAlign: isRTL ? 'left' : 'right',
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    minHeight: 100,
    textAlignVertical: 'top',
    textAlign: isRTL ? 'right' : 'left',
  },
  uploadButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    margin: theme.spacing.lg,
  },
  uploadButtonText: {
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

