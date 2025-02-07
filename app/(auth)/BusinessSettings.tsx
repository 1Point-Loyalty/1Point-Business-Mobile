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
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  type MerchantInfo = {
    name: string;
    phoneNumber: string;
    address: string;
    website: string;
    bio: string;
    logoURL: string;
  };

  useEffect(() => {
    fetchMerchantId();
  }, []);

  useEffect(() => {
    if (merchantId) {
      fetchMerchantInfo(merchantId);
    }
  }, [merchantId]);

  const fetchMerchantId = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }
      const userId = currentUser.uid;
      const token = await currentUser.getIdToken();
      //const token = ('eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMjUwZDIyYTkzODVmYzQ4NDJhYTU2YWJhZjUzZmU5NDcxNmVjNTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9pbnQtYWRtaW4iLCJhdWQiOiJwb2ludC1hZG1pbiIsImF1dGhfdGltZSI6MTczODkxNzE5OSwidXNlcl9pZCI6Im81dDlxVXBxSGlnTk5mVXpycDdOaDAxd2l6NzIiLCJzdWIiOiJvNXQ5cVVwcUhpZ05OZlV6cnA3TmgwMXdpejcyIiwiaWF0IjoxNzM4OTE3MTk5LCJleHAiOjE3Mzg5MjA3OTksImVtYWlsIjoiYXNodmluZ3Jld2FsMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXNodmluZ3Jld2FsMDJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.ADinDhgUtrf3gM2aG2n-QGRFesDVDR6-ek-zHnJkf8OD0QdU4i7MFt39vQXeHRRZHm__exZ3neF_hVaZswnaz_61b3NYx0VB8PIi4HwiwGVPNYAalTsjCYm51uP6H-TrQ-b0d-ZFYIi-6XsjJECdGBt_gVcwYjRFcpmY1Ph6g3lPvYqjNGcPgMQRVyjjGzD2Ehhjt2ogXaErbpGDxolPtFBrktySxZT8pRoyTXWnvJM3d7iE9d9jMkNGuUEHJqCrhdflRyYQOtYUOgx-r6Sp5uBd3_hc5E6Fh4dWd3IaB4MZwOl_hY0rOrF-_AKZk9EFO6ajzLiNOGZwfySoKSQS5w');
      //const userId = 'tCGeM4IhNberWn2PkujGek7pU8b2'; 
      const apiUrl = `https://admin.1-point.ca/api/getUser/${userId}`;
      const response = await fetch(apiUrl, {
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

      const userData = await response.json();

      if (Array.isArray(userData) && userData.length > 0 && userData[0].merchantID) {
        setMerchantId(userData[0].merchantID);
      } else {
        console.warn("No merchantID found.");
        //return null;
      }
    } catch (error) {
      console.error("Error fetching merchantId:", error);
      //return null;
    }
  };

  const fetchMerchantInfo = async (merchantId: string) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }
      const token = await currentUser.getIdToken();
      //const token = ('eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMjUwZDIyYTkzODVmYzQ4NDJhYTU2YWJhZjUzZmU5NDcxNmVjNTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9pbnQtYWRtaW4iLCJhdWQiOiJwb2ludC1hZG1pbiIsImF1dGhfdGltZSI6MTczODkxNzE5OSwidXNlcl9pZCI6Im81dDlxVXBxSGlnTk5mVXpycDdOaDAxd2l6NzIiLCJzdWIiOiJvNXQ5cVVwcUhpZ05OZlV6cnA3TmgwMXdpejcyIiwiaWF0IjoxNzM4OTE3MTk5LCJleHAiOjE3Mzg5MjA3OTksImVtYWlsIjoiYXNodmluZ3Jld2FsMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXNodmluZ3Jld2FsMDJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.ADinDhgUtrf3gM2aG2n-QGRFesDVDR6-ek-zHnJkf8OD0QdU4i7MFt39vQXeHRRZHm__exZ3neF_hVaZswnaz_61b3NYx0VB8PIi4HwiwGVPNYAalTsjCYm51uP6H-TrQ-b0d-ZFYIi-6XsjJECdGBt_gVcwYjRFcpmY1Ph6g3lPvYqjNGcPgMQRVyjjGzD2Ehhjt2ogXaErbpGDxolPtFBrktySxZT8pRoyTXWnvJM3d7iE9d9jMkNGuUEHJqCrhdflRyYQOtYUOgx-r6Sp5uBd3_hc5E6Fh4dWd3IaB4MZwOl_hY0rOrF-_AKZk9EFO6ajzLiNOGZwfySoKSQS5w');

      const apiURL2 = `https://admin.1-point.ca/api/getMerchant/${merchantId}`;
      const response = await fetch(apiURL2, {
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
    setTempValue('');
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
