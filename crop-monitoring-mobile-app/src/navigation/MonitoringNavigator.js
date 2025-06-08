import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MonitoringScreen from '../screens/MonitoringScreen';
import SatelliteImageryScreen from '../screens/monitoring/SatelliteImageryScreen';
import WeatherScreen from '../screens/WeatherScreen';
import SoilWaterScreen from '../screens/monitoring/SoilWaterScreen';
import CropHealthScreen from '../screens/monitoring/CropHealthScreen';
import RiskAnalysisScreen from '../screens/monitoring/RiskAnalysisScreen';
import ComparativeAnalysisScreen from '../screens/ComparativeAnalysisScreen';

const Stack = createStackNavigator();

function MonitoringNavigator() {
  return (
    <Stack.Navigator initialRouteName="MonitoringHome">
      <Stack.Screen name="MonitoringHome" component={MonitoringScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SatelliteImagery" component={SatelliteImageryScreen} options={{ title: 'Satellite Imagery' }} />
      <Stack.Screen name="Weather" component={WeatherScreen} options={{ title: 'Weather & Environment' }} />
      <Stack.Screen name="SoilWater" component={SoilWaterScreen} options={{ title: 'Soil & Water' }} />
      <Stack.Screen name="CropHealth" component={CropHealthScreen} options={{ title: 'Crop Health' }} />
      <Stack.Screen name="RiskAnalysis" component={RiskAnalysisScreen} options={{ title: 'Risk Analysis' }} />
      <Stack.Screen name="ComparativeAnalysis" component={ComparativeAnalysisScreen} options={{ title: 'Comparative Analysis' }} />
    </Stack.Navigator>
  );
}

export default MonitoringNavigator;


