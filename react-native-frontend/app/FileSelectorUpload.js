import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { ResponseContext } from "./context/ResponseContext.js";
import { useRouter } from "expo-router";
import config from "../constants/config.js";

const FileSelectorUpload = () => {
  const { responseData, setResponseData } = useContext(ResponseContext);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (Platform.OS === "web" && !file) {
      alert("Please select a file first!");
      return;
    }

    if (Platform.OS !== "web" && !selectedFile) {
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
        type: selectedFile.mimeType || "application/octet-stream",
      });
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setShowNextButton(false);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = Math.min(prev + 5, 95);
        Animated.timing(progressAnim, {
          toValue: next,
          duration: 200,
          useNativeDriver: false,
        }).start();
        return next;
      });
    }, 300);

    try {
      const res = await axios.post(`${config.API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowNextButton(true); // Only show next button after progress finishes
      });

      setResponseData(res.data);
    } catch (err) {
      clearInterval(progressInterval);
      setError("Error uploading file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    router.push("/(tabs)/vocabWrapped");
  };

  const selectFileIOS = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
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
        <div style={{ width: "100%", height: 20, backgroundColor: "#eee", marginTop: 10 }}>
          <div
            style={{
              height: "100%",
              width: `${uploadProgress}%`,
              backgroundColor: "#2196F3",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        {showNextButton && (
          <button onClick={handleNext} style={{ marginTop: 10 }}>
            Next
          </button>
        )}
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Select Audio/Text File"
        onPress={selectFileIOS}
        disabled={loading}
      />

      {selectedFile && (
        <Text style={styles.fileInfo}>Selected: {selectedFile.name}</Text>
      )}

      <Button
        title={loading ? "Uploading..." : "Upload"}
        onPress={handleUpload}
        disabled={loading || (!selectedFile && Platform.OS !== "web")}
      />

      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* {showNextButton && (
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )} */}

      {showNextButton && (
        <View style={{ marginTop: 30, width: "100%", alignItems: "center" }}>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

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
  progressBar: {
    width: "100%",
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },
  progress: {
    height: "100%",
    backgroundColor: "#2196F3",
  },
  // nextButton: {
  //   marginTop: 20,
  //   backgroundColor: "#2196F3",
  //   paddingVertical: 12,
  //   paddingHorizontal: 25,
  //   borderRadius: 8,
  //   alignItems: "center",
  // },
  // nextButtonText: {
  //   color: "#fff",
  //   fontSize: 25,
  //   fontWeight: "bold",
  // },
  nextButton: {
    backgroundColor: "#023047",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#023047",
    cursor: "pointer", // Web only
    alignItems: "center",
    justifyContent: "center",
  },
  
  nextButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  
});

export default FileSelectorUpload;
