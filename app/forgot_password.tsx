import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  SafeAreaView,
  Dimensions,
} from "react-native";
import CheckBox from "expo-checkbox";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
const { width } = Dimensions.get("window");

export default function forgotPassword() {
  const router = useRouter();
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });
  const [messageVisible, setMessageVisible] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendEmail = () => {
    auth().sendPasswordResetEmail(email)
      .then(() => {
        setMessageVisible(true);
      })
      .catch((error: any) => {
        alert(error);
      });
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.pageBackButton}>
          <Icon name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/forgotPasswordLock.png")}
          style={styles.image}
        />
        <Text style={styles.headerText}>Forgot Password?</Text>
        <Text style={styles.headerSubText1}>Please enter a valid email below to recieve</Text>
        <Text style={styles.headerSubText2}>password reset instructions:</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="email"
              size={24}
              color="black"
            />
            <TextInput
              accessibilityLabel="email input"
              placeholder="Email"
              style={styles.emailText}
              onChangeText={setEmail}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.sendEmail}
          onPress={handleSendEmail}>
          <Text style={styles.sendEmailText}>Send Email</Text>
        </TouchableOpacity>
        {messageVisible && (
          <Text style={styles.emailSentText}>An email to change your password has been sent to you!</Text>
        )}
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerSubText1: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
    paddingHorizontal: 30,
  },
  headerSubText2: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
    marginBottom: 50,
    paddingHorizontal: 30,
  },
  pageBackButton: {
    marginRight: 16,
  },
  imageContainer: {
    flex: 0,
    alignItems: 'center',
    paddingTop: 25,
    width: width,
    height: 390,
  },
  image: {
    flex: 1,
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 50,
    minWidth: "95%",
    margin: 5,
  },
  inputContainer: {
    width: width - 40,
    alignItems: "center",
    paddingBottom: 25
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  emailText: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    textAlign: "left"
  },
  formContainer: {
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 300,
    alignItems: "center"
  },
  sendEmail: {
    backgroundColor: "#fc7c01", //New orange used instead of old 
    padding: 10,
    borderRadius: 20,
    width: width - 57,
    alignItems: "center",
  },
  sendEmailText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  emailSentText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
  },
});