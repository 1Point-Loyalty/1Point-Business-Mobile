import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { router, useNavigation } from "expo-router";
//import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Register() {

  const [isChecked, setIsChecked] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [tempValue, setTempValue] = useState('');

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
      <View style={styles.contentContainer}>
        <TextInput
          placeholder="Business Name"
          placeholderTextColor={'black'}
          style={styles.input}
        />
        <TextInput
          placeholder="Address"
          placeholderTextColor={'black'}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor={'black'}
          style={styles.input}
        />
        <TextInput
          placeholder="Website"
          placeholderTextColor={'black'}
          style={styles.input}
        />
        <TextInput
          placeholder="About Your Business"
          placeholderTextColor={'black'}
          style={[styles.input, styles.aboutInput]}
        />
        <TextInput
          placeholder="Logo URL"
          placeholderTextColor={'black'}
          style={styles.input}
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Points Issuance Rate (% per Dollar)"
            placeholderTextColor={'black'}
            style={styles.pointsText}
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
            tintColors={{ true: '#E95F23', false: 'b#a1a09c' }}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Agree to terms and conditions</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.navigate("/home")}
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
    height: 150,
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



});