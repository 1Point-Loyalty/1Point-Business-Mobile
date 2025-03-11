import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useNavigation } from "expo-router";
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from "expo-checkbox";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PhoneInput from "react-native-phone-input";
import auth from "@react-native-firebase/auth";
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerAsset } from 'expo-document-picker';
import storage from '@react-native-firebase/storage';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

export default function Register() {

  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [logoDoc, setLogoDoc] = useState<DocumentPickerAsset | null>(null);
  const [certificateDoc, setCertificateDoc] = useState<DocumentPickerAsset | null>(null);
  const [selectedType, setSelectedType] = useState('Select a type'); // Initial type
  const [pointsIssuanceRate, setPointsIssuanceRate] = useState(1); // Initialize slider value

  const countriesList = [
    {
      name: "Canada",
      iso2: "ca",
      dialCode: "1",
      priority: 0,
      areaCodes: null,
    },
  ];

  const pickLogo = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (res.assets && res.assets.length > 0) {
        const selectedDocument = res.assets[0];
        setLogoDoc(selectedDocument);
      } else {
        console.log('Document picking cancelled or failed');
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const pickCertificate = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (res.assets && res.assets.length > 0) {
        const selectedDocument = res.assets[0];
        setCertificateDoc(selectedDocument);
      } else {
        console.log('Document picking cancelled or failed');
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const uploadLogoToFirebase = async (userId: String) => {
    if (!logoDoc) {
      alert('Please select a logo first.');
      return null;
    }
    try {
      const reference = storage().ref(`merchant_logos/${userId}/logo`);
      const task = reference.putFile(logoDoc.uri);
      task.on('state_changed', snapshot => {
        console.log(`Upload progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
      });
      await task;
      const url = await reference.getDownloadURL();
      console.log('Uploaded file URL:', url);
      return url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
      return null;
    }
  };

  const uploadCertificateToFirebase = async (userId: String) => {
    if (!certificateDoc) {
      alert('Please select a certificate of incorporation document first.');
      return null;
    }
    try {
      const reference = storage().ref(`merchant_documents/${userId}/certificate`);
      const task = reference.putFile(certificateDoc.uri); 
      task.on('state_changed', snapshot => {
        console.log(`Upload progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
      });
      await task;
      const url = await reference.getDownloadURL();
      console.log('Uploaded file URL:', url);
      return url;
    } catch (error) {
      console.error('Error uploading certificate of incorporation:', error);
      alert('Error uploading certificate of incorporation. Please try again.');
      return null;
    }
  };

  const handleCreateMerchant = async () => {
      setIsLoading(true); // Start loading
      const user = auth().currentUser;
      const userId = user?.uid;
      const token = await user?.getIdToken(); // Retrieve the token from storage
      if (!userId) {
        setIsLoading(false)
        alert("Error, Failed to recognize user");
        return;
      };
      if (!token) {
        setIsLoading(false)
        alert("Error, No authentication token found");
        return;
      };
      if (selectedType=='Select a type') {
        setIsLoading(false)
        alert("Please select a business type to represent your business")
        return
      }

      const firebaseLogoURL = await uploadLogoToFirebase(userId);
      if (!firebaseLogoURL) {
        setIsLoading(false)
        alert("Failed to upload logo")
        return;
      }

      const firebaseCertificateURL = await uploadCertificateToFirebase(userId);
      if (!firebaseCertificateURL) {
        setIsLoading(false)
        alert("Failed to upload certificate of incorporation")
        return;
      }

      const response = await fetch(
        `https://admin.1-point.ca/api/createMerchant/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            "name": name,
            "address": address,
            "phoneNumber": phoneNumber,
            "website": website,
            "bio": about,
            "logoURL": firebaseLogoURL,
            "certificateURL": firebaseCertificateURL,
            "type": selectedType,
            "pointsPerDollar": pointsIssuanceRate
          }),
        }
      );

      console.log(response)
      if (response.ok) {
        const result = await response.json();
        setIsLoading(false)
        alert("Success, Merchant created successfully");
        router.navigate("/home")
      } else {
        const error = await response.text();
        console.log(error)
        setIsLoading(false)
        alert(error);
      }
  }

  // Function to validate phone number input
  const handlePhoneNumberChange = (number: string) => {
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    setPhoneNumber(number);
    const formattedNumber = formatPhoneNumber(number);
    setPhoneNumber(formattedNumber);
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

  const openModal = (item: string) => {
    setCurrentItem(item);
    setTempValue('');
    setModalVisible(true);
  };

  const renderModalContent = () => {
    return (
      <Text style={styles.modalText}>
        Ex. 1 point per dollar spent = 1% per dollar
      </Text>
    );
  };

  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });

  return (
    <View style={styles.container}>
      <View style={styles.roundedTop}>
        <Text style={styles.header}>1Point Merchant</Text>
        <Text style={[styles.header, styles.headerSpacing]}>Registration</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <TextInput
            placeholder="Business Name"
            placeholderTextColor={'black'}
            style={styles.input}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Address"
            placeholderTextColor={'black'}
            style={styles.input}
            onChangeText={setAddress}
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
            placeholder="Website"
            placeholderTextColor={'black'}
            style={styles.input}
            onChangeText={setWebsite}
          />
          <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
          >
            <Picker.Item label="Select a type" value="Select a type" />
            <Picker.Item label="Salon" value="Salon" />
            <Picker.Item label="Retail" value="Retail" />
            <Picker.Item label="Restaurant" value="Restaurant" />
            <Picker.Item label="Café" value="Café" />
            <Picker.Item label="Fitness" value="Fitness" />
            <Picker.Item label="Boutique" value="Boutique" />
            <Picker.Item label="Bookstore" value="Bookstore" />
            <Picker.Item label="Pet Supplies" value="Pet Supplies" />
            <Picker.Item label="Convenience" value="Convenience" />
            <Picker.Item label="Entertainment" value="Entertainment" />
          </Picker>
        </View>
      
        <TextInput
          placeholder="About Your Business"
          placeholderTextColor={'black'}
          style={[styles.input, styles.aboutInput]}
          onChangeText={setAbout}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={pickLogo}>
          <Text style={styles.uploadButtonText}>Upload Logo</Text>
        </TouchableOpacity>
        {logoDoc && <Text style={styles.documentName}>{logoDoc.name}</Text>}
        <TouchableOpacity style={styles.uploadButton} onPress={pickCertificate}>
          <Text style={styles.uploadButtonText}>Upload Certificate of Incorporation</Text>
        </TouchableOpacity>
        {certificateDoc && <Text style={styles.documentName}>{certificateDoc.name}</Text>}
        <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Points Issuance Rate: {pointsIssuanceRate}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={pointsIssuanceRate}
          onValueChange={setPointsIssuanceRate}
          minimumTrackTintColor="#E95F23"
          maximumTrackTintColor="#a1a09c"
        />
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => openModal('Information')}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="information"
            size={20}
            color="#E95F23"
          />
        </TouchableOpacity>
      </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setIsChecked}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Agree to terms and conditions</Text>
        </View>
        {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E95F23" />
            </View>
          )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleCreateMerchant()}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBackButton}>
                  <Icon name="arrow-back-outline" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Points Issuance Rate Information</Text>
              </View>
              {renderModalContent()}
            </View>
          </View>
        </Modal>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#e3e2de',
    padding: 22,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '100%',
  },
  roundedTop: {
    top: 0,
    right: 0,
    width: '113%',
    height: 180,
    backgroundColor: '#E95F23',
    borderBottomLeftRadius: 60,
    paddingLeft: 28,
    paddingTop: 47
  },
  contentContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 36,
    color: 'white',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSpacing: {
    marginTop: -10,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: "#a1a09c",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingTop: 0,
    borderRadius: 5,
    fontSize: 16,
  },
  aboutInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
    marginBottom: 14,
    borderColor: "#a1a09c",
    borderWidth: 1,
    borderRadius: 5,
  },
  inputContainer: {
    width: '100%',
    height: 48,
    borderColor: "#a1a09c",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: 'row',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  checkboxLabel: {
    color: 'black',
    fontSize: 16,
  },
  checkbox: {
    marginRight: 10,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    width: '100%',
    height: 48,
    borderColor: "#a1a09c",
    borderWidth: 1,
    borderRadius: 5,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#E95F23',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 28,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    textAlign: 'right',
    marginRight: 2,
  },
  pointsText: {
    fontSize: 16,
    marginLeft: -1,
  },
  infoButton: {
    justifyContent: 'center',
    flex: 1,
    textAlign: 'right',
    marginRight: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalBackButton: {
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  updateButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#E95F23',
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 17,
    textAlign: 'center',
  },
  uploadButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: 'black',
    fontSize: 16,
  },
  documentName: {
    marginTop: -10,
    marginBottom: 10,
    color: 'gray',
    fontSize:14,
  }



});