import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "expo-router";
import auth from '@react-native-firebase/auth';

export default function BusinessSettings() {
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  type UserInfo = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      const userId = currentUser.uid;
      setUserId(userId);

      const apiURL = `https://admin.1-point.ca/api/getUser/${userId}`;

      const token = await currentUser.getIdToken();

      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setUserInfo(data[0]);
      } else {
        console.error("API returned an empty array or invalid data:", data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async () => {
    if (!userInfo) {
      console.error("User info is missing");
      return;
    }

    let updatedUserInfo: Partial<UserInfo> = {};

    if (currentItem === "Full Name") {
      const [firstName, lastName] = tempValue.split(" ");
      updatedUserInfo.firstName = firstName || userInfo.firstName;
      updatedUserInfo.lastName = lastName || userInfo.lastName;
    } else if (currentItem === "Phone Number") {
      updatedUserInfo.phoneNumber = tempValue || userInfo.phoneNumber;
    } else if (currentItem === "Email") {
      updatedUserInfo.email = tempValue || userInfo.email;
    }

    const userInfoBody = {
      firstName: updatedUserInfo.firstName || userInfo.firstName,
      lastName: updatedUserInfo.lastName || userInfo.lastName,
      email: updatedUserInfo.email || userInfo.email,
      phoneNumber: updatedUserInfo.phoneNumber || userInfo.phoneNumber
    };

    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      const token = await currentUser.getIdToken();

      const apiURL = `https://admin.1-point.ca/api/editUser/${userId}`;

      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfoBody),
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${responseText}`);
        Alert.alert("Error", responseText || "Failed to update profile.");
        return;
      }

      setUserInfo(prev => ({ ...prev!, ...userInfoBody }));
      setModalVisible(false);
      Alert.alert("Success", `${currentItem} has been updated.`);
    } catch (error) {
      console.error("Error updating user info:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const openModal = (item: string) => {
    setCurrentItem(item);
    setTempValue(
      item == "Full Name" ? `${userInfo?.firstName} ${userInfo?.lastName}` :
        item == "Phone Number" ? userInfo?.phoneNumber || '' :
          item == "Email" ? userInfo?.email || '' : ''
    );
    setModalVisible(true);
  };

  const renderModalContent = () => {
    return (
      <TextInput
        style={styles.input}
        value={tempValue}
        onChangeText={setTempValue}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Info</Text>
        </View>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Manage your account information</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Full Name')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Full Name</Text>
            <Text style={styles.subText}>{userInfo?.firstName} {userInfo?.lastName}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Phone Number')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Phone Number</Text>
            <Text style={styles.subText}>{userInfo?.phoneNumber}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Email')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Email</Text>
            <Text style={styles.subText}>{userInfo?.email}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
      </ScrollView>

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
              <Text style={styles.modalTitle}>Edit {currentItem}</Text>
            </View>
            {renderModalContent()}
            <TouchableOpacity style={styles.updateButton} onPress={updateUserInfo}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  subHeader: {
    padding: 16,
    paddingTop: 0,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  textContainer: {
    flexDirection: 'column',
  },
  text: {
    fontSize: 16,
  },
  subText: {
    color: 'grey',
    marginTop: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
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
});
