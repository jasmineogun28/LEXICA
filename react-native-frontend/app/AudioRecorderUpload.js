import React, { useState, useContext } from "react";
import axios from "axios";
import { ResponseContext } from "./context/ResponseContext";
import { Platform, View, Text, Button, StyleSheet } from "react-native";

const AudioRecorderUpload = () => {
  const { setResponseData } = useContext(ResponseContext);
  const [recording, setRecording] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioFile(audioBlob);
          setRecording(null);
        };

        mediaRecorder.start();
        setRecording(mediaRecorder);

        setTimeout(() => {
          mediaRecorder.stop();
        }, 60000); // Stop recording after 1 minute
      } else {
        // iOS recording implementation would go here
        // You would use expo-av or another React Native audio library
        console.log("iOS recording not implemented yet");
      }
    } catch (err) {
      setError("Error accessing microphone. Please try again.");
    }
  };

  const stopRecording = () => {
    if (recording) {
      if (Platform.OS === "web") {
        recording.stop();
      } else {
        // iOS stop recording implementation
      }
      setRecording(null);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      Platform.OS === "web" 
        ? alert("No audio file to upload!") 
        : setError("No audio file to upload!");
      return;
    }

    const formData = new FormData();
    
    if (Platform.OS === "web") {
      formData.append("file", audioFile, "recorded_audio.wav");
    } else {
      // iOS file format would be different
      formData.append("file", {
        uri: audioFile.uri,
        name: "recorded_audio.m4a",
        type: "audio/m4a"
      });
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResponseData(res.data);
    } catch (err) {
      setError("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioFile) {
      Platform.OS === "web" 
        ? alert("No audio file to download!") 
        : setError("No audio file to download!");
      return;
    }

    if (Platform.OS === "web") {
      const url = URL.createObjectURL(audioFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recorded_audio.wav";
      link.click();
    } else {
      // iOS download implementation would go here
      console.log("iOS download not implemented yet");
    }
  };

  if (Platform.OS === "web") {
    return (
      <div className="container">
        <h2>Record and Upload Audio</h2>
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
        <button onClick={handleUpload} disabled={loading || !audioFile}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button onClick={handleDownload} disabled={!audioFile}>
          Download Audio
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Record and Upload Audio</Text>
      
      {!recording ? (
        <Button
          title="Start Recording"
          onPress={startRecording}
        />
      ) : (
        <Button
          title="Stop Recording"
          onPress={stopRecording}
        />
      )}
      
      <View style={styles.buttonSpacer} />
      
      <Button
        title={loading ? "Uploading..." : "Upload"}
        onPress={handleUpload}
        disabled={loading || !audioFile}
      />
      
      <View style={styles.buttonSpacer} />
      
      <Button
        title="Download Audio"
        onPress={handleDownload}
        disabled={!audioFile}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 15,
  },
});

export default AudioRecorderUpload;