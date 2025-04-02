import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { View, Button, Text, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";


const MAX_RECORD_TIME = 60; // Max recording time in seconds

const Record = () => {
  const router = useRouter();
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_RECORD_TIME);
  const [intervalId, setIntervalId] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // Start Countdown
  const startCountdown = () => {
    if (intervalId) clearInterval(intervalId); // Clear any existing timer

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording(); // Stop when time reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  // Reset Timer
  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimeLeft(MAX_RECORD_TIME);
  };

  // Start Recording
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the microphone is required!");
        return;
      }

      resetTimer(); // Reset countdown when new recording starts

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
      startCountdown(); // Start countdown timer

      if (timeLeft === 0) {
        setIsRecording(false);
        stopRecording();
      }
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  // Stop Recording
  const stopRecording = async () => {
    if (!recording) return;

    try {
      clearInterval(intervalId); // Stop the countdown
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setFile({ name: "recording.m4a", uri }); // Store file details
    } catch (err) {
      console.error("Error stopping recording:", err);
    } finally {
      setRecording(null);
      setIsRecording(false);
    }
  };

  // Upload File (Either Chosen or Recorded)
  const handleUpload = async () => {
    if (!file) {
      alert("Please select or record a file first!");
      return;
    }
  
    setUploading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: "audio/m4a",
    });
  
    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Content-Type": "form-data", // Ensure the header is set correctly
        },
      });
  
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
  
      const responseData = await res.json();
      console.log("Upload successful:", responseData);
      alert(`Upload successful! File: ${file.name}`);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert(`Error uploading file: ${file.name}. Please try again.`);
    } finally {
      setUploading(false); // Stop when loading is complete
    }
  };

  // Handle File Selection (Manual Upload)
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  // Save Recording Locally
  const saveRecording = async () => {
    if (!recordedUri) {
      alert("No recording available to save.");
      return;
    }

    const response = await fetch(recordedUri);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.m4a";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Recording downloaded successfully!");
  };

  // Format Timer Display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getCircleDashArray = () => {
    return (timeLeft / MAX_RECORD_TIME) * Math.PI * 2 * 50;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record an Audio File</Text>
      <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>
      
      {/* Visual Countdown (Circular Progress Bar) */}
      <View style={styles.timerContainer}>
        <Svg width="120" height="120">
          <Circle
            cx="60"
            cy="60"
            r="50"
            stroke="#e6e6e6"
            strokeWidth="10"
            fill="none"
          />
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
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.button}>
        <Button title={isRecording ? "Stop Recording" : "Start Recording"} onPress={isRecording ? stopRecording : startRecording} />
      </View>

      {recordedUri && <Text>Recording Saved: {file.name}</Text>}

      <View style={styles.button}>
        <Button title="Upload File" onPress={handleUpload} disabled={!file || uploading} />
      </View>

      {uploading && <Text>Uploading...</Text>}

      <View style={styles.button}>
        {recordedUri && <Button title="Download Recording" onPress={saveRecording} />}
      </View>

      <View style={styles.button}>
        <Button title="View your results" onPress={() => router.push("/(tabs)/vocabWrapped")} />
      </View>

      <View style={styles.button}>
        <Button title="to home" onPress={() => router.push("/(tabs)/home")} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#023047',
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    backgroundColor: '#219ebc',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingTop: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  uriText: {
    marginTop: 10,
    fontSize: 14,
    color: "green",
  },
  button: {
    marginBottom: 10, // Add margin bottom to create space between buttons
  },
});

export default Record;

// import React, { useState, useEffect } from "react";
// import { Audio } from "expo-av";
// import { View, Button, Text, StyleSheet, StatusBar } from "react-native";
// import { useRouter } from "expo-router";
// import Svg, { Circle } from "react-native-svg"; // Importing Svg and Circle for visual countdown

// const MAX_RECORD_TIME = 60; // Max recording time in seconds

// const Record = () => {
//   const router = useRouter();
//   const [recording, setRecording] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(MAX_RECORD_TIME);
//   const [intervalId, setIntervalId] = useState(null);
//   const [recordedUri, setRecordedUri] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [intervalId]);

//   // Start Countdown
//   const startCountdown = () => {
//     if (intervalId) clearInterval(intervalId); // Clear any existing timer

//     const id = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           stopRecording(); // Stop when time reaches 0
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     setIntervalId(id);
//   };

//   // Reset Timer
//   const resetTimer = () => {
//     if (intervalId) clearInterval(intervalId);
//     setTimeLeft(MAX_RECORD_TIME);
//   };

//   // Start Recording
//   const startRecording = async () => {
//     try {
//       const { status } = await Audio.requestPermissionsAsync();
//       if (status !== "granted") {
//         alert("Permission to access the microphone is required!");
//         return;
//       }

//       resetTimer(); // Reset countdown when new recording starts

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const newRecording = new Audio.Recording();
//       await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
//       await newRecording.startAsync();

//       setRecording(newRecording);
//       setIsRecording(true);
//       startCountdown(); // Start countdown timer
//     } catch (err) {
//       console.error("Error starting recording:", err);
//     }
//   };

//   // Stop Recording
//   const stopRecording = async () => {
//     if (!recording) return;

//     try {
//       clearInterval(intervalId); // Stop the countdown
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setRecordedUri(uri);
//       setFile({ name: "recording.m4a", uri }); // Store file details
//     } catch (err) {
//       console.error("Error stopping recording:", err);
//     } finally {
//       setRecording(null);
//       setIsRecording(false);
//     }
//   };

//   // Upload File (Either Chosen or Recorded)
//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select or record a file first!");
//       return;
//     }

//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", {
//       uri: file.uri,
//       name: file.name,
//       type: "audio/m4a",
//     });

//     try {
//       const res = await fetch("http://127.0.0.1:5000/upload", {
//         method: "POST",
//         body: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (!res.ok) {
//         throw new Error(`Server responded with ${res.status}`);
//       }

//       const responseData = await res.json();
//       console.log("Upload successful:", responseData);
//       alert(`Upload successful! File: ${file.name}`);
//     } catch (err) {
//       console.error("Error uploading file:", err);
//       alert(`Error uploading file: ${file.name}. Please try again.`);
//     } finally {
//       setUploading(false); // Stop when loading is complete
//     }
//   };

//   // Format Timer Display
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   // Function to calculate stroke-dasharray based on time left
//   const getCircleDashArray = () => {
//     return (timeLeft / MAX_RECORD_TIME) * Math.PI * 2 * 50;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Record an Audio File</Text>
      
//       {/* Visual Countdown (Circular Progress Bar) */}
//       <View style={styles.timerContainer}>
//         <Svg width="120" height="120">
//           <Circle
//             cx="60"
//             cy="60"
//             r="50"
//             stroke="#e6e6e6"
//             strokeWidth="10"
//             fill="none"
//           />
//           <Circle
//             cx="60"
//             cy="60"
//             r="50"
//             stroke="#ff6347"
//             strokeWidth="10"
//             fill="none"
//             strokeDasharray={Math.PI * 2 * 50}
//             strokeDashoffset={Math.PI * 2 * 50 - getCircleDashArray()}
//             strokeLinecap="round"
//           />
//         </Svg>
//         <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
//       </View>

//       <View style={styles.button}>
//         <Button title={isRecording ? "Stop Recording" : "Start Recording"} onPress={isRecording ? stopRecording : startRecording} />
//       </View>

//       {recordedUri && <Text>Recording Saved: {file.name}</Text>}

//       <View style={styles.button}>
//         <Button title="Upload File" onPress={handleUpload} disabled={!file || uploading} />
//       </View>

//       {uploading && <Text>Uploading...</Text>}

//       <View style={styles.button}>
//         {recordedUri && <Button title="Download Recording" onPress={saveRecording} />}
//       </View>

//       <View style={styles.button}>
//         <Button title="View your results" onPress={() => router.push("/(tabs)/vocabWrapped")} />
//       </View>

//       <View style={styles.button}>
//         <Button title="to home" onPress={() => router.push("/(tabs)/home")} />
//       </View>

//       <StatusBar style="auto" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     color: "#023047",
//     fontWeight: "bold",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#219ebc",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     paddingTop: 20,
//   },
//   timerContainer: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   timerText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   button: {
//     marginBottom: 10,
//   },
// });

// export default Record;

