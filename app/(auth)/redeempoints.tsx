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
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';

export default function RedeemPoints() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState('0');
  const { userInfo: userInfoParam } = useLocalSearchParams();
  const userInfo = userInfoParam ? JSON.parse(userInfoParam as string) : null;
  const userBalance = userInfo ? userInfo.currentPoints : 0;
  const userName = userInfo ? userInfo.firstName + " " + userInfo.lastName : "John Doe"; 

  const createTransaction = async () => {
    if (!subtotal) {
      Alert.alert("Error", "Please enter a subtotal.");
      return;
    }

    const customerId = userInfo.id;
    const pointsEquivalent = Math.floor(Number(subtotal) * 1000);

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
      const apiURL = `https://admin.1-point.ca/api/createMerchantRedemption/${userId}`;
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

      Alert.alert("Success", "Redemption successfully recorded.");
      setSubtotal("0");

    } catch (error) {
      Alert.alert("Error", "Failed to post redemption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPointPreview = () => {
    const userDollar = Math.floor(Number(userBalance));

    return (
      <ThemedView style={[styles.PromotionSection, { backgroundColor: theme.colors.background }]}>
        <ThemedView style={{ backgroundColor: theme.colors.background }}>
          <ThemedView style={[styles.row, styles.shadowProp, { backgroundColor: theme.colors.notification }]}>
            <View style={styles.imageContainer}> 
             <ThemedText style={styles.pointText}>{userName}</ThemedText>
              <ThemedText style={styles.redeemText}>Current Balance: {userBalance} points</ThemedText>
              <ThemedText style={styles.redeemText2}>{userBalance} points valued at ${userDollar}</ThemedText>
            </View>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };
  
  const renderTransactionPreview = () => {
    const points = Math.floor(Number(subtotal));
    const pointsValue = points;
  
  return (
    <ThemedView style={[styles.PromotionSection, { backgroundColor: theme.colors.background }]}>
        
        <LinearGradient colors={['#FFFFFF', '#F0F0F0']} style={styles.orangeContainer}>
          <ThemedText style={styles.cardTitle}>Redeeming</ThemedText>
          <ThemedText style={styles.cardValue}>{points}</ThemedText>
          <ThemedText style={styles.cardTitle}>points</ThemedText>
        </LinearGradient>
  
        <View style={styles.iconContainer}>
          <Ionicons name="swap-horizontal" size={25} color="rgb(230, 115, 57)" />
        </View>
        
        <LinearGradient colors={['#FFFFFF', '#F0F0F0']} style={styles.orangeContainer}>
          <ThemedText style={styles.cardTitle}>Points worth</ThemedText>
          <ThemedText style={styles.cardValue}>${pointsValue}</ThemedText>
          <ThemedText style={styles.cardTitle}>in value</ThemedText>
        </LinearGradient>

    </ThemedView>
  );
};

  const NumericInput = () => {
    const amounts = [];
    for (let i = 10; i <= userBalance / 100; i += 10) {
      amounts.push(i.toString());
    }

    return (
      <View style={{ backgroundColor: theme.colors.background }}>
        <Picker
          selectedValue={subtotal}
          style={[styles.circularInput, { backgroundColor: theme.colors.card }]}
          onValueChange={(itemValue: React.SetStateAction<string>) => setSubtotal(itemValue)}
        >
          {amounts.map((amount) => (
            <Picker.Item key={amount} label={`$${amount}`} value={amount} />
          ))}
        </Picker>

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
            <ThemedText style={[styles.welcomeText]}>Redeem Points</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={[
            styles.mainContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
        <ThemedText
            style={[
              styles.subHeadingText,
              { backgroundColor: theme.colors.background },
            ]}
          >
          CUSTOMER INFORMATION
          </ThemedText>
          {renderPointPreview()}
          
          <ThemedText
            style={[
              styles.subHeadingText,
              { backgroundColor: theme.colors.background },
            ]}
          >
          TRANSACTION CONVERSION
          </ThemedText>

          {renderTransactionPreview()}
<ThemedView style={[styles.row2, styles.iconTextContainer]}>
          <View style={[styles.iconContainerSmall]}>
  <Ionicons name="information-circle" size={16} color="rgb(230, 115, 57)" />
  </View>
  <ThemedText style={styles.noticeText}>Current conversion rate is 1 point = $0.01</ThemedText>
       </ThemedView>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25, 
    backgroundColor: "white", 
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,  
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginHorizontal: 20,
  },
  iconContainerSmall: {
    width: 20,
    height: 20,
    borderRadius: 25, 
    backgroundColor: "white", 
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,  
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginHorizontal: 10,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTextContainer: {
    marginVertical: 20,
    backgroundColor: 'rgba(253, 84, 0, 0.2)',
    borderRadius: 15,
  },
  noticeText: {
    fontSize: 12,
    color: 'black',
    marginLeft: 2,
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%", 
    paddingHorizontal: 10,
  },
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
  orangeContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    borderColor: 'rgb(230, 115, 57)',
    borderWidth: 2,
  },
  cardSpacing: {
    marginHorizontal: 3, 
  },

  cardTitle: {
    fontSize: 16,
    color: 'black',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(230, 115, 57)',
    marginTop: 5,
  },
  arrowIcon: {
    marginHorizontal: 3,
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: "center",
    paddingHorizontal: 10,
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
    borderColor: 'rgb(254, 224, 206)',
    borderWidth: 5,
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
    marginTop: 15,
  },
  redeemText2: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
});