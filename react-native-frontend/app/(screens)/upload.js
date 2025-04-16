import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FileSelectorUpload from '../FileSelectorUpload';
import { useRouter } from "expo-router";

export default function Upload() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an Audio/Text File</Text>
      <Text style={styles.text}>supported file extensions: ".wav", ".mp3", ".flac", ".m4a"".txt", ".doc", ".docx"</Text>
      <Text style={styles.subtitle}>📂 File Upload:</Text>
      <FileSelectorUpload />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0eef0',
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: '700',
    color: '#023047',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#023047',
    marginBottom: 10,
  },
  text: {
    fontSize: 25,
    color: "#023047",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "sans-serif",
  },
});
