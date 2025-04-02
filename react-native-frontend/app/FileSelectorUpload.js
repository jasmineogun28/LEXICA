import React, { useState, useContext } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import axios from "axios";
import { ResponseContext } from "./context/ResponseContext";

const FileSelectorUpload = () => {
  const { setResponseData } = useContext(ResponseContext);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (Platform.OS === "web" && !file) {
      alert("Please select a file first!");
      return;
    }

    if (Platform.OS === "ios" && !selectedFile) {
      setError("Please select a file first!");
      return;
    }

    const formData = new FormData();
    if (Platform.OS === "web") {
      formData.append("file", file);
    } else {
      formData.append("file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType,
      });
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResponseData(res.data); // Store response globally
    } catch (err) {
      setError("Error uploading file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectFileIOS = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true
      });
      
      if (result.type === 'success') {
        setSelectedFile(result);
        setError(null);
      }
    } catch (err) {
      setError('Failed to select file');
      console.error(err);
    }
  };

  if (Platform.OS === "web") {
    return (
      <div className="container">
        <h2>Upload an Audio File</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an Audio File</Text>
      
      <Button
        title="Select Audio File"
        onPress={selectFileIOS}
        disabled={loading}
      />
      
      {selectedFile && (
        <Text style={styles.fileInfo}>
          Selected: {selectedFile.name}
        </Text>
      )}
      
      <Button
        title={loading ? "Uploading..." : "Upload"}
        onPress={handleUpload}
        disabled={loading || !selectedFile}
      />
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  fileInfo: {
    marginVertical: 15,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginTop: 10
  }
});

export default FileSelectorUpload;