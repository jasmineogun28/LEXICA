import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert, Platform } from 'react-native';
import styles from '../css/_styles';
// import FileUpload from "../FileUpload";
import AudioRecorderUpload from '../AudioRecorderUpload';
import FileSelectorUpload from '../FileSelectorUpload';

export default function Home() {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to Lexica!{'\n'}Tap a button below to get started
      </Text>

      <View style={styles.buttonRow}>

        {/* <FileUpload /> */}

        <AudioRecorderUpload/>
        <FileSelectorUpload/>

      </View>

      <StatusBar style="auto" />
    </View>
  );
}
