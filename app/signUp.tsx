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
import React, { useEffect, useState } from "react";
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
  const [fullNameColor, setFullNameColor] = useState("#a1a09c")

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("")
  const [phoneNumberColor, setPhoneNumberColor] = useState("#a1a09c");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailColor, setEmailColor] = useState("#a1a09c")

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [passwordColor, setPasswordColor] = useState("#a1a09c")

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
  const handleFullName = (fullName: string) => {
    setFullName(fullName)
    const name = fullName.trim().split(" ");

    if (name.length === 1) {
      setFullNameError(`Please enter your ${name[0].length >= 2 ? "last" : "first"} name`);
      setFullNameColor("red");
      return false;
    }
    if (name.length > 1) {
      if (name[0].length < 2 || name[1].length < 2) {
        setFullNameError("Both names must be at least 2 characters long");
        setFullNameColor("red");
        return false;
      }
    }
    setFullNameError("");
    setFullNameColor("#a1a09c");
    return true;
  };

  // Function to format phone number input
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove all non-digit characters
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
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
  const handlePhoneNumberChange = (phoneNumber: string) => {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    setPhoneNumber(phoneNumber);

    const formattedNumber = formatPhoneNumber(phoneNumber);
    setPhoneNumber(formattedNumber);

    if (!phonePattern.test(formattedNumber)) {
      setPhoneNumberError("Phone number must be exactly 10 digits long");
      setPhoneNumberColor("red");
      return false;
    }
    setPhoneNumberError("");
    setPhoneNumberColor("#a1a09c");
    return true;
  };

  // Function to validate email input
  const handleEmail = (email: string) => {
    setEmail(email);

    if (!email) {
      setEmailError("Please enter your email address");
      setEmailColor("red");
      return false;
    }
    if (email.split("@").length - 1 !== 1) {
      setEmailError("An email address must contain a single @");
      setEmailColor("red");
      return false;
    }
    // format for email: characters@characters.characters
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailFormat.test(email) === false) {
      setEmailError("Please enter a valid email address");
      setEmailColor("red");
      return false;
    }
    setEmailError("");
    setEmailColor("#a1a09c");
    return true;
  };

  // Function to validate password input
  const handlePassword = (password: string) => {
    setPassword(password);

    let errors = [];
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Contains one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Contains one uppercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Contains one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
      errors.push("Contains one special character (@, #, $, etc.)");
    }
    setPasswordError(errors);
    setPasswordColor(errors.length > 0 ? "red" : "#a1a09c");
    return errors.length === 0;
  };

  // Function to handle registration
  const handleRegister = () => {
    const fullNameValid = handleFullName(fullName);
    const phoneNumberValid = handlePhoneNumberChange(phoneNumber);
    const emailValid = handleEmail(email);
    const passwordValid = handlePassword(password);

    return fullNameValid &&
      phoneNumberValid &&
      emailValid &&
      passwordValid
  };

  const signUp = async () => {
    const valid = handleRegister();
    if (!valid) {
      alert("Please correct the errors or fill all required fields before proceeding.");
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      handleCreateUser()
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Sign up failed: " + err.message);
    }
  };

  const handleCreateUser = async () => {
    const user = auth().currentUser;
    const userId = user?.uid;
    const token = await user?.getIdToken(); // Retrieve the token from storage
    if (!token) {
      alert("Error, No authentication token found");
      return;
    };

    var first = fullName.split(" ")[0]
    var last = fullName.split(" ")[1]

    const response = await fetch(
      `https://admin.1-point.ca/api/createUser/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          "firstName": first,
          "lastName": last,
          "email": email,
          "phoneNumber": phoneNumber,
          "isBO": 1
        }),
      }
    );

    const result = await response.json();
    console.log(result)
    if (response.ok) {
      console.log("//// OK")
      const result = await response.json();
      alert("Success, User created successfully");
    } else {
      console.log("//// Failed")
      const error = await response.text();
      alert(error);
      console.log(error)
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.card }
      ]}
    >
      <Image
        source={require("@/assets/images/1Point_Logo.png")}
        style={styles.logo}
      />
      <Text style={styles.header}>Welcome to 1Point!</Text>
      <Text style={styles.subHeader}>
        Sign up to start your journey with us
      </Text>
      <View
        style={styles.inputWrapper}
      >
        <TextInput
          accessibilityLabel="name input"
          placeholder="Full Name"
          style={[styles.input, { borderColor: fullNameColor }]}
          onChangeText={handleFullName}
          value={fullName}
        />
        {fullNameError && <Text style={styles.errorText}>{fullNameError}</Text>}
      </View>
      <View
        style={styles.inputWrapper}
      >
        <PhoneInput
          initialCountry="ca"
          countriesList={countriesList}
          textProps={{
            placeholder: "Phone Number",
            value: phoneNumber,
            onChangeText: handlePhoneNumberChange,
          }}
          style={[styles.input, { borderColor: phoneNumberColor }]}
        />
        {phoneNumberError && <Text style={styles.errorText}>{phoneNumberError}</Text>}
      </View>
      <View
        style={styles.inputWrapper}
      >
        <TextInput
          accessibilityLabel="email input"
          placeholder="Email"
          style={[styles.input, { borderColor: emailColor }]}
          onChangeText={handleEmail}
          value={email}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>
      <View
        style={styles.inputWrapper}
      >
        <TextInput
          accessibilityLabel="password input"
          placeholder="Password"
          secureTextEntry={true}
          style={[styles.input, { borderColor: passwordColor }]}
          onChangeText={handlePassword}
          value={password}
        />
        {passwordError.map((error, index) => (
          <Text key={index} style={styles.errorText}>
            {error}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        accessibilityLabel="signup button"
        style={styles.button}
        onPress={signUp}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.navigate("/")}
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
  inputWrapper: {
    width: "95%",
    marginBottom: 10,
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
    height: 40,
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
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 1,
    marginTop: 1,
  }
});
