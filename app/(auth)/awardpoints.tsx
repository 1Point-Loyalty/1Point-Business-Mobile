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
} from "react-native";
import PagerThemedView from "react-native-pager-view";
import { useTheme } from "@/constants/ThemeCheck";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AwardPoints() {
  const theme = useTheme(); 
  const [points, setPoints] = useState('0');
  
 const renderPointPreview = () => {
       return (
         <ThemedView style={[styles.PromotionSection, {backgroundColor: theme.colors.background}]}>
        
 <ThemedView style={{ backgroundColor: theme.colors.background }}>
             <ThemedView style={[styles.row, styles.shadowProp, { backgroundColor: theme.colors.notification }]}>
                 <View style={styles.imageContainer}>
                <ThemedText style={styles.awardText}>You are awarding</ThemedText>        
                <ThemedText style={styles.pointText}>{Math.round(Number(points))}</ThemedText>
                <ThemedText style={styles.awardText}>points to your customer</ThemedText>
                <ThemedText style={styles.awardText2}>${points} to {Math.round(Number(points))} points</ThemedText>       
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
                placeholder="Enter Points"
                placeholderTextColor="lightgray"
                keyboardType='decimal-pad'
                value={points}
                onChangeText={setPoints}
              />
         

<View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.navigate("/catalog")}>
              <ThemedText style={styles.buttonText2}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => {/* Add save logic here */}}>
              <ThemedText style={styles.buttonText}>Award Points</ThemedText>
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
          <TouchableOpacity style={styles.headerImage} onPress={() => router.navigate("/catalog")}>
                <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          <ThemedView
            style={[styles.headerText, { backgroundColor: theme.colors.card }]}
          >
            <ThemedText style={[styles.welcomeText]}>Award Points</ThemedText>
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
  awardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  awardText2: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});