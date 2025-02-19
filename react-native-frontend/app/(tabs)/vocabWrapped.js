// import React, { useContext } from "react";
// import { ResponseContext } from "../context/ResponseContext";
// import styles from "../css/_styles";

// const VocabWrapped = () => {
//   const { responseData } = useContext(ResponseContext);

//   if (!responseData) {
//     return <p>Waiting for analysis...</p>;
//   }

//   return (
//     <div className="vocab-wrapped">
//       <h1>Speech & Text Analysis</h1>

//       <div className="response">
//         <h3>Summary:</h3>
//         <p>{responseData.summary}</p>

//         <h3>Auto Highlights:</h3>
//         <ul>
//           {responseData.auto_highlights.map((item, index) => (
//             <li key={index}>
//               "{item.text}" (Count: {item.count})
//             </li>
//           ))}
//         </ul>

//         <h3>Sentiment Analysis:</h3>
//         <pre>{JSON.stringify(responseData.sentiment_analysis, null, 2)}</pre>

//         <h3>Confidence Score:</h3>
//         <p>{responseData.confidence.confidence}</p>

//         <h3>Disfluencies:</h3>
//         <pre>{JSON.stringify(responseData.disfluencies, null, 2)}</pre>
//       </div>
//     </div>
//   );
// };

// export default VocabWrapped;


import React, { useContext } from "react";
import { ScrollView, View, Text } from "react-native";
import { ResponseContext } from "../context/ResponseContext";
import styles from "../css/_styles";

const VocabWrapped = () => {
  const { responseData } = useContext(ResponseContext);

  if (!responseData) {
    return <Text style={styles.text}>Waiting for analysis...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech & Text Analysis</Text>

      <ScrollView style={styles.responseContainer}>
        <Text style={styles.text}>Summary:</Text>
        <Text>{responseData.summary}</Text>

        <Text style={styles.text}>Auto Highlights:</Text>
        {responseData.auto_highlights.map((item, index) => (
          <Text key={index}>"{item.text}" (Count: {item.count})</Text>
        ))}

        <Text style={styles.text}>Sentiment Analysis:</Text>
        <Text>{JSON.stringify(responseData.sentiment_analysis, null, 2)}</Text>

        <Text style={styles.text}>Confidence Score:</Text>
        <Text>{responseData.confidence.confidence}</Text>

        <Text style={styles.text}>Disfluencies:</Text>
        <Text>{JSON.stringify(responseData.disfluencies, null, 2)}</Text>
      </ScrollView>
    </View>
  );
};

export default VocabWrapped;
