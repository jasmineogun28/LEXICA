import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ResponseContext } from "./context/ResponseContext";
import { Platform, View, Text, Button, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";
import config from "../constants/config.json";

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

  useEffect(() => {
    if (responseData) {
      console.log("Updated response data:", responseData);
    }
  }, [responseData]);

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
  
    try {
      const res = await axios.post("https://lexica-3tmd.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // const res = await axios.post(`${config.API_BASE_URL}/upload`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      console.log("Using API base URL:", config.API_BASE_URL);

      console.log("Upload response:", res);
  
      if (res.data?.error?.includes("language_detection cannot be performed")) {
        setError("No spoken audio detected. Please try recording again.");
        return;
      }
  
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

      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 }}>
        {/* Left Column */}
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button
            title={recording ? "Stop Recording" : "Start Recording"}
            onPress={recording ? stopRecording : startRecording}
          />
          <View style={{ marginTop: 10 }}>
            <Button
              title="Download Recording"
              onPress={handleDownload}
              disabled={!audioFile}
            />
          </View>
        </View>

        {/* Right Column */}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Button
            title="Upload File"
            onPress={handleUpload}
            disabled={!audioFile || loading}
          />
          {uploaded && (
            <View style={{ marginTop: 10 }}>
              <Button
                title="Next"
                onPress={() => router.push("/(tabs)/vocabWrapped")}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  timerContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginTop: 15,
  },
  fileText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default AudioRecorderUpload;
