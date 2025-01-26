import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  SafeAreaView,
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

  return(
    <SafeAreaView style={styles.main}>
        {/* Header */}
          <View style={styles.container}>
              <View style={styles.header}>
                <Image
                  source={require('@/assets/images/1Point_Logo.png')}
                  style={styles.headerImage}
                />
                <View style={styles.headerText}>
                  <Text style={styles.welcomeText}>Forgot Password?</Text>
                </View>
              </View>
          </View>

      <View style={styles.formContainer}>
        {/* Email Instruction Text */}
        <Text style={styles.messageText}>Please enter a valid email address:</Text>

        {/* Email Input Field */}
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
          
          <TouchableOpacity 
          style={styles.sendEmail}
          onPress={handleSendEmail}>
            <Text style={styles.sendEmailText}>Send Email</Text>
          </TouchableOpacity>
          {messageVisible && (
                    <Text style={styles.emailSentText}>An email to change your password has been sent to you!</Text>
                  )}
        </View>
        <TouchableOpacity
        style={styles.backButton}
        accessibilityLabel='go back'
        onPress={() => router.navigate("/")}>
          <Text style = {styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>        
      </View>
          

    </SafeAreaView>    
  )
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 71,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 50,
    minWidth: "95%",
    margin: 5,
  },
  inputContainer: {
    width:"100%",
    alignItems: "center",
    paddingBottom:225
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  emailText: {
    flex:1,
    marginLeft:10,
    fontSize:16,
    marginBottom:10,
    textAlign:"left"
  },  
  formContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,  
    paddingBottom: 200,
    alignItems:"center"
  }, 
  sendEmail: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  sendEmailText: {
    fontSize:16
  },
  emailSentText: {
    fontSize:18,
    textAlign:"center",
    marginTop:15,
  },
  backButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});