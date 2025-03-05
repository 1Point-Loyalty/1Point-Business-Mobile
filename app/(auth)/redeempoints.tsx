import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import PagerThemedView from "react-native-pager-view";
import { useTheme } from "@/constants/ThemeCheck";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import { useLocalSearchParams } from "expo-router";

export default function RedeemPoints() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState('0');
  const { userInfo: userInfoParam } = useLocalSearchParams();
  const userInfo = userInfoParam ? JSON.parse(userInfoParam as string) : null;

  const createTransaction = async () => {
    if (!subtotal) {
      Alert.alert("Error", "Please enter a subtotal.");
      return;
    }

    const customerId = userInfo.id;
    const pointsEquivalent = Math.floor(Number(subtotal));

    const transactionData = {
      customerID: customerId,
      subtotal: subtotal.toString(),
      pointsEquivalent: pointsEquivalent.toString(),
    };

    try {
      setLoading(true);
      const token = await auth().currentUser?.getIdToken(true);
      if (!token) {
        Alert.alert("Error", "Authentication failed. Please log in again.");
        return;
      }

      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      const userId = currentUser.uid;
      const apiURL = `https://admin.1-point.ca/api/createMerchantTransaction/${userId}`;
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseText}`);
      }

      Alert.alert("Success", "Transaction successfully recorded.");
      setSubtotal("0");

    } catch (error) {
      Alert.alert("Error", "Failed to post transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPointPreview = () => {
    const points = Math.floor(Number(subtotal));

    return (
      <ThemedView style={[styles.PromotionSection, { backgroundColor: theme.colors.background }]}>
        <ThemedView style={{ backgroundColor: theme.colors.background }}>
          <ThemedView style={[styles.row, styles.shadowProp, { backgroundColor: theme.colors.notification }]}>
            <View style={styles.imageContainer}>
              <ThemedText style={styles.redeemText}>You are redeeming</ThemedText>
              <ThemedText style={styles.pointText}>{points}</ThemedText>
              <ThemedText style={styles.redeemText}>points to your customer</ThemedText>
              <ThemedText style={styles.redeemText2}>${subtotal} to {points} points</ThemedText>
            </View>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  const NumericInput = () => {
    return (
      <View style={{ backgroundColor: theme.colors.background }}>
        <TextInput
          style={[styles.circularInput, { backgroundColor: theme.colors.card }]}
          placeholder="Enter Amount"
          placeholderTextColor="lightgray"
          keyboardType='decimal-pad'
          value={subtotal}
          onChangeText={setSubtotal}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]}
            onPress={() => router.navigate("/home")}>
            <ThemedText style={styles.buttonText2}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]}
            onPress={async () => {
              await createTransaction();
              router.navigate("/home");
            }}>
            <ThemedText style={styles.buttonText}>Redeem Points</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.main, { backgroundColor: theme.colors.card }]}>
      <ThemedView
        style={[styles.realContainer, { backgroundColor: theme.colors.card }]}
      >
        <ThemedView
          style={[
            styles.headerContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <TouchableOpacity style={styles.headerImage} onPress={() => router.navigate("/QRScan")}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <ThemedView
            style={[styles.headerText, { backgroundColor: theme.colors.card }]}
          >
            <ThemedText style={[styles.welcomeText]}>redeem Points</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={[
            styles.mainContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >

          {renderPointPreview()}

          <ThemedText
            style={[
              styles.subHeadingText,
              { backgroundColor: theme.colors.background },
            ]}
          >
            ENTER TRANSACTION AMOUNT
          </ThemedText>

          <ThemedView>{NumericInput()}</ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  numericButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: 'rgb(249, 91, 0)',
    borderWidth: 2,
  },
  saveButton: {
    backgroundColor: 'rgb(249, 91, 0)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText2: {
    color: 'rgb(249, 91, 0)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  circularInput: {
    height: 60,
    borderRadius: 30,

    textAlign: 'center',
    marginVertical: 10,
    fontSize: 20,
  },

  //-------------- Main App styling -----------------
  main: {
    flex: 1,
    paddingTop: 15,
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    paddingTop: 20,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
  },
  realContainer: {
    flex: 1,
    paddingTop: 40,

  },

  //-------------- Header styling -----------------

  headerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 71,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",

  },

  PromotionSection: {
    padding: "1%",
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  imageContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 325,
    alignSelf: 'center',
  },

  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    paddingTop: 5,
  },

  subHeadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    fontVariant: ["small-caps"],
    padding: 10,
  },

  //-------------- Point Section styling -----------------

  pointsSection: {
    padding: "1%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  pointAmounts: {
    width: 46,
    height: 46,
  },

  row: {
    justifyContent: "space-evenly",
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: "5%",
    marginBottom: 10,
    marginVertical: "5%",
    minHeight: 150,
    minWidth: "30%",
  },

  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  pointContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointText: {
    fontSize: 30,
    paddingTop: 10,
    color: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  redeemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  redeemText2: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});