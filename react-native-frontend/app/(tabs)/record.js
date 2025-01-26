import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import styles from '../css/_styles';

export default function Record() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recording</Text>
      <Text style={styles.title}>Python Integration Example</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter some text"
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Send to Python" onPress={handleSubmit} />
      {result ? <Text style={styles.result}>Result: {result}</Text> : null}
    </View>
  );
}


