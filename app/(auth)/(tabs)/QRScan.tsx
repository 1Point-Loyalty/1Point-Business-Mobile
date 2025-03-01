import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import auth from "@react-native-firebase/auth";
import QRInfoLoadingState from "@/components/loadingState/QRInfoLoadingState";
import { router } from "expo-router";



  export interface UserInfo {
    createdAt: string;
    currentPoints: number;
    email: string;
    firstName: string;
    id: string;
    ipAddress: string;
    isAdmin: number;
    isBO: number;
    lastName: string;
    merchantID: string | null;
    phoneNumber: string;
    status: "ACTIVE" | "INACTIVE";
    updatedAt: string;
  }

  const QRScan = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [showQRCode, setShowQRCode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleQRCodeDetected = async (code: string) => {
    setShowQRCode(true);
    setIsLoading(true);

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

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>
          We need your permission to use the camera
        </Text>
        <Button
          color={"black"}
          onPress={requestPermission}
          title="Grant Permission"
        />
      </View>
    );
  }

  /////////////////////////////////////////////////////////////////////////////
  const UserDetails: React.FC<{ userInfo: UserInfo }> = ({ userInfo }) => {
    return (
      <>
        <Text style={styles.title}>Customer Information</Text>
        <Text style={styles.qrCode}>Name: {userInfo.firstName}</Text>
        <Text style={styles.qrCode}>
          Available Points: {userInfo.currentPoints}
        </Text>
        <Text style={styles.qrCode}>
          Available to Redeem:{" "}
          {"$" +
            // find out how many points can be redeemed
            // every 1000 points can be redeemed for $10
            Math.floor(userInfo.currentPoints / 1000) * 10}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton}
          onPress={() => {
            router.navigate({
              pathname: "../awardpoints",
              params: { userInfo: JSON.stringify(userInfo) },
            });
          }}>
            <Text style={styles.buttonText}>Award Points</Text>

          </TouchableOpacity>

          <TouchableOpacity disabled={true} style={styles.actionButton}>
            <Text style={styles.buttonText}>Redeem Points</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };
  //////////////////////////////////////////////////////////////////////////

  return (
    <View style={styles.container}>
      {showQRCode ? (
        <View style={styles.qrCodeContainer}>
          {isLoading ? (
            <QRInfoLoadingState />
          ) : userInfo ? (
            <UserDetails userInfo={userInfo} />
          ) : (
            <Text>No user information available</Text>
          )}
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => {
              setShowQRCode(false);
              setUserInfo(null);
            }}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
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
    backgroundColor: "#f8f9fa",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  permissionMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#495057",
  },
  camera: {
    flex: 1,
  },
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#212529",
  },
  qrCode: {
    fontSize: 18,
    color: "#495057",
    backgroundColor: "#e9ecef",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#f8f9fa",
    borderColor: "#E95F23",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  scanAgainButton: {
    marginTop: 20,
    backgroundColor: "#E95F23",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "95%",
  },
  scanAgainText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
