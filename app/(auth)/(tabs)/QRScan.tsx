import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

const QRScan = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [qrCode, setQrCode] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const handleQRCodeDetected = (code: string) => {
    setQrCode(code);
    setTimeout(() => {
      setShowQRCode(true);
    }, 1000);
  };

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
