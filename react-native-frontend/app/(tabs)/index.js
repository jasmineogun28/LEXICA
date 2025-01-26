import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import styles from '../css/_styles';

export default function Index() {
  const handlePress = () => {
    Alert.alert('Pressable Pressed', 'You clicked the custom button!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Lexica!{'\n'}Tap a button below to get started</Text>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.buttonText}>Record New Audio</Text>
        </Pressable>

        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.buttonText}>Upload Audio</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};