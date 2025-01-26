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
import { useRouter } from "expo-router";
import CheckBox from "expo-checkbox";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import { useTheme } from "@/constants/ThemeCheck";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";

export default function SignUp() {
  const router = useRouter();
  const navigation = useNavigation();

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
      setPasswordError("Password must be at least 8 characters long");
    }

    // password must contain at least one number
    else if (numberCheck.test(password) === false) {
      setPasswordError("Password must contain at least one number");
    }

    // password must contain at least one uppercase letter
    else if (upperCaseCheck.test(password) === false) {
      setPasswordError("Password must contain at least one uppercase letter");
    }

    // password must contain at least one lowercase letter
    else if (lowerCaseCheck.test(password) === false) {
      setPasswordError("Password must contain at least one lowercase letter");
    }

    // password must contain at least one special character
    else if (specialCharCheck.test(password) === false) {
      setPasswordError("Password must contain at least one special character");
    }

    // password is valid
    else {
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">QR Scanning</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          and{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <ThemedText type="defaultSemiBold">w</ThemedText>{" "}
          in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the{" "}
          <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to
          provide files for different screen densities
        </ThemedText>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{ alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText>{" "}
          to see how to load{" "}
          <ThemedText style={{ fontFamily: "SpaceMono" }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{" "}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook
          lets you inspect what the user's current color scheme is, and so you
          can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{" "}
          <ThemedText type="defaultSemiBold">
            components/HelloWave.tsx
          </ThemedText>{" "}
          component uses the powerful{" "}
          <ThemedText type="defaultSemiBold">
            react-native-reanimated
          </ThemedText>{" "}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The{" "}
              <ThemedText type="defaultSemiBold">
                components/ParallaxScrollView.tsx
              </ThemedText>{" "}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
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
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    //fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 30,
  },
  loginText: {
    color: "black",
  },
  loginText2: {
    color: "#E95F23",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
