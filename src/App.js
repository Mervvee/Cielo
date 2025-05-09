import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddCityScreen from './screens/AddCityScreen.js';
import CitiesWeather from './screens/CitiesWeather.js';
import ManageCitiesScreen from './screens/ManageCitiesScreen'; // doğru dosya yolunu yaz


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddCity">
        <Stack.Screen name="AddCity" component={AddCityScreen} options={{ title: 'Add Location' }} />
        <Stack.Screen
          name="CitiesWeather"
          component={CitiesWeather}
          options={({ navigation }) => ({
            title: 'Weather Info',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddCity')}>
                <Text style={{ fontSize: 24, marginRight: 15 }}>＋</Text>
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen name="ManageCities" component={ManageCitiesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
