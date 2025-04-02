import React, { useState } from "react";
import { View, Button, Text, StyleSheet, Platform, Alert, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const router = useRouter();

  const handleFileChange = async (event) => {
    if (Platform.OS === "web") {
      // Web: Use input element
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    } else {
      // iOS/Android: Use DocumentPicker
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "audio/*", // Only allow audio files
        });

        if (result.canceled) return;

        const pickedFile = result.assets[0]; // Adjusted for Expo SDK 49+
        setFile(pickedFile);
      } catch (error) {
        Alert.alert("Error", "Failed to pick a file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a file first!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: "audio/m4a",
    });

    console.log("FormData:", formData); // Debugging line

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          // "Content-Type": "form-data", // Ensure the header is set correctly
        },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const responseData = await res.json();
      console.log("Response:", responseData);
      Alert.alert("Success", `Upload successful! File: ${file.name}`);

      setUploadComplete(true);
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", `Error uploading file: ${file.name}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  console.log("Selected file:", file);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an Audio File</Text>

      {/* Web: Use input tag */}
      {Platform.OS === "web" && (
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      )}

      {/* iOS/Android: Use Button for Document Picker */}
      {Platform.OS !== "web" && (
        <Button title="Choose File" onPress={handleFileChange} />
      )}

      {file && <Text>Selected file: {file.name}</Text>}

      <View style={styles.button}>
        <Button title="Upload File" onPress={handleUpload} disabled={!file || uploading} />
      </View>
      {uploading && <Text>Uploading...</Text>}

      {uploading && <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 10 }} />}

      {/* Show button only when upload is complete */}
      {uploadComplete && (
        <View style={styles.button}>
          <Button
            title="Go to Next Page"
            onPress={() => router.push("/(tabs)/vocabWrapped")}
            color="green"
          />
        </View>
      )}

      <View style={styles.button}>
        <Button title="View your results" onPress={() => router.push("/(tabs)/vocabWrapped")} />
      </View>

      <View style={styles.button}>
        <Button title="to home" onPress={() => router.push("/(tabs)/home")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#023047",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#219ebc",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  button: {
    marginBottom: 10, // Add margin bottom to create space between buttons
  },
});

export default FileUpload;
