import React, { useState, useContext, useEffect } from "react";
import { View, Text, Button, StyleSheet, Platform, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { ResponseContext } from "./context/ResponseContext.js";
import { useRouter } from "expo-router";
import config from "../constants/config.json";

const FileSelectorUpload = () => {
  const { responseData, setResponseData } = useContext(ResponseContext);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    console.log("Uploading state changed:", uploading);
  }, [uploading]);

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
      const res = await axios.post("https://lexica-3tmd.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // const res = await axios.post(`${config.API_BASE_URL}/upload`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      console.log("Using API base URL:", config.API_BASE_URL);

      console.log("***Received response:", res.data);
      setResponseData(res.data); // Store response globally
      setUploading(true); // Set uploading to true when upload is complete
      console.log("Uploading state set to true");
      router.push("/(tabs)/vocabWrapped"); 
    } catch (err) {
      setError("Error uploading file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    console.log("Navigating to vocabWrapped page");
    router.push("/(tabs)/vocabWrapped"); 
  };

  const selectFileIOS = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        setSelectedFile(result);
        setError(null);
      }
    } catch (err) {
      setError("Failed to select file");
      console.error(err);
    }
  };

  if (Platform.OS === "web") {
    return (
      <div className="container">
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
      <Button
        title="Select Audio File"
        onPress={selectFileIOS}
        disabled={loading}
      />

      {selectedFile && (
        <Text style={styles.fileInfo}>Selected: {selectedFile.name}</Text>
      )}

      <Button
        title={loading ? "Uploading..." : "Upload"}
        onPress={handleUpload}
        disabled={loading || !selectedFile}
      />

    <Button
        title={loading ? "Wait..." : "Click to go to Next page"}
        onPress={handleNext}
        disabled={loading || !selectedFile}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  fileInfo: {
    marginVertical: 15,
    color: "#666",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FileSelectorUpload;