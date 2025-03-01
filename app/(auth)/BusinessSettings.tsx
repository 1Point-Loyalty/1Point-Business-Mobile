import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "expo-router";
import auth from '@react-native-firebase/auth';

export default function BusinessSettings() {
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputHeight, setInputHeight] = useState(40);

  type MerchantInfo = {
    name: string;
    phoneNumber: string;
    address: string;
    website: string;
    bio: string;
    logoURL: string;
  };

  useEffect(() => {
    fetchMerchantInfo();
  }, []);

  const fetchMerchantInfo = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }
      const userId = currentUser.uid;
      console.log(userId);
      const token = await currentUser.getIdToken();
      console.log(token);

      const apiURL = `https://admin.1-point.ca/api/getMerchant/${userId}`;
      const response = await fetch(apiURL, {
        method: "GET",
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
        setMerchantInfo(data[0]);
      } else if (typeof data === "object" && data !== null) {
        setMerchantInfo(data);
      } else {
        console.error("Unexpected API response format:", data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: string) => {
    setCurrentItem(item);
    setTempValue(
      item == "Business Name" ? `${merchantInfo?.name}` :
        item == "Address" ? `${merchantInfo?.address}` :
          item == "Phone Number" ? `${merchantInfo?.phoneNumber}` :
            item == "Website" ? `${merchantInfo?.website}` :
              item == "About Your Business" ? `${merchantInfo?.bio}` :
                item == "Logo URL" ? `${merchantInfo?.logoURL}` :
                  ''
    );
    setModalVisible(true);
  };

  const renderModalContent = () => {
    return (
      <TextInput
        style={[styles.input, { height: Math.max(40, inputHeight) }]}
        value={tempValue}
        onChangeText={setTempValue}
        multiline={true}
        textAlignVertical={tempValue.length > 50 ? 'top' : 'center'}
        onContentSizeChange={(event) =>
          setInputHeight(event.nativeEvent.contentSize.height + 10)
        }
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
          <Text style={styles.headerTitle}>Business Info</Text>
        </View>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Manage your business information</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Business Name')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Business Name</Text>
            <Text style={styles.subText}>{merchantInfo?.name}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Address')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Address</Text>
            <Text style={styles.subText}>{merchantInfo?.address}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Phone Number')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Phone Number</Text>
            <Text style={styles.subText}>{merchantInfo?.phoneNumber}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Website')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Website</Text>
            <Text style={styles.subText}>{merchantInfo?.website}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('About Your Business')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>About Your Business</Text>
            <Text style={styles.subText}>{merchantInfo?.bio}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Logo URL')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Logo URL</Text>
            <Text style={styles.subText}>{merchantInfo?.logoURL}</Text>
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
            <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(false)}>
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
    justifyContent: 'space-between'
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
    minHeight: 40,
    maxHeight: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'center'
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