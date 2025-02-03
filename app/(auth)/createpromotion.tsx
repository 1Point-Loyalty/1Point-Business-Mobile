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

export default function CreatePromotions() {
  const theme = useTheme(); 
  const [image, setImage] = useState(null);

  const handleImageUpload = () => {
    // We still need a ticket for this
  };
  
 const renderPromotionPreview = () => {
       return (
         <ThemedView style={[styles.PromotionSection, {backgroundColor: theme.colors.background}]}>
        
 <ThemedView style={{ backgroundColor: theme.colors.background }}>
             <ThemedView style={[styles.row, styles.shadowProp, { backgroundColor: theme.colors.card }]}>
                 <View style={styles.imageContainer}>
                     
                     <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <ThemedText style={styles.uploadButtonText}>Upload Image</ThemedText>
              </TouchableOpacity>
                 </View>
             </ThemedView>
         </ThemedView>
           
   
         </ThemedView>
       );
     };

     const CircularInputs = () => {
      return (
        <View style={{ backgroundColor: theme.colors.background }}>
          
            <TextInput
              style={[styles.circularInput, { backgroundColor: theme.colors.card }]}
              placeholder={`Enter Title`}
              placeholderTextColor="lightgray"
            />
             <TextInput
              style={[styles.circularInput, { backgroundColor: theme.colors.card }]}
              placeholder={`Enter Description`}
              placeholderTextColor="lightgray"
            />
             <TextInput
              style={[styles.circularInput, { backgroundColor: theme.colors.card }]}
              placeholder={`Enter Percent Discount`}
              placeholderTextColor="lightgray"
            />
             <TextInput
              style={[styles.circularInput, { backgroundColor: theme.colors.card }]}
              placeholder={`Enter Start Date`}
              placeholderTextColor="lightgray"
            />
             <TextInput
              style={[styles.circularInput, { backgroundColor: theme.colors.card }]}
              placeholder={`Enter Promotion End`}
              placeholderTextColor="lightgray"
            />

<View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.navigate("/catalog")}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => {/* Add save logic here */}}>
              <ThemedText style={styles.buttonText}>Create</ThemedText>
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
            <ThemedText style={[styles.welcomeText]}>Create Promotion</ThemedText>
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
            PROMOTION IMAGE
          </ThemedText>

          {renderPromotionPreview()}

          <ThemedText
            style={[
              styles.subHeadingText,
              { backgroundColor: theme.colors.background },
            ]}
          >
            PROMOTION DETAILS
          </ThemedText>

          <ThemedView>{CircularInputs()}</ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'red',
  },
  saveButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 325,
    alignSelf: 'center',
},


  PromotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  PromotionPreviewText: {
    fontSize: 30,
    paddingTop: 10,
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

  //-------------- New Icon styling -----------------

  newLabelContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 26,
  },

  backLabelContainerUp: {
    backgroundColor: "#4BB543",
    borderRadius: 26,
  },

  backLabelContainerDown: {
    backgroundColor: "#ff4545",
    borderRadius: 26,
  },

  newLabel: {
    color: "black",
    paddingHorizontal: 10,
    paddingVertical: 5,
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

  newText: {
    fontSize: 20,
    marginLeft: 10,
    flexShrink: 1,
    color: "white",
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

  //-------------- Dots styling -----------------

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "black",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
  uploadButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
