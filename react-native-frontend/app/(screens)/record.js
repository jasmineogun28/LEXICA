import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import styles from '../css/_styles';
import AudioRecorderUpload from '../AudioRecorderUpload';
import { ResponseProvider } from '../context/ResponseContext';

const topics = [
  "Talk about your favorite hobby.",
  "Describe your ideal vacation.",
  "Explain how to make your favorite meal.",
  "Talk about a recent movie you watched.",
  "Describe your daily routine.",
  "Talk about a memorable childhood moment.",
  "What would you do if you won the lottery?",
  "Discuss the pros and cons of social media.",
  "Describe your dream job.",
  "Talk about your favorite book and why you like it."
];

export default function Record() {
  const [topic, setTopic] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const getRandomTopic = () => {
    const index = Math.floor(Math.random() * topics.length);
    setTopic(topics[index]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Text style={styles.title}>Record an Audio File</Text>
        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 8 , color: '#023047'}}>🗣️ Topic:</Text>
        <Text style={{ fontSize: 30, textAlign: 'center', marginBottom: 12 , color: '#023047'}}>
          {topic || "Tap to generate a topic!"}
        </Text>

        <Pressable
          onPress={getRandomTopic}
          disabled={isRecording}
          style={{
            backgroundColor: isRecording ? "#ccc" : "#4CAF50",
            padding: 10,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            {isRecording ? "Recording..." : "🔄 Shuffle Topic"}
          </Text>
        </Pressable>

        <AudioRecorderUpload
          selectedTopic={topic}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

