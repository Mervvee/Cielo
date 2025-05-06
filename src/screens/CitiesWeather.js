// src/screens/CitiesWeather.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CitiesWeather({ route }) {
  const { city } = route.params;
  const [weather, setWeather] = useState(null);//from api
  const [loading, setLoading] = useState(true);//is it loading?
  const navigation = useNavigation();// main navigation 

  useEffect(() => {
    fetchWeather();//runs one time when we run app
  }, []);

  const fetchWeather = async () => {
    try {
      const API_KEY = 'myapikey'; //my own api key gonna add and update later
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);//save the data to the state
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);// loading is done!
    }
  };

  if (loading) {// show spinner if it loads
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!weather || weather.cod !== 200) {//for ex if city is wrong or internet is off it will show error message.
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Hava durumu yüklenemedi.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { main, weather: weatherDetails } = weather; //ilk kısmı hava durumu varsa kullanıcıya gösteriyor ve durum detayını veriyor
  // ikinci kısım yeni şehir ekleme kısmı. buradan add cityye yönlendirilecek.
  return (
    <View style={styles.container}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.temp}>{main.temp}°C</Text>
      <Text style={styles.description}>{weatherDetails[0].description}</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('AddCity')} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add City</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  city: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  temp: { fontSize: 48, fontWeight: '200', marginBottom: 8 },
  description: { fontSize: 24, textTransform: 'capitalize' },
  errorText: { fontSize: 18, color: 'red', marginBottom: 16 },
  backButton: { marginTop: 16 },
  backButtonText: { fontSize: 16, color: '#517fa4' },
  addButton: { position: 'absolute', bottom: 32, padding: 12, backgroundColor: '#517fa4', borderRadius: 8 },
  addButtonText: { color: '#fff', fontSize: 16 },
});
