import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
//import { styles } from './styles'; // varsa stil dosyan

export default function AddCityScreen() {
  const navigation = useNavigation();

  const handleSearch = () => {
    console.log('searched');
    navigation.navigate('CitiesWeather', { city: 'Istanbul' }); // örnek olarak
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Location</Text>

        <View style={styles.searchContainer}>
          <Icon
                      style={styles.icon}
                      name='search'
                      size={20}
                      color='#517fa4'
                      onPress={handleSearch} />
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#aaa"
          />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      
    },
    scrollContainer: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    input: {
      flex: 1,
      height: 40,
      fontSize: 16,
    },
    title: {
      marginTop: 15,
      paddingTop:15,
      fontSize: 24,
      marginBottom: 16,
      fontWeight: 'bold',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 12,
      backgroundColor: '#fff',  
      paddingHorizontal: 12,
    },
    icon: {
      opacity: 0.5,
      marginRight: 18,
      marginLeft: 8,
    }
  });