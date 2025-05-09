import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cities from '../data/cities.json';

export default function AddCityScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  // query değiştikçe JSON dosyasını filtrele
  useEffect(() => {
    if (query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      const matches = cities.filter((city) =>
        city.toLowerCase().includes(q)
      );
      setFiltered(matches);
    } else {
      setFiltered([]);
    }
  }, [query]);

  // Seçilen şehri kaydet ve hava durumu ekranına geç
  const handleSelectCity = async (selectedCity) => {
    try {
      // 1) AsyncStorage'den mevcut şehirleri al
      const existing = await AsyncStorage.getItem('cities');
      const cityList = existing ? JSON.parse(existing) : [];

      // 2) Eğer listede yoksa ekle
      if (!cityList.includes(selectedCity)) {
        await AsyncStorage.setItem(
          'cities',
          JSON.stringify([...cityList, selectedCity])
        );
      }

      // 3) Klavyeyi kapat ve arayüzü temizle
      Keyboard.dismiss();
      setQuery('');
      setFiltered([]);

      // 4) Navigasyon: CitiesWeather ekranına city parametresi ile geç
      navigation.navigate('CitiesWeather', { city: selectedCity });
    } catch (e) {
      console.error('Şehir seçme hatası', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          style={styles.list}
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => handleSelectCity(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('ManageCities')}
        style={styles.manageButton}
      >
        <Text style={styles.manageButtonText}>Manage Cities</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  list: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    maxHeight: 250,
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemText: { fontSize: 16 },
  manageButton: {
    marginTop: 10,
    backgroundColor: '#517fa4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  manageButtonText: {
    color: 'white',
    fontSize: 16,
  }
});
