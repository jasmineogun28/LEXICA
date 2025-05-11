import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Linking, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../css/_styles';

const tips = [
  // Vocabulary Tips
  "📖 Read widely and regularly — articles, books, blogs, and newspapers expand your word bank.",
  "🗓️ Use a word a day — pick one new word and use it in sentences throughout the day.",
  "📝 Keep a vocabulary journal — record new words and review them weekly.",
  "🎮 Play word games — crossword puzzles, Scrabble, or mobile apps make learning fun.",
  "🧠 Use words in context — applying words in real situations helps you remember them.",
  "🔁 Learn synonyms and antonyms to vary your speech and deepen understanding.",
  
  // Speech Tips
  "🐢 Slow down your speech — pacing helps clarity and reduces filler words.",
  "👄 Practice tongue twisters — they boost articulation and pronunciation.",
  "🎙️ Record yourself — play back your speech to notice overused words or unclear phrases.",
  "👂 Be an active listener — notice how confident speakers pace and pronounce their words.",
  "⏸️ Pause instead of saying 'um' or 'like' — silence shows confidence.",
  "🎤 Warm up your voice — humming or deep breathing helps clarity and projection.",
  "🗣️ Speak in full sentences — this improves fluency and reduces vague expressions.",
  
  // Habits
  "🧑‍🤝‍🧑 Join a public speaking group — like Toastmasters, for real feedback and growth.",
  "🗯️ Talk to yourself — narrate your actions or thoughts to build fluency.",
];

export default function LearningPage() {
  const [currentTip, setCurrentTip] = useState('');

  useEffect(() => {
    shuffleTip();
  }, []);

  const shuffleTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[randomIndex]);
  };

  const handleSurveyPress = () => {
    Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSdLrmgTDVUx6riHltSN5plhDVT6RReZl0G4ktLpxECCcs0kEQ/viewform?usp=sharing');
  };

  return (
    <ScrollView contentContainerStyle={[enhanced.container, { flexGrow: 1 }]}>
      <Text style={styles.title}>Learning Page</Text>

      <View style={enhanced.card}>
        <Text style={enhanced.sectionTitle}>💡 Tip for Improving Speech or Vocabulary</Text>
        <Text style={enhanced.tipText}>{currentTip}</Text>
        <TouchableOpacity style={enhanced.button} onPress={shuffleTip}>
          <Text style={enhanced.buttonText}>Next Tip</Text>
        </TouchableOpacity>
      </View>

      <View style={enhanced.card}>
        <Text style={enhanced.sectionTitle}>📋 Quick Survey</Text>
        <Text style={enhanced.text}>
          Please take the time to fill out this short survey about the app.
        </Text>
        <TouchableOpacity style={enhanced.button} onPress={handleSurveyPress}>
          <Text style={enhanced.buttonText}>Take Survey</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const enhanced = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
    alignItems: 'center',
    backgroundColor: '#c0eef0',
  },
  card: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1d3557',
  },
  tipText: {
    fontSize: 15,
    fontStyle: 'italic',
    marginBottom: 15,
    color: '#333',
  },
  text: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
