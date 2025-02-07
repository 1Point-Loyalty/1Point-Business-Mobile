import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import PhoneInput from "react-native-phone-input";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import { useTheme } from "@/constants/ThemeCheck";

export default function SignUp() {
  const router = useRouter();
  const navigation = useNavigation();

  navigation.setOptions({ headerShown: false });

  const theme = useTheme();

  // State variables for form inputs
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isSelected, setSelection] = useState(false);

  const [textColor, setTextColor] = useState("black");
  const [phoneTextColor, setPhoneTextColor] = useState("black");

  navigation.setOptions({ headerShown: false });

  // List of countries for phone number (Canada only)
  const countriesList = [
    {
      name: "Canada",
      iso2: "ca",
      dialCode: "1",
      priority: 0,
      areaCodes: null,
    },
  ];

  // Function to validate full name input
  const handleFullName = () => {
    const splitName = fullName.split(" ");

    if (
      splitName.length !== 2 ||
      splitName[0].length < 2 ||
      splitName[1].length < 2
    ) {
      setFullNameError("Please enter a valid first and last name");
    } else {
      setFullNameError("");
    }
  };

  // Function to format phone number input
  const formatPhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const cleaned = ("" + number).replace(/\D/g, "");
    // Limit to 10 digits
    const limited = cleaned.substring(0, 10);
    // Format the number with hyphens
    const match = limited.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return limited;
  };

  // Function to validate phone number input
  const handlePhoneNumberChange = (number: string) => {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    setPhoneNumber(number);
    const formattedNumber = formatPhoneNumber(number);
    setPhoneNumber(formattedNumber);
    if (phonePattern.test(formattedNumber) === false) {
      setPhoneTextColor("red");
    } else {
      setPhoneTextColor("black");
    }
  };

  // Function to validate email input
  const handleEmail = () => {
    // format for email: characters@characters.characters
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormat.test(email) === false) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Function to validate terms of service checkbox
  const handleTerms = () => {
    if (isSelected === false) {
      setTextColor("red");
    } else {
      setTextColor("black");
    }
  };

  // Function to validate password input
  const handlePassword = () => {
    let numberCheck = /\d/;
    let upperCaseCheck = /[A-Z]/;
    let lowerCaseCheck = /[a-z]/;
    let specialCharCheck = /[!@#$%^&*_]/;

    // password must meet all the criteria
    if (
      password.length < 8 ||
      !numberCheck.test(password) ||
      !upperCaseCheck.test(password) ||
      !lowerCaseCheck.test(password) ||
      !specialCharCheck.test(password)
    ) {
      setPasswordError(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character"
      );
    } else {
      setPasswordError("");
    }
  };

  const handlePhoneNumber = () => {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    if (phonePattern.test(phoneNumber) === false) {
      setPhoneTextColor("red");
    } else {
      setPhoneTextColor("black");
    }
  };

  // Function to handle registration
  const handleRegister = () => {
    handleFullName();
    handlePhoneNumber();
    handleEmail();
    handlePassword();
    handleTerms();
  };

  const signUp = async () => {
    if (!email || !password) {
      alert("Email and password must not be empty.");
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      router.navigate("/businessInfo");
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Sign in failed: " + err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <Image
        source={require("@/assets/images/1Point_Logo.png")}
        style={styles.logo}
      />
      <Text style={styles.header}>Welcome to 1Point!</Text>
      <Text style={styles.subHeader}>
        Sign up to start your journey with us
      </Text>
      <TextInput
        accessibilityLabel="name input"
        placeholder="Full Name"
        style={styles.input}
        onChangeText={setFullName}
      />
      <PhoneInput
        initialCountry="ca"
        countriesList={countriesList}
        textProps={{
          placeholder: "Phone Number",
          value: phoneNumber,
          onChangeText: handlePhoneNumberChange,
        }}
        style={styles.input}
      />
      <TextInput
        accessibilityLabel="email input"
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        accessibilityLabel="password input"
        placeholder="Password"
        secureTextEntry={true}
        style={styles.input}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        accessibilityLabel="signup button"
        style={styles.button}
        onPress={signUp}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.navigate("/businessInfo")}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginText2}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e2de",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 50,
    fontWeight: "bold",
    marginTop: -75,
    marginBottom: 10,
    textAlign: "left",
    color: "#000",
    width: "95%",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 45,
    color: "#000",
    width: "95%",
  },
  input: {
    width: "95%",
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#a1a09c",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#E95F23",
    width: "95%",
    padding: 10,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold',
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 75,
  },
  loginLink: {
    marginTop: 30,
  },
  loginText: {
    color: "black",
  },
  loginText2: {
    color: "#E95F23",
    fontWeight: "bold",
  },
});
