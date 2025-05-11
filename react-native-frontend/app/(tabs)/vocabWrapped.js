import React, { useContext, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ResponseContext } from "../context/ResponseContext";
import styles from "../css/_styles";
import { useRouter } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import * as Clipboard from "expo-clipboard";
import VictoryBarChart from "../VictoryBarChart";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Adjust size for small, medium, and large screens
const isSmallScreen = screenWidth < 380;
const isMediumScreen = screenWidth < 768;

const VocabWrapped = () => {
  const router = useRouter();
  const { responseData } = useContext(ResponseContext);

  useEffect(() => {
    console.log("Data in vocabWrapped:", responseData);
  }, [responseData]);

  if (!responseData) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Waiting for analysis...</Text>
        <Button title="Back to START" onPress={() => router.push("/(screens)/options")} />
      </View>
    );
  }

  const sentimentData = [
    {
      name: "Positive",
      population: responseData.sentiment_analysis?.positive || 0,
      color: "#2ecc71",
      legendFontColor: "#2ecc71",
      legendFontSize: 14,
    },
    {
      name: "Neutral",
      population: responseData.sentiment_analysis?.neutral || 0,
      color: "#f1c40f",
      legendFontColor: "#f1c40f",
      legendFontSize: 14,
    },
    {
      name: "Negative",
      population: responseData.sentiment_analysis?.negative || 0,
      color: "#e74c3c",
      legendFontColor: "#e74c3c",
      legendFontSize: 14,
    },
  ];

  const barLabels = responseData.most_frequent_words.slice(0, 10).map((item) => item[0]);
  const barValues = responseData.most_frequent_words.slice(0, 10).map((item) => item[1]);

  return (
    <ScrollView contentContainerStyle={enhanced.container}>
      <Text style={styles.title}>Speech & Text Analysis</Text>

      <View style={enhanced.card}>
        <Text style={enhanced.cardTitle}>Top 10 Most Frequent Words</Text>
        <ScrollView horizontal={isSmallScreen} showsHorizontalScrollIndicator={isSmallScreen}>
          <VictoryBarChart
            barLabels={barLabels}
            barValues={barValues}
            chartWidth={isSmallScreen ? screenWidth * 1.5 : isMediumScreen ? screenWidth * 0.8 : screenWidth * 0.6}
            chartHeight={isSmallScreen ? 300 : isMediumScreen ? 250 : 200}
          />
        </ScrollView>
      </View>

      <View style={enhanced.card}>
        <Text style={enhanced.cardTitle}>Sentiment Analysis</Text>
        <PieChart
          data={sentimentData}
          width={isSmallScreen ? screenWidth * 0.85 : isMediumScreen ? screenWidth * 0.75 : screenWidth * 0.55}
          height={isSmallScreen ? 180 : isMediumScreen ? 220 : 300}
          chartConfig={{
            color: () => "#000",
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
        <Text style={enhanced.sentimentLine}>
          Positive: {responseData.sentiment_analysis.positive} | Neutral: {responseData.sentiment_analysis.neutral} | Negative: {responseData.sentiment_analysis.negative}
        </Text>
      </View>

      <View style={enhanced.card}>
        <Text style={enhanced.cardTitle}>Highlights</Text>
        {responseData.auto_highlights
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
          .map((item, index) => (
            <Text key={index} style={enhanced.textLine}>
              "{item.text}" (Count: {item.count})
            </Text>
        ))}
      </View>

      <View style={enhanced.card}>
        <Text style={enhanced.cardTitle}>Filler Words (Disfluencies)</Text>
        {Object.entries(responseData.disfluencies)
          .filter(([_, value]) => value > 0)
          .map(([key, value]) => (
            <Text key={key} style={enhanced.textLine}>
              {key}: {value}
            </Text>
          ))
        }
      </View>

      <View style={enhanced.card}>
        <View style={enhanced.headerRow}>
          <Text style={enhanced.cardTitle}>Transcript</Text>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setStringAsync(responseData.text);
              Alert.alert("Copied", "Transcript copied to clipboard.");
            }}
          >
            <Text style={enhanced.copyText}>📋 Copy</Text>
          </TouchableOpacity>
        </View>
        <Text style={enhanced.textBlock}>{responseData.text}</Text>
      </View>

      <View style={enhanced.card}>
        <Text style={enhanced.cardTitle}>Summary</Text>
        <Text style={enhanced.textBlock}>{responseData.summary}</Text>
      </View>

      <View style={{ marginVertical: 20 }}>
        <Button title="Back to START" onPress={() => router.push("/(screens)/options")} />
      </View>
    </ScrollView>
  );
};

const enhanced = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    paddingBottom: 60,
    backgroundColor: "#c0eef0",
  },
  card: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1d3557",
  },
  sentimentLine: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  textLine: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  textBlock: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  copyText: {
    fontSize: 14,
    color: "#1d3557",
    fontWeight: "bold",
  },
});

export default VocabWrapped;
