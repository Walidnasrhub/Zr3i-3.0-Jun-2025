import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import HomeScreen from './src/screens/HomeScreen';
import FieldsScreen from './src/screens/FieldsScreen';
import MonitoringScreen from './src/screens/MonitoringScreen';
import FarmToForkScreen from './src/screens/FarmToForkScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { registerForPushNotificationsAsync } from './src/utils/notifications';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MainTabs() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === t('navigation.home')) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === t('navigation.fields')) {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === t('navigation.monitoring')) {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === t('navigation.farmToFork')) {
            iconName = focused ? 'leaf' : 'leaf-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name={t('navigation.home')} component={HomeScreen} />
      <Tab.Screen name={t('navigation.fields')} component={FieldsScreen} />
      <Tab.Screen name={t('navigation.monitoring')} component={MonitoringScreen} />
      <Tab.Screen name={t('navigation.farmToFork')} component={FarmToForkScreen} />
    </Tab.Navigator>
  );
}

function MainDrawer() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerLabelStyle: {
          fontSize: theme.fontSize.md,
        },
      }}
    >
      <Drawer.Screen name={t('navigation.main')} component={MainTabs} />
      <Drawer.Screen name={t('navigation.settings')} component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

function AppContent() {
  const { authState } = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      {authState.isAuthenticated ? <MainDrawer /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}


