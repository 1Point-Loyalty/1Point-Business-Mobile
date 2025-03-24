import { useTheme } from "@/constants/ThemeCheck";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const TransactionRow = ({
  transactionAmount,
  transactionSubtotal,
  transactionDate,
  transactionCustomerId,
  transactionStatus,
  transactionType,
}: {
  transactionAmount: number;
  transactionSubtotal: string;
  transactionDate: string;
  transactionCustomerId: string;
  transactionStatus: string;
  transactionType: string;
}) => {
  const theme = useTheme();

  const displayStatus = () => {
    if (transactionStatus === "PAID") {
      return "green";
    } else if (transactionStatus === "PENDING") {
      return "blue";
    } else {
      return "red";
    }
  };

  const renderIcon = () => {
    if (transactionType === "redemption") {
      return (
        <ThemedView style={[styles.iconContainerRed, styles.imageContainer]}>
          <Ionicons name="arrow-down" size={30} color="white" />
          <ThemedText style={{ color: "white", fontSize: 10, marginTop: 2 }}>
            Redemption
          </ThemedText>
        </ThemedView>
      );
    } else if (transactionType === "transaction") {
      return (
        <ThemedView style={[styles.iconContainerGreen, styles.imageContainer]}>
          <Ionicons name="arrow-up" size={30} color="white" />
          <ThemedText style={{ color: "white", fontSize: 10, marginTop: 2 }}>
            Issued
          </ThemedText>
        </ThemedView>
      );
    }
  };

  return (
    <ThemedView style={{ backgroundColor: theme.colors.background }}>
      <ThemedView
        style={[
          styles.sliderSection,
          styles.shadowProp,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <ThemedView style={{ backgroundColor: theme.colors.card }}>
          {renderIcon()}
        </ThemedView>
        <ThemedView style={styles.contentContainerWhole}>
          <ThemedView style={{ paddingVertical: 5 }}>
            <ThemedText style={styles.customerContainer}>
              {"Customer ID: " + transactionCustomerId}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.contentContainer}>
            <ThemedText style={[styles.labelContainer]}>
              {"Points: " + transactionAmount}
            </ThemedText>
            <ThemedText style={[styles.labelContainer]}>
              {"Date: " + transactionDate}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.contentContainer}>
            <ThemedText style={[styles.labelContainer]}>
              Subtotal: ${transactionSubtotal}
            </ThemedText>
            <ThemedText
              style={[styles.labelContainer, { color: displayStatus() }]}
            >
              {transactionStatus}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  //-------------- Transaction Section styling -----------------
  iconContainerRed: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgb(255, 145, 81)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  iconContainerGreen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgb(255, 94, 0)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  sliderSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 26,
    margin: 5,
    position: "relative",
    minHeight: 100,
  },

  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  imageContainer: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    color: "#FFFFFF",
  },
  //-------------- Content Section styling -----------------

  contentContainerWhole: {
    flexDirection: "column",
    justifyContent: "center",
    width: "70%",
    padding: 5,
  },

  contentContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    width: "50%",
    padding: 5,
  },

  customerContainer: {
    backgroundColor: "#FF8D4D",
    color: "white",
    textAlign: "center",
    borderRadius: 26,
    fontSize: 11,
    width: "100%",
  },

  labelContainer: {
    backgroundColor: "lightgrey",
    color: "black",
    textAlign: "center",
    borderRadius: 10,
    fontSize: 11,
    width: "100%",
    marginHorizontal: 5,
  },
});
