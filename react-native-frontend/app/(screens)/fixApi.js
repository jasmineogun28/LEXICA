// import React, { useState } from "react";
// import { Button, Text, View } from "react-native";
// import DocumentPicker from "react-native-document-picker";

// const App = () => {
//   const [uploadStatus, setUploadStatus] = useState(null);

//   // Function to pick the file
//   const pickFileAndUpload = async () => {
//     try {
//       const result = await DocumentPicker.pick({
//         type: [DocumentPicker.types.audio], // You can specify audio types or other file types
//       });

//       console.log("Selected file:", result);

//       // Create form data to send to the backend
//       const formData = new FormData();
//       formData.append("file", {
//         uri: result.uri,
//         name: result.name,
//         type: result.type,
//       });

//       // Upload the file to Flask API
//       const res = await fetch("http://127.0.0.1:5000/upload", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Accept": "application/json",
//         },
//       });

//       if (res.ok) {
//         const jsonResponse = await res.json();
//         setUploadStatus(jsonResponse.message); // Set success message
//       } else {
//         setUploadStatus("Error: File upload failed");
//       }
//     } catch (err) {
//       console.error("Error selecting file:", err);
//       setUploadStatus("Error: Could not pick a file");
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Button title="Select File and Upload" onPress={pickFileAndUpload} />
//       {uploadStatus && <Text>{uploadStatus}</Text>}
//     </View>
//   );
// };

// export default App;
