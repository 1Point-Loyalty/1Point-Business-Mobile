import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, useColorScheme, ScrollView } from 'react-native';
import PagerThemedView from 'react-native-pager-view';
import { DarkTheme } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';
import { useTheme } from '@/constants/ThemeCheck';
import { PromotionRow } from '@/components/ReuseableComponents/PromotionRow';

export default function Promotions() {

  const theme = useTheme();

  const PromotionArray = [
    {
      PromotionAmount: 25,
      PromotionLocation: "Shawerma Plus",
      PromotionDate: "12/12/2021",
      PromotionImage: 'cake',
      PromotionStatus: "Active",
    },
    {
      PromotionAmount: 5,
      PromotionLocation: "Shawerma Plus",
      PromotionDate: "12/12/2021",
      PromotionImage: 'icecream',
      PromotionStatus: "Active",
    },
    {
      PromotionAmount: 15,
      PromotionLocation: "Shawerma Plus",
      PromotionDate: "12/12/2021",
      PromotionImage: 'cake',
      PromotionStatus: "Active",
    },
    {
      PromotionAmount: 10,
      PromotionLocation: "Shawerma Plus",
      PromotionDate: "12/12/2021",
      PromotionImage: 'cake',
      PromotionStatus: "Inactive",
    },
    {
      PromotionAmount: 20,
      PromotionLocation: "Shawerma Plus",
      PromotionDate: "12/12/2021",
      PromotionImage: 'icecream',
      PromotionStatus: "Inactive",
    },
  ]

    // Render the Promotions section
    const renderPromotionPreview = () => {
      return (
        <ThemedView style={[styles.PromotionSection, {backgroundColor: theme.colors.background}]}>
       
<ThemedView style={{ backgroundColor: theme.colors.background }}>
            <ThemedView style={[styles.row, styles.shadowProp, { backgroundColor: theme.colors.card }]}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/images/Promotion.png')}
                        style={styles.pointAmounts}
                    />
                </View>
            </ThemedView>
        </ThemedView>
          
  
        </ThemedView>
      );
    };

    const mapPromotions = () => {
      return (
        <ThemedView style={{backgroundColor: theme.colors.background}}>
          {PromotionArray.map((Promotion) => {
            return (
              <PromotionRow promotionAmount={Promotion.PromotionAmount} promotionLocation={Promotion.PromotionLocation} promotionEndDate={Promotion.PromotionDate} promotionImage={Promotion.PromotionImage} promotionStatus={Promotion.PromotionStatus} promotionStartDate={''}/>
            );
          })}
        </ThemedView>
      );
    }

  // Render the Promotions section
  const renderPromotions = () => {
    return (
      <ThemedView style={{paddingBottom: 120, backgroundColor: theme.colors.background}}>
       {mapPromotions()}
      </ThemedView>
    );
  };

  // Render the promotions screen 
  return (
    <SafeAreaView style={[styles.main, {backgroundColor: theme.colors.card}]}>
      <ThemedView style={[styles.realContainer, {backgroundColor: theme.colors.card}]}>
      <ThemedView style={[styles.headerContainer, {backgroundColor: theme.colors.card}]}>
          <Image
            source={require('@/assets/images/1Point_Logo.png')}
            style={styles.headerImage}
          />
          <ThemedView style={[styles.headerText, {backgroundColor: theme.colors.card}]}>
            <ThemedText style={[styles.welcomeText]}>PROMOTIONS</ThemedText>
          </ThemedView>
        </ThemedView>
      <ScrollView style={[styles.mainContainer, {backgroundColor: theme.colors.background}]}>
       
        <ThemedView>
          {renderPromotionPreview()}
          </ThemedView>

        <ThemedText style={styles.subHeadingText}>PROMOTION LIST</ThemedText>


      <ThemedView>
        {renderPromotions()}
      </ThemedView>
      

      </ScrollView>
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


//-------------- Promotion Preview Section styling -----------------

  PromotionSection: {
    padding: "1%",
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },



  PromotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  PromotionPreviewText: {
    fontSize: 30,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  PromotionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  PromotionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    margin: 10,
    borderRadius: 25,
    overflow: 'hidden',
    padding: 10,
  },
  shadowProp: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
  },
  imageContainer: {
      borderRadius: 15,
      overflow: 'hidden',
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: 325,
      alignSelf: 'center',
  },
  pointAmounts: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
  },
   
});