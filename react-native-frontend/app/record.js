import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { View, Button, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import styles from './css/_styles';

const CountdownTimer = ({ duration, onComplete, isRecording }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(0);

  const radius = 50;
  const strokeWidth = 10;
  const circleLength = 2 * Math.PI * radius;
  const offset = circleLength - (progress * circleLength);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        setProgress((timeLeft - 1) / duration);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      onComplete();  // Notify when the timer completes
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Svg width={120} height={120}>
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke={isRecording ? "#4caf50" : "#dcdcdc"}  
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circleLength}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.timerText, { color: isRecording ? "#4caf50" : "#dcdcdc" }]}>
        {formatTime(timeLeft)}
      </Text>
    </View>
  );
};

export default function RecordAudioButton() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync(); // Request microphone permission using Audio module
        if (status === 'granted') {
          setPermissionGranted(true);
        } else {
          alert('Permission to access the microphone is required!');
        }
      } catch (error) {
        console.error('Permission request failed', error);
        alert('An error occurred while requesting microphone permission.');
      }
    };
    getPermission();
  }, []);

  const handleRecord = async () => {
    if (!permissionGranted) {
      alert('Microphone permission not granted!');
      return;
    }

    if (isRecording) {
      // Stop recording
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI(); // Get the URI of the recorded file
        console.log('Recording stopped. File saved at:', uri);
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
      setRecording(null);
      setIsRecording(false);
    } else {
      // Set audio mode before starting the recording
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true, // Allow recording on iOS
          playsInSilentModeIOS: true, // Allow playback in silent mode
          staysActiveInBackground: true, // Keep audio active in the background
        });

        // Start recording
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await newRecording.startAsync();
        setRecording(newRecording);
        setIsRecording(true);
        console.log('Recording started');
        startCountdown(); // Start the countdown when recording starts
      } catch (err) {
        console.error('Error starting recording:', err);
      }
    }
  };

  const startCountdown = () => {
    // You can choose a duration in seconds (e.g., 60 seconds)
    setTimeout(() => {
      handleRecord(); // Stop recording when the countdown finishes
    }, 60000); // 60 seconds
  };

  const handleManualStop = () => {
    if (isRecording) {
      handleRecord(); // Stop recording manually
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button 
          title={isRecording ? 'Stop Recording' : 'Start Recording'} 
          onPress={handleRecord} 
        />
        <Button 
          title="Stop Recording Manually" 
          onPress={handleManualStop} 
          disabled={!isRecording}
        />
      </View>
      <Text style={styles.status}>{isRecording ? 'Recording...' : 'Press to record'}</Text>
      <CountdownTimer duration={60} onComplete={handleManualStop} isRecording={isRecording} /> {/* 60-second countdown */}
    </View>
  );
}