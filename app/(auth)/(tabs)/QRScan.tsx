import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

const QRScan = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [qrCode, setQRCode] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  interface UserInfo {
    [key: string]: any;
  }

  const [userInfo, setUserInfo] = useState<UserInfo>({ firstName: "" });

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleQRCodeDetected = async (code: string) => {
    setShowQRCode(true);
    setQRCode(code);

    console.log("QR Code detected: ", code);

    // decrypt the qr code
    const user = auth().currentUser;
    const token = await user?.getIdToken(); // Retrieve the token from storage

    if (!token) {
      alert("Error, No authentication token found");
      return;
    }

    const response = await fetch(
      "https://admin.1-point.ca/api/decryptUserDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ encryptedQRCode: code }),
      }
    );

    if (!response.ok) {
      alert("Error, Unable to decrypt the QR code");
      return;
    } else {
      console.log(response);
      const data = await response.json();
      console.log(data);

      setUserInfo(data[0]);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text selectionColor={"white"} style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button
          color={"black"}
          onPress={requestPermission}
          title="grant permission"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showQRCode ? (
        <View style={styles.qrCodeContainer}>
          <Text style={styles.title}>QR Code Information</Text>
          <Text style={styles.qrCode}>{qrCode}</Text>
          <Text style={styles.qrCode}>{JSON.stringify(userInfo)}</Text>
          <Text style={styles.qrCode}>Name: {userInfo.firstName}</Text>
          <Text style={styles.qrCode}>
            Available Points: {userInfo.currentPoints}
          </Text>

          <Button
            title="Scan Again"
            onPress={() => {
              setShowQRCode(false);
              setQRCode("");
              setUserInfo({});
            }}
          />
        </View>
      ) : (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(code) => handleQRCodeDetected(code.data)}
        ></CameraView>
      )}
    </View>
  );
};

export default QRScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    padding: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  qrCode: {
    fontSize: 18,
    color: "#333",
  },
});
