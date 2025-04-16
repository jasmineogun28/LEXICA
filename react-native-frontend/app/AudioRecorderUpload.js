import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { ResponseContext } from "./context/ResponseContext";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";
import config from "../constants/config.js";

const MAX_RECORD_TIME = 60;

const AudioRecorderUpload = ({ selectedTopic, isRecording, setIsRecording }) => {
  const { responseData, setResponseData } = useContext(ResponseContext);
  const [recording, setRecording] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [timeLeft, setTimeLeft] = useState(MAX_RECORD_TIME);
  const [intervalId, setIntervalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (recording && timeLeft > 0) {
      const id = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [recording]);

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimeLeft(MAX_RECORD_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getCircleDashArray = () => {
    return (timeLeft / MAX_RECORD_TIME) * Math.PI * 2 * 50;
  };

  const startRecording = async () => {
    try {
      if (Platform.OS === "web") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          setAudioFile(audioBlob);
          setRecording(null);
          resetTimer();
          setIsRecording(false);
        };

        mediaRecorder.start();
        setRecording(mediaRecorder);
        setIsRecording(true);
      } else {
        console.log("iOS recording not implemented yet");
      }
    } catch (err) {
      console.error("Microphone error:", err);
      setError("Error accessing microphone. Please try again.");
    }
  };

  const stopRecording = () => {
    if (recording) {
      recording.stop();
      setRecording(null);
      resetTimer();
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      setError("No audio file to upload!");
      return;
    }
  
    if (audioFile.size === 0) {
      setError("Audio file is empty. Please re-record.");
      return;
    }
  
    const formData = new FormData();
    if (Platform.OS === "web") {
      formData.append("file", audioFile, "recorded_audio.wav");
    } else {
      formData.append("file", {
        uri: audioFile.uri,
        name: "recorded_audio.m4a",
        type: "audio/m4a",
      });
    }
  
    setLoading(true);
    setError(null);
    setProgress(0);
    progressAnim.setValue(0);
  
    try {
      const res = await axios.post(`${config.API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
  
          // Set progress to 95% during upload
          if (percent < 95) {
            setProgress(percent);
            Animated.timing(progressAnim, {
              toValue: percent,
              duration: 300,
              useNativeDriver: false,
            }).start();
          } else {
            // Hold progress at 95% until upload is complete
            setProgress(95);
            Animated.timing(progressAnim, {
              toValue: 95,
              duration: 300,
              useNativeDriver: false,
            }).start();
          }
        },
      });
  
      if (res.data?.error?.includes("language_detection cannot be performed")) {
        setError("No spoken audio detected. Please try recording again.");
        return;
      }
  
      // Once the upload is complete, jump to 100%
      setProgress(100);
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
  
      setResponseData(res.data);
      setUploaded(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleDownload = () => {
    if (!audioFile) {
      setError("No audio file to download!");
      return;
    }

    if (Platform.OS === "web") {
      const url = URL.createObjectURL(audioFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recorded_audio.wav";
      link.click();
    } else {
      console.log("iOS download not implemented yet");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>

      <View style={styles.timerContainer}>
        <Svg width="120" height="120">
          <Circle cx="60" cy="60" r="50" stroke="#e6e6e6" strokeWidth="10" fill="none" />
          <Circle
            cx="60"
            cy="60"
            r="50"
            stroke="#ff6347"
            strokeWidth="10"
            fill="none"
            strokeDasharray={Math.PI * 2 * 50}
            strokeDashoffset={Math.PI * 2 * 50 - getCircleDashArray()}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleDownload}
        disabled={!audioFile}
      >
        <Text style={styles.buttonText}>Download Recording</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: loading ? "#aaa" : "#023047" }]}
        onPress={handleUpload}
        disabled={!audioFile || loading}
      >
        <Text style={styles.buttonText}>Upload File</Text>
      </TouchableOpacity>

      {loading && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Text style={{ color: "#023047", fontWeight: "bold" }}>
            Uploading: {progress}%
          </Text>
          <View
            style={{
              height: 10,
              width: 200,
              backgroundColor: "#e0e0e0",
              borderRadius: 5,
              overflow: "hidden",
              marginTop: 5,
            }}
          >
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: "#2196F3",
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>
        </View>
      )}

      {uploaded && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/vocabWrapped")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  timerText: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#023047",
  },
  timerContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginTop: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#023047",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 12,
    width: "80%",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default AudioRecorderUpload;
