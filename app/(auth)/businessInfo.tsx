import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, useColorScheme, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import PagerThemedView from 'react-native-pager-view';
import { DarkTheme } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';
import { useTheme } from '@/constants/ThemeCheck';
import { TransactionRow } from '@/components/ReuseableComponents/TransactionRow';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Profile() {
  

  const theme = useTheme();



    
    const renderInviteSection = () => {
      return (
        <ThemedView style={[styles.realContainer, {backgroundColor: theme.colors.background}]}>
        <TextInput
         placeholder="Business Name"
         style={styles.input}
        />
        <TextInput
        placeholder="Business Address"
        style={styles.input}
       />
       <TextInput
        placeholder="Business About"
        style={styles.input}
       />
       <TextInput
        placeholder="Busines Hours"
        style={styles.input}
       />
       <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.headerText2}>Upload Your Logo</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.image2}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Upload+</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity
        accessibilityLabel="Submit"
        style={styles.logoutButton}
        onPress={() => router.navigate("/home")}
      >
        <Text style={styles.logoutText}>Submit</Text>
      </TouchableOpacity>
       </ThemedView>
       
      );
    };


  
  const renderProfileSection = () => {
    return (
      <ThemedView style={{ backgroundColor: theme.colors.background}}>
        
      </ThemedView>
    );
  };

  
  return (
    <SafeAreaView style={[styles.main, {backgroundColor: theme.colors.card}]}>
      <ThemedView style={[styles.realContainer, {backgroundColor: theme.colors.card}]}>
      <ThemedView style={[styles.headerContainer, {backgroundColor: theme.colors.card}]}>
          <Image
            source={require('@/assets/images/1Point_Logo.png')}
            style={styles.headerImage}
          />
          <ThemedView style={[styles.headerText, {backgroundColor: theme.colors.card}]}>
            <ThemedText style={[styles.welcomeText]}>BUSINESS INFO</ThemedText>
          </ThemedView>
        </ThemedView>
      
        <ThemedView style={[styles.mainContainer, {backgroundColor: theme.colors.background}]} >
          {renderInviteSection()}

         
         
      </ThemedView>
          </ThemedView>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  //-------------- Main App styling -----------------
  main: {
    flex: 1,
    paddingTop: 15,
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    paddingTop: 20,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
  },
  realContainer: {
    flex: 1,
    paddingTop: 40,
  },
  
  //-------------- Header styling -----------------
  
  headerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 71,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 5,
  },

  subHeadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
    fontVariant: ['small-caps'],
    padding: 10,
  },

  subHeading2Text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
    fontVariant: ['small-caps'],
  },

  //-------------- Slider styling -----------------

  sliderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 26,
    margin: 5,
    position: 'relative',
    height: 150,
  },
  
  sliderLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },

  sliderContainer: {
    flex: 0.9,
    maxHeight: 200,
  },

  //-------------- Back styling -----------------

  backLabelContainerUp: {
    backgroundColor: '#4BB543',
    borderRadius: 26,
  },

  backLabelContainerDown: {
    backgroundColor: '#ff4545',
    borderRadius: 26,
  },

  backLabel: {
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
  },

  backLabelWhite: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
  },


//-------------- Transaction Preview Section styling -----------------

  transactionSection: {
    padding: "1%",
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  pointAmounts: {
    width: 46,
    height: 46,
  },

  row: {
    justifyContent: 'space-evenly',
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: "5%",
    marginBottom: 10,
    marginVertical: "5%",
    minHeight: 150,
    minWidth: '30%',
  },

  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionPreviewText: {
    fontSize: 30,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
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

  cardWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  blackCard: {
    backgroundColor: '#1E1E1E',
    width: width * 0.8,
    height: 150,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeOverlay: {
    backgroundColor: '#E95F23',
    width: width * 0.9,
    height: 70,
    borderRadius: 12,
    position: 'absolute',
    top: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8, 
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  iconImage: {
    width: 40, 
    height: 40,
    marginRight: 8, 
  },
  primaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    marginLeft: -3,
  },
  arrowIcon: {
    backgroundColor: '#E95F23',
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  arrowText: {
    color: '#fff',
    fontSize: 35,
    fontWeight: '500',
    marginTop: -10,
  },
  image: {
    width: '130%',
    height: '130%',
    marginTop: -30, 
    marginLeft: -75, 
  },
  logoutButton: {
    backgroundColor: '#E95F23',
    padding: 15,
    margin: 20,
    marginTop: 25,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 17,
    color: '#000',
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#a1a09c',
    padding: 10,
    borderRadius: 5,
   marginLeft: 10
},
container: {
  width: '95%',
  height: 300,
  //flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: '#fff',
  marginLeft: 10,
  borderColor: '#fff'
},
button: {
  width: 175,
  height:40,
  backgroundColor: '#007bff',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
},
buttonText: {
  color: '#fff',
  fontSize: 18,
  marginTop: -3
},
image2: {
  width: 150,
  height: 150,
  marginBottom: 20,
  borderRadius: 75, 
  borderWidth: 1,
  borderColor: '#ddd',
  backgroundColor: '#f0f0f0',
},
headerText2: {
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 20,
},

  
});