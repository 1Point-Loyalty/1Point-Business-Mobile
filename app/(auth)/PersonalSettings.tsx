import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "expo-router";

export default function BusinessSettings() {
  const navigation = useNavigation();
  navigation.setOptions({ headerShown: false });

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [fullName, setFullName] = useState('HJ Kwon');
  const [PhoneNumber, setPhoneNumber] = useState('519 888 4567');
  const [email, setEmail] = useState('hjkwon@uwaterloo.ca');

  const [tempValue, setTempValue] = useState('');

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
            <Text style={styles.subText}>{fullName}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Phone Number')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Phone Number</Text>
            <Text style={styles.subText}>{PhoneNumber}</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => openModal('Email')}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Email</Text>
            <Text style={styles.subText}>{email}</Text>
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
