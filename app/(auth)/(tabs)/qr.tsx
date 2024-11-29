import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import PagerView from 'react-native-pager-view';
import QRCode from 'react-native-qrcode-svg';


export default function TabTwoScreen() {

  const userData = {
    firstName: 'Aryan',
    lastName: 'Abuosba',
    email: 'contact.saifa@gmail.com',
    phoneNumber: '416-899-6360',
    created_time: '2024-09-21 22:26:35',
    updated_time: '2024-09-21 22:26:35',
    is_BO: false,
    ipAddress: '99.233.13.66'
  };


  // call lambda function to get user data
  // const [userData, setUserData] = useState(null);
  // useEffect(() => {
  //   fetch('https://api.example.com/user')
  //     .then(response => response.json())
  //     .then(data => setUserData(data));
  // }, []);


  // extract user phone number from user data
  // const userPhoneNumber = userData?.phoneNumber;

  // display qr code for user phone number
  // return (
  //   <SafeAreaView style={styles.main}>
  //     <View style={styles.container}>
  //       <View style={styles.header}>
  //         <Image
  //           source={require('@/assets/images/1Point_Logo.png')}
  //           style={styles.headerImage}
  //         />
  //         <View style={styles.headerText}>
  //           <Text style={styles.welcomeText}>Welcome John!</Text>
  //         </View>
  //       </View>
  //     </View>  
  //   </SafeAreaView >
  // );


  // Render the points section
  const renderPointsSection = () => {
    return (

      <View style={styles.pointsSection}>

        <View style={styles.row}>

          <Text style={styles.label}>Current Point Balance:</Text>

          <View style={styles.pointContainer}>

            <Image
              source={require('@/assets/images/1Point_Logo.png')}
              style={styles.pointAmounts}
            />
            <Text style={styles.pointText}>1,978</Text>

          </View>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>Total Points Collected:</Text>

          <View style={styles.pointContainer}>

            <Image
              source={require('@/assets/images/1Point_Logo.png')}
              style={styles.pointAmounts}
            />
            <Text style={styles.pointText}>34,909</Text>

          </View>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>Last Transaction:</Text>
          <Text style={styles.transactionText}>July 7th, 2024</Text>

        </View>

      </View>
    );
  };

  // Render the home screen 
  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.container}>

        <View style={styles.header}>
          <Image
            source={require('@/assets/images/1Point_Logo.png')}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome {userData.firstName}</Text>
          </View>
        </View>

        <View style={styles.qrCode}>
          <QRCode
            value={userData.phoneNumber}
            size={150}
            color="black" />
        </View>


        <View>
          <Text style={styles.qrText}>{userData.phoneNumber}</Text>
        </View>

        <View>
          <Text style={styles.qrText} >Scan the QR code to earn/redeem points!</Text>
        </View>


      </View>



      <View style={styles.lower}>
        {renderPointsSection()}
      </View>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 71,
  },
  qrCode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 32,
    justifyContent: 'center',
    margin: 5,
    position: 'relative',
  },
  lower: {
    flex: 1,
    paddingTop: 200,
    borderRadius: 32,
    backgroundColor: '#ggg',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  qrText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  newSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 32,
    margin: 5,
    position: 'relative',
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointAmounts: {
    width: 46,
    height: 46,
    marginRight: 10,
  },
  newBrandLogo: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
    margin: 5,
  },
  newLabelContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'black',
    borderRadius: 32,
  },
  pointsSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    paddingBottom: 50,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 10,
    marginVertical: 24,
    minHeight: 75
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});