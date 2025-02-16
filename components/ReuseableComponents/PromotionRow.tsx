import React from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "@/constants/ThemeCheck";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export const PromotionRow = ({
  promotionAmount,
  promotionLocation,
  promotionStartDate,
  promotionEndDate,
  promotionImage,
  promotionStatus,
}: {
  promotionAmount: number;
  promotionLocation: string;
  promotionStartDate: string;
  promotionEndDate: string;
  promotionImage: string;
  promotionStatus: string;
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const displayStatusColor = () => {
    return promotionStatus === "Active" ? "green" : "gray";
  };

  return (
    <ThemedView style={styles.card}>
      <Image
        source={
          promotionImage === "cake"
            ? require("@/assets/images/cake.png")
            : require("@/assets/images/Icecream.png")
        }
        style={styles.image}
      />
      <View style={styles.statusContainer}>
        <ThemedText
          style={[styles.status, { backgroundColor: displayStatusColor() }]}
        >
          {promotionStatus}
        </ThemedText>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.navigate("/editpromotion")}
      >
        <Ionicons name="build" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.overlay}>
        <View style={styles.amountContainer}>
          <ThemedText style={styles.amountText}>
            {"Get " + promotionAmount + "% off at " + promotionLocation}
          </ThemedText>
        </View>
        <ThemedText style={styles.locationText}>
          {"Hurry! This offer lasts only until " + promotionEndDate}
        </ThemedText>
        <ThemedText style={styles.excessPadding}>{""}</ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    borderRadius: 15,
    overflow: "hidden",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  statusContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    padding: 5,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  amountContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 5,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
  },
  excessPadding: {
    fontSize: 12,
    fontWeight: "400",
    color: "#fff",
  },
});
