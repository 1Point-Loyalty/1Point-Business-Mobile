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
  ScrollView,
} from "react-native";
import { useTheme } from "@/constants/ThemeCheck";
import { TransactionRow } from "@/components/ReuseableComponents/TransactionRow";
import auth from "@react-native-firebase/auth"

export default function TransactionScreen() {
  const theme = useTheme();

  const transactionArray = [
    {
      transactionAmount: 14000,
      transactionLocation: "Shawerma Plus",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123456789",
      transactionStatus: "Pending",
    },
    {
      transactionAmount: 4000,
      transactionLocation: "Shawerma Plus",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123000654",
      transactionStatus: "Pending",
    },
    {
      transactionAmount: 12000,
      transactionLocation: "Shawerma Plus",
      transactionDate: "12/12/2021",
      transactionCustomerId: "123446098",
      transactionStatus: "Complete",
    },
    {
      transactionAmount: 1000,
      transactionLocation: "Shawerma Plus",
      transactionDate: "12/12/2021",
      transactionCustomerId: "1238888888",
      transactionStatus: "Complete",
    }
  ];

  type transaction = {
    transactionAmount: number;
    transactionLocation: string;
    transactionDate: string;
    transactionCustomerId: string;
    transactionStatus: string;
    transactionType: string;
  };

  const [merchantId, setMerchantId] = useState<string | null>(null);

  const fetchMerchantId = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }
      const userId = currentUser.uid;
      const token = await currentUser.getIdToken();
      const apiUrl = `https://admin.1-point.ca/api/getUser/${userId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const userData = await response.json();
      setTimeout(() => {
        if (Array.isArray(userData) && userData.length > 0 && userData[0].merchantID) {
          setMerchantId(userData[0].merchantID);
        } else {
          console.warn("No merchantID found.");
        }
      }, );
    } catch (error) {
      console.error("Error fetching merchantId:", error);
    }
  };

  const [transactions, setTransactions] = useState<transaction[]>([]);

  const fetchTransactions = async (merchantId: string | null) => {
    const user = auth().currentUser;

    const token = await user?.getIdToken();

    fetch(`https://admin.1-point.ca/api/getMerchantTransactions/${merchantId}`, {
      method: "GET",
      headers: {
        contentType: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          setTimeout(() => {
            return response.json();
          },);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: any[]) => {
        const currTransactions: transaction[] = data.map((transaction, index) => {
          return {
            transactionAmount: transaction.pointsEquivalent,
            transactionLocation: transaction.merchant_name,
            transactionDate: (transaction.createdAt).split('T')[0],
            transactionCustomerId: transaction.phoneNumber, 
            transactionStatus: transaction.status, 
            transactionType: transaction.type,
          }
        });
        setTransactions(currTransactions);
        console.log(transactions);
        console.log(currTransactions[0].transactionCustomerId);

      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error(error);
      });
  }

  useEffect(() => {
    fetchMerchantId();
  }, []);

  useEffect(() => {
    if (merchantId) {
      fetchTransactions(merchantId);
    }
  }, [merchantId]);

  // Render the transactions section
  const renderTransactionPreview = () => {
    return (
      <ThemedView
        style={[
          styles.transactionSection,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ThemedView style={{ backgroundColor: theme.colors.background }}>
          <ThemedView
            style={[
              styles.row,
              styles.shadowProp,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <ThemedText style={styles.subHeading2Text}>
              Total # Collected
            </ThemedText>
            <ThemedView
              style={[
                styles.transactionContainer,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Image
                source={require("@/assets/images/1Point_Logo.png")}
                style={styles.pointAmounts}
              />
              <ThemedText
                style={[
                  styles.transactionPreviewText,
                  { color: theme.colors.text },
                ]}
              >
                120
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.backLabelContainerUp}>
              <ThemedText style={styles.backLabel}>+8% - Last Month</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={{ backgroundColor: theme.colors.background }}>
          <ThemedView
            style={[
              styles.row,
              styles.shadowProp,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <ThemedText style={styles.subHeading2Text}>
              {" "}
              Total # Issued{" "}
            </ThemedText>
            <ThemedView
              style={[
                styles.transactionContainer,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Image
                source={require("@/assets/images/1Point_Logo.png")}
                style={styles.pointAmounts}
              />
              <ThemedText
                style={[
                  styles.transactionPreviewText,
                  { color: theme.colors.text },
                ]}
              >
                178
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.backLabelContainerUp}>
              <ThemedText style={styles.backLabel}>+2% - Last Month</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  const mapTransactions = () => {
    return (
      <ThemedView>
        {transactions.map((transaction) => {
          return (
            <TransactionRow
              transactionAmount={transaction.transactionAmount}
              transactionLocation={transaction.transactionLocation}
              transactionDate={transaction.transactionDate}
              transactionCustomerId={transaction.transactionCustomerId}
              transactionStatus={transaction.transactionStatus}
              transactionType={transaction.transactionType}
            />
          );
        })}
      </ThemedView>
    );
  };

  // Render the transactions section
  const renderTransactions = () => {
    return (
      <ThemedView
        style={{ paddingBottom: 120, backgroundColor: theme.colors.background }}
      >
        {mapTransactions()}
      </ThemedView>
    );
  };

  // Render the home screen
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
          <Image
            source={require("@/assets/images/1Point_Logo.png")}
            style={styles.headerImage}
          />
          <ThemedView
            style={[styles.headerText, { backgroundColor: theme.colors.card }]}
          >
            <ThemedText style={[styles.welcomeText]}>TRANSACTIONS</ThemedText>
          </ThemedView>
        </ThemedView>
        <ScrollView
          style={[
            styles.mainContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <ThemedText style={styles.subHeadingText}>
            TRANSACTION PREVIEW
          </ThemedText>
          <ThemedView>{renderTransactionPreview()}</ThemedView>

          <ThemedText style={styles.subHeadingText}>
            TRANSACTION LIST
          </ThemedText>

          <ThemedView>{renderTransactions()}</ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 5,
    letterSpacing: 1,
    textAlign: "center",
  },

  subHeadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    fontVariant: ["small-caps"],
    padding: 10,
  },

  subHeading2Text: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    fontVariant: ["small-caps"],
  },

  //-------------- Slider styling -----------------

  sliderSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 26,
    margin: 5,
    position: "relative",
    height: 150,
  },

  sliderLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },

  sliderContainer: {
    flex: 0.9,
    maxHeight: 200,
  },

  //-------------- Back styling -----------------

  backLabelContainerUp: {
    backgroundColor: "#4BB543",
    borderRadius: 26,
  },

  backLabelContainerDown: {
    backgroundColor: "#ff4545",
    borderRadius: 26,
  },

  backLabel: {
    color: "black",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
  },

  backLabelWhite: {
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
  },

  //-------------- Transaction Preview Section styling -----------------

  transactionSection: {
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

  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionPreviewText: {
    fontSize: 30,
    paddingTop: 10,
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
});
