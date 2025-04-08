import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert, Platform , Button} from 'react-native';
import styles from '../css/_styles';
import FileSelectorUpload from '../FileSelectorUpload';
// import { FileResponseProvider } from "../context/FileResponseContext";
import { ResponseProvider } from '../context/ResponseContext';
import { useRouter } from "expo-router";

export default function Upload() {

  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>

        {/* <ResponseProvider> */}
          <FileSelectorUpload/>

          {/* <Button title="wrapped" onPress={() => router.push("/(tabs)/vocabWrapped")} /> */}
        {/* </ResponseProvider> */}
        
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
