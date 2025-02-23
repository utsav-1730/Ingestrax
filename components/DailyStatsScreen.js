import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get("window");

const mockCalorieData = {
  dailyTarget: 2070.99,
  remainingCalories: 400.9,
  currentIntake: 1670.09,
  weeklyStats: [
    { date: "Mon", calories: 1850, burnout: 520, intake: 1330 },
    { date: "Tue", calories: 2100, burnout: 680, intake: 1420 },
    { date: "Wed", calories: 1950, burnout: 450, intake: 1500 },
    { date: "Thu", calories: 2200, burnout: 750, intake: 1450 },
    { date: "Fri", calories: 2000, burnout: 600, intake: 1400 },
    { date: "Sat", calories: 2150, burnout: 700, intake: 1450 },
    { date: "Sun", calories: 1800, burnout: 400, intake: 1400 },
  ],
};

export default function DailyStatsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Daily Stats</Text>
        </View>
        
        {/* Daily Calories Chart */}
        <View style={styles.cardContainer}> 
          <View style={styles.cardPrimary}>
            <Text style={styles.label}>Daily Calories</Text>
            <Text style={styles.value}>{mockCalorieData.dailyTarget.toFixed(2)}</Text>
          </View>
          <View style={styles.cardPrimary}>
            <Text style={styles.label}>Calories to Eat</Text>
            <Text style={styles.value}>{mockCalorieData.remainingCalories.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Info Cards */}
        <View style={styles.cardContainer}>
          <View style={styles.cardSecondary}>
            <MaterialCommunityIcons name="food" size={24} color="#2DD4BF" />
            <Text style={styles.cardTitle}>Daily Calories Intake</Text>
            <Text style={styles.cardSubtitle}>Eat up to {mockCalorieData.dailyTarget.toFixed(2)} calories</Text>
          </View>
          <View style={styles.cardSecondary}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FF9B9B" />
            <Text style={styles.cardTitle}>Today's Calorie Intake</Text>
            <Text style={styles.cardSubtitle}>Today's eaten calories {mockCalorieData.currentIntake.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Weekly Chart */}
        <Text style={styles.chartTitle}>Your Daily Calorie Burn Chart</Text>
        <LineChart
          data={{
            labels: mockCalorieData.weeklyStats.map((day) => day.date),
            datasets: [{
              data: mockCalorieData.weeklyStats.map((day) => day.burnout),
              color: () => `rgba(255, 155, 155, 1)`,
              strokeWidth: 2,
            }],
          }}
          width={width - 40}
          height={300}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#FF9B9B",
            labelColor: () => "#666",
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, paddingBottom: 60, paddingHorizontal: 20, justifyContent: "space-between" },
  header: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  title: { flex: 1, fontSize: 22, fontWeight: "bold", textAlign: "center",color: "#208F8F" },
  cardContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  cardPrimary: { backgroundColor: '#e0f7fa', borderRadius: 20, padding: 20, flex: 1, marginHorizontal: 5, alignItems: "center" },
  label: { color: "#666", fontSize: 16, marginTop: 5 },
  value: { color: "#2DD4BF", fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  cardSecondary: { backgroundColor: "#e0f7fa", padding: 15, borderRadius: 15, flex: 1, marginHorizontal: 5, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardTitle: { fontWeight: "bold", marginVertical: 5, textAlign: "center" },
  cardSubtitle: { color: "#666", fontSize: 14, textAlign: "center", },
  chartTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center",color: "#208F8F" },
  chart: { alignSelf: "center", marginBottom: 30 },
});