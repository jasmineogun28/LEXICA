import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert, Platform } from 'react-native';
import styles from '../css/_styles';
import AudioRecorderUpload from '../AudioRecorderUpload';
import { ResponseProvider } from '../context/ResponseContext';

export default function Record() {

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>

        {/* <ResponseProvider> */}
          <AudioRecorderUpload/>
        {/* </ResponseProvider> */}
        
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
