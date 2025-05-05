import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function Header() {
    return (
        <View style={styles.headerContainer}>
                <Text style={styles.text}>CIELO</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',  // Sabitleriz
        top: 0,  // Üstte olmasını sağla
        left: 0,
        right: 0,
        backgroundColor: '#517fa4',  // Header'ın rengini belirleyin
        padding: 20,
        zIndex: 1,  // Diğer içeriklerin üstüne yazmasını sağlar

        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'New Times Roman',
        fontSize: 30,
    }

});