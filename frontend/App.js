import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import TestScreen from './src/screens/TestScreen';
import ConnectionTestScreen from './src/screens/ConnectionTestScreen';
import DriversScreen from './src/screens/DriversScreen';
import VehiclesScreen from './src/screens/VehiclesScreen';
import TripsScreen from './src/screens/TripsScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Mini TMS' }}
        />
        
        <Stack.Screen 
          name="Test" 
          component={TestScreen}
          options={{ title: 'Test Screen' }}
        />
        
        <Stack.Screen 
          name="ConnectionTest" 
          component={ConnectionTestScreen}
          options={{ title: 'Connection Test' }}
        />
        
        <Stack.Screen 
          name="Drivers" 
          component={DriversScreen}
          options={{ title: 'Drivers Management' }}
        />
        
        <Stack.Screen 
          name="Vehicles" 
          component={VehiclesScreen}
          options={{ title: 'Vehicles Management' }}
        />
        
        <Stack.Screen 
          name="Trips" 
          component={TripsScreen}
          options={{ title: 'Trips Management' }}
        />
        
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}