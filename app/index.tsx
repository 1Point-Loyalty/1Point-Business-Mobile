import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/constants/ThemeCheck";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const router = useRouter();
  const navigation = useNavigation();

  navigation.setOptions({ headerShown: false });

  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Function to handle registration
  const handleLogin = async () => {
    // format for email: characters@characters.characters
    var emailError = "";
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormat.test(email) === false) {
      emailError = "Please enter a valid email address";
    }

    var passwordError = "";
    // password must contain at least one number
    let numberCheck = /\d/;

    //password must contain uppercase letter
    let upperCaseCheck = /[A-Z]/;

    //password must contain lowercase letter
    let lowerCaseCheck = /[a-z]/;

    //password must contain special character
    let specialCharCheck = /[!@#$%^&*_]/;

    // password must be at least 8 characters long
    if (password.length < 8) {
      passwordError = "Password must be at least 8 characters long";
    }

    // password must contain at least one number
    else if (numberCheck.test(password) === false) {
      passwordError = "Password must contain at least one number";
    }

    // password must contain at least one uppercase letter
    else if (upperCaseCheck.test(password) === false) {
      passwordError = "Password must contain at least one uppercase letter";
    }

    // password must contain at least one lowercase letter
    else if (lowerCaseCheck.test(password) === false) {
      passwordError = "Password must contain at least one lowercase letter";
    }

    // password must contain at least one special character
    else if (specialCharCheck.test(password) === false) {
      passwordError = "Password must contain at least one special character";
    }

    if (emailError != "" || passwordError != "") {
      alert(`Failed Validations: \n ${emailError} \n ${passwordError}`);
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert(
        "Sign up failed - please check if entered email and password are correct"
      );
      console.log(err.message);
      return;
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Image
        source={require("@/assets/images/1Point_Logo.png")}
        style={styles.logo}
      />
      <Text style={styles.companyName}>1Point Business</Text>
      <View style={styles.loginBox}>
        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.label}>Sign In To Your Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Text style={styles.forgotPassword}>Forgot your Password?</Text>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.flexRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}></TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}></TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.navigate("/signUp")}>
            <Text style={styles.registerNow}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: -100,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: -5,
  },
  companyName: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 60,
    fontFamily: "sans-serif-medium",
  },
  loginBox: {
    width: "90%",
    marginTop: -10,
    padding: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#E95F23",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#E95F23",
    width: "70%",
    padding: 10,
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#252626",
    marginHorizontal: 10,
  },
  orText: {
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: "row",
    marginTop: -50,
    marginBottom: 10,
  },
  socialButton: {
    padding: 10,
    margin: 5,
  },
  socialText: {
    fontWeight: "bold",
    color: "#FFF",
  },
  footer: {
    flexDirection: "row",
    marginTop: -10,
  },
  footerText: {
    color: "#666",
  },
  registerNow: {
    color: "#E95F23",
    fontWeight: "bold",
  },
  orLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
