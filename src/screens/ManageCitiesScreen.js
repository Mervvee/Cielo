import React, { useEffect, useState } from 'react';// taking data and storing it in the interface(hooks)
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


//2. Bileşen ve şehirleri alma:

export default function ManageCitiesScreen() {
    const [cityList, setCityList] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        try {
            const stored = await AsyncStorage.getItem('cities');
            if (stored) {
                setCityList(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Cities could not be fetched:', err);
        }
    };

    //3. Şehre tıklayınca detay sayfasına git:
    const goToCityWeather = (city) => {
        navigation.navigate('CitiesWeather', { city });
    };

    //4. Şehri sil:
    const deleteCity = async (city) => {
        Alert.alert(
            'Delete City',
            `"Do you want to delete ${city} from list"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',

                    onPress: async () => {
                        const newList = cityList.filter(c => c !== city);
                        setCityList(newList);
                        await AsyncStorage.setItem('cities', JSON.stringify(newList));
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    // 5. Liste görünümü:
    return (
        <View style={styles.container}>
            <FlatList
                data={cityList}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.cityRow}>
                        <TouchableOpacity
                            style={styles.cityItem}
                            onPress={() => goToCityWeather(item)}
                        >
                            <Text style={styles.cityText}>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteCity(item)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>❌</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No registered city.</Text>}
            />
        </View>
    );
}


//6. Basit stil:
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    cityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f1f1f1',
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderRadius: 8,
    },
    cityItem: {
      flex: 1,
    },
    cityText: {
      fontSize: 18,
    },
    deleteButton: {
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    deleteText: {
      fontSize: 18,
      color: 'red',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 32,
      fontSize: 16,
      color: '#888',
    }
});
