import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert, Platform , Button} from 'react-native';
import styles from '../css/_styles';
import FileSelectorUpload from '../FileSelectorUpload';
import { useRouter } from "expo-router";

export default function Upload() {

  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>

      <Text style={styles.title}>Upload an Audio File</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 , color: '#023047'}}>📂 File Upload:</Text>
          <FileSelectorUpload/>
        
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
