import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddCityScreen from './screens/AddCityScreen.js';
import CitiesWeather from './screens/CitiesWeather.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddCity">
        <Stack.Screen name="AddCity" component={AddCityScreen} options={{ title: 'Add Location' }} />
        <Stack.Screen name="CitiesWeather" component={CitiesWeather} options={{ title: 'Weather Info' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
