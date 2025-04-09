import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Linking, Button } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Learning Page</Text>

      <View style={{ marginVertical: 20 }}>
        <Text style={styles.text}>💡 Tip for Improving Speech or Vocabulary:</Text>
        <Text style={[styles.text, { marginTop: 10, fontStyle: 'italic' }]}>{currentTip}</Text>
        <Button title="Next Tip" onPress={shuffleTip} />
      </View>

      <Text style={styles.text}>
        Please take the time to fill out this short survey about the app.
      </Text>

      <Button
        title="Take Survey"
        onPress={handleSurveyPress}
        color="#007BFF"
      />
    </View>
  );
}
