import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, useColorScheme } from 'react-native';
import PagerThemedView from 'react-native-pager-view';
import { useTheme } from '@/constants/ThemeCheck';

export default function HomeScreen() {

  const theme = useTheme();

  // Array of elements to display
  const sliderElements = [
    {
      key: '1',
      imageUri: 'https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg',
      ThemedText: 'Welcome to 1Point, Shawerma Plus!',
    },
    {
      key: '2',
      imageUri: 'https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg',
      ThemedText: 'Your last payment of $12.50 was received!',
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);  // Track the current page
  const pagerRef = useRef<PagerThemedView>(null); // Reference to the pager ThemedView
  const totalElements = sliderElements.length; // Total number of elements

  // Auto-scroll every 4 seconds to the next page in the list of elemtents 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(prevElement => {
        // Calculate the next page to display 
        const nextElement = (prevElement + 1) % totalElements;
        // If the pagerRef is available, set the page to the next page
        if (pagerRef.current) {
          pagerRef.current.setPage(nextElement);
        }
        // Return the next page
        return nextElement;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Render the NEW section elements
  const renderSlider = () => {
    return (
      // Use the PagerThemedView component to display the elements 
      <PagerThemedView
        style={[styles.sliderContainer, {backgroundColor: theme.colors.background}]}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>

        {sliderElements.map(element => (
          <ThemedView style={[styles.sliderSection, styles.shadowProp, {backgroundColor: theme.colors.card}]} key={element.key}>
            {element.imageUri ? (
              <Image source={{ uri: element.imageUri }} style={styles.sliderLogoContainer} />
            ) : null}
            {element.imageUri ? (
              <ThemedView style={styles.newLabelContainer}>
                <ThemedText style={styles.newLabel}>NEW</ThemedText>
              </ThemedView>
            ) : null}
            <ThemedText style={[styles.newText, {color: theme.colors.text}]}>{element.ThemedText}</ThemedText>
          </ThemedView>
        ))}

      </PagerThemedView>
    );
  };


  // Render the dots to indicate the current page
  const renderPageDots = () => {
    return (
      <ThemedView style={styles.dotsContainer}>
        {sliderElements.map((_, index) => (
          <ThemedView
            key={index}
            style={[
              styles.dot,
              currentPage === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </ThemedView>
    );
  };


  // Render the points section
  const renderPointsSection = () => {
    return (
      <ThemedView style={[styles.pointsSection, {backgroundColor: theme.colors.background}]}>
      <ThemedView style={{backgroundColor: theme.colors.background}}>
        <ThemedView style={[styles.row, styles.shadowProp, {backgroundColor: theme.colors.card}]}>
        <ThemedText style={styles.subHeading2Text}>Points Collected</ThemedText>
            <ThemedView style={[styles.pointContainer, {backgroundColor: theme.colors.card}]}>
              <Image
                source={require('@/assets/images/1Point_Logo.png')}
                style={styles.pointAmounts}
              />
              <ThemedText style={[styles.pointText, {color: theme.colors.text}]}>1978</ThemedText>
            </ThemedView>
            <ThemedView style={styles.backLabelContainerUp}>
                  <ThemedText style={styles.backLabel}>+48% - Last Month</ThemedText>
                </ThemedView>
          </ThemedView>

          <ThemedView style={[styles.row, styles.shadowProp, {backgroundColor: theme.colors.card}]}>
          <ThemedText style={styles.subHeading2Text}>Average Revenue</ThemedText>
            <ThemedView style={[styles.pointContainer, {backgroundColor: theme.colors.card}]}>
              <ThemedText style={[styles.pointText, {color: theme.colors.text}]}>$48.69</ThemedText>
            </ThemedView>
            <ThemedView style={styles.backLabelContainerUp}>
                  <ThemedText style={styles.backLabel}>+107% - Last Month</ThemedText>
                </ThemedView>
          </ThemedView>
        </ThemedView>


        <ThemedView style={{backgroundColor: theme.colors.background}}>
        <ThemedView style={[styles.row, styles.shadowProp, {backgroundColor: theme.colors.card}]}>
        <ThemedText style={styles.subHeading2Text}>Points Issued</ThemedText>
          <ThemedView style={[styles.pointContainer, {backgroundColor: theme.colors.card}]}>
            <Image
              source={require('@/assets/images/1Point_Logo.png')}
              style={styles.pointAmounts}
            />
            <ThemedText style={[styles.pointText, {color: theme.colors.text}]}>2256</ThemedText>
          </ThemedView>
          <ThemedView style={styles.backLabelContainerUp}>
                <ThemedText style={styles.backLabel}>+26% - Last Month</ThemedText>
              </ThemedView>
        </ThemedView>

        <ThemedView style={[styles.row, styles.shadowProp, {backgroundColor: theme.colors.card}]}>
        <ThemedText style={styles.subHeading2Text}>Net # Customers</ThemedText>
          <ThemedView style={[styles.pointContainer, {backgroundColor: theme.colors.card}]}>
            <ThemedText style={[styles.pointText, {color: theme.colors.text}]}>340</ThemedText>
          </ThemedView>

          <ThemedView style={styles.backLabelContainerDown}>
                <ThemedText style={styles.backLabelWhite}>-12% - Last Month</ThemedText>
              </ThemedView>
        </ThemedView>
        </ThemedView>
        

      </ThemedView>
    );
  };

  // Render the home screen 
  return (
    <SafeAreaView style={[styles.main, {backgroundColor: theme.colors.card}]}>

<ThemedView style={[styles.realContainer, {backgroundColor: theme.colors.card}]}>
      <ThemedView style={[styles.headerContainer, {backgroundColor: theme.colors.card}]}>
          <Image
            source={require('@/assets/images/1Point_Logo.png')}
            style={styles.headerImage}
          />
          <ThemedView style={[styles.headerText, {backgroundColor: theme.colors.card}]}>
            <ThemedText style={[styles.welcomeText]}>WELCOME JOHN</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={[styles.mainContainer, {backgroundColor: theme.colors.background}]}>

        <ThemedText style={[styles.subHeadingText, {backgroundColor: theme.colors.background}]}>LATEST UPDATES</ThemedText>

        {renderSlider()}

        <ThemedText style={[styles.subHeadingText, {backgroundColor: theme.colors.background}]}>SUMMARY AND INSIGHTS</ThemedText>


      <ThemedView>
        {renderPointsSection()}
      </ThemedView>

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

  //-------------- New Icon styling -----------------

  newLabelContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 26,
  },

  backLabelContainerUp: {
    backgroundColor: '#4BB543',
    borderRadius: 26,
  },

  backLabelContainerDown: {
    backgroundColor: '#ff4545',
    borderRadius: 26,
  },

  newLabel: {
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
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

  newText: {
    fontSize: 20,
    marginLeft: 10,
    flexShrink: 1,
    color: 'white',
  },

//-------------- Point Section styling -----------------

  pointsSection: {
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

  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointText: {
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
  

//-------------- Dots styling -----------------

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'black',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
});