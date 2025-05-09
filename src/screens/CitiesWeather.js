import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native'; //for screen width
import { ImageBackground } from 'react-native';


//const { width } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;

export default function CitiesWeather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const [activeIndex, setActiveIndex] = useState(0);


  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentCity = viewableItems[0].item.city;
      navigation.setOptions({
        headerTitle: () => (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{currentCity}</Text>
          </View>
        )
      });
    }
  });

  useEffect(() => {
    const load = async () => {
      let saved = await AsyncStorage.getItem('cities');

      if (!saved) {
        // İlk kez çalışıyorsa örnek şehirler ekle
        const defaultCities = JSON.stringify(['Istanbul', 'Adana']);
        await AsyncStorage.setItem('cities', defaultCities);
        saved = defaultCities;
      }

      const cityList = JSON.parse(saved);
      await fetchWeatherForCities(cityList);
      setLoading(false);
    };
    load();
  }, []);

  const fetchWeatherForCities = async (cityList) => {
    const API_KEY = '50ac8d1c05d110a5086d2944320ac91d';
    const promises = cityList.map(async (cityName) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        return { city: cityName, data };
      } catch (err) {
        return { city: cityName, data: { cod: 500, message: 'Sunucu hatası' } };
      }
    });

    const results = await Promise.all(promises);
    setWeatherData(results);
  };

  function getWeatherEmoji(description) {
    if (description.includes('clear')) return '☀️'; 
    if (description.includes('few clouds')) return '🌤️'; // Az bulutlu
    if (description.includes('scattered clouds')) return '⛅'; // Parçalı
    if (description.includes('broken clouds')) return '🌥️'; // Çok bulutlu ama açıklıklar var
    if (description.includes('cloud')) return '☁️'; 
    if (description.includes('storm') || description.includes('thunder')) return '⛈️';
    if (description.includes('rain')) return '🌧️';
    if (description.includes('snow')) return '❄️';
    return '🌤️'; 
  }

  function getBackgroundImage(description) {
    if (description.includes('rain')) return require('../assets/backgrounds/rainy.png');
    if (description.includes('storm')) return require('../assets/backgrounds/stormy.png');
    if (description.includes('few')) return require('../assets/backgrounds/fewclouds.png');
    if (description.includes('scattered clouds') || description.includes('broken clouds')) return require('../assets/backgrounds/partlycloudy.png');
    if (description.includes('cloud')) return require('../assets/backgrounds/cloudyweather.png');
    if (description.includes('clear') || description.includes('sun')) return require('../assets/backgrounds/sunnyweather.png');
    if (description.includes('snow')) return require('../assets/backgrounds/snowy.png');
    return require('../assets/backgrounds/default.jpeg');
  }



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }




  return (
    <>
      <View style={styles.pagination}>
        {weatherData.slice(0, 4).map((_, index) => {
          const lastIndex = Math.min(weatherData.length - 1, 3);
          const displayIndex = Math.min(activeIndex, lastIndex); // Mavi nokta için kaydırma kontrolü

          return (
            <View
              key={index}
              style={[
                styles.dot,
                index === displayIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          );
        })}
      </View>

      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.city}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setActiveIndex(index);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          const description = item.data?.weather?.[0]?.description?.toLowerCase() || '';
          const backgroundImage = getBackgroundImage(description);

          return (
            <ImageBackground source={backgroundImage} style={styles.page} resizeMode="cover">
              {item.data.cod === 200 ? (
                <>
                  <Text style={{ fontSize: 50 }}>
                    {getWeatherEmoji(description)}
                  </Text>
                  <Text style={styles.temp}>{item.data.main.temp}°C</Text>
                  <Text style={styles.description}>{item.data.weather[0].description}</Text>
                </>
              ) : (
                <Text style={styles.errorText}>Error: {item.data.message}</Text>
              )}
            </ImageBackground>
          );
        }}

        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig}
      />

    </>

  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    width: screenWidth, // Dynamic
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },

  city: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temp: {
    fontSize: 28,
    color: 'tomato',
  },
  description: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5, // for flatlist closeness
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 12,
    height: 12,
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  }
});
