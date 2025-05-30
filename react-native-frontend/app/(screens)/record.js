import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions
} from 'react-native';
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
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  const getRandomTopic = () => {
    const index = Math.floor(Math.random() * topics.length);
    setTopic(topics[index]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { paddingBottom: 40 }]}>
          <Text
            style={[
              styles.title,
              isSmallScreen && { fontSize: 28 }
            ]}
          >
            Record an Audio File
          </Text>

          <View style={styles.buttonRow}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '600',
                marginBottom: 8,
                color: '#023047'
              }}
            >
              🗣️ Topic:
            </Text>

            <View style={{ height: 90, justifyContent: 'center', marginBottom: 12, marginTop: 12 }}>
              <Text
                style={{
                  fontSize: 30,
                  textAlign: 'center',
                  color: '#023047',
                  maxWidth: 320,
                  alignSelf: 'center'
                }}
              >
                {topic || "Tap to generate a topic!"}
              </Text>
            </View>

            <View style={{ alignItems: 'center', width: '100%' }}>
              <Pressable
                onPress={getRandomTopic}
                disabled={isRecording}
                style={{
                  backgroundColor: isRecording ? "#ccc" : "#4CAF50",
                  paddingVertical: 10,
                  borderRadius: 10,
                  marginBottom: 20,
                  width: 240,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 20,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                >
                  {isRecording ? "Recording..." : "🔄 Shuffle Topic"}
                </Text>
              </Pressable>
            </View>

            <AudioRecorderUpload
              selectedTopic={topic}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </View>

          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
