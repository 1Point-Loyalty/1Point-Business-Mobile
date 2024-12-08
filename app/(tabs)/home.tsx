import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import PagerView from 'react-native-pager-view';

export default function HomeScreen() {

  // Array of elements to display
  const sliderElements = [
    {
      key: '1',
      imageUri: 'https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg',
      text: 'Welcome to 1Point, Shawerma Plus!',
    },
    {
      key: '2',
      imageUri: 'https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg',
      text: 'Your last payment of $12.50 was received!',
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);  // Track the current page
  const pagerRef = useRef<PagerView>(null); // Reference to the pager view
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
      // Use the PagerView component to display the elements 
      <PagerView
        style={styles.sliderContainer}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>

        {sliderElements.map(element => (
          <View style={[styles.sliderSection, styles.shadowProp]} key={element.key}>
            {element.imageUri ? (
              <Image source={{ uri: element.imageUri }} style={styles.sliderLogoContainer} />
            ) : null}
            {element.imageUri ? (
              <View style={styles.newLabelContainer}>
                <Text style={styles.newLabel}>NEW</Text>
              </View>
            ) : null}
            <Text style={styles.newText}>{element.text}</Text>
          </View>
        ))}

      </PagerView>
    );
  };


  // Render the dots to indicate the current page
  const renderPageDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {sliderElements.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };


  // Render the points section
  const renderPointsSection = () => {
    return (
      <View style={styles.pointsSection}>
      <View>
      <View style={[styles.row, styles.shadowProp]}>
      <Text style={styles.subHeading2Text}>Points Collected</Text>
          <View style={styles.pointContainer}>
            <Image
              source={require('@/assets/images/1Point_Logo.png')}
              style={styles.pointAmounts}
            />
            <Text style={styles.pointText}>1978</Text>
          </View>
          <View style={styles.backLabelContainerUp}>
                <Text style={styles.backLabel}>+48% - Last Month</Text>
              </View>
        </View>

        <View style={[styles.row, styles.shadowProp]}>
        <Text style={styles.subHeading2Text}>Average Revenue</Text>
          <View style={styles.pointContainer}>
            <Text style={styles.pointText}>$48.69</Text>
          </View>
          <View style={styles.backLabelContainerUp}>
                <Text style={styles.backLabel}>+107% - Last Month</Text>
              </View>
        </View>
        </View>


        <View>
        <View style={[styles.row, styles.shadowProp]}>
        <Text style={styles.subHeading2Text}>Points Issued</Text>
          <View style={styles.pointContainer}>
            <Image
              source={require('@/assets/images/1Point_Logo.png')}
              style={styles.pointAmounts}
            />
            <Text style={styles.pointText}>2256</Text>
          </View>
          <View style={styles.backLabelContainerUp}>
                <Text style={styles.backLabel}>+26% - Last Month</Text>
              </View>
        </View>

        <View style={[styles.row, styles.shadowProp]}>
        <Text style={styles.subHeading2Text}>Net # Customers</Text>
          <View style={styles.pointContainer}>
            <Text style={styles.pointText}>340</Text>
          </View>

          <View style={styles.backLabelContainerDown}>
                <Text style={styles.backLabelWhite}>-12% - Last Month</Text>
              </View>
        </View>
        </View>
        

      </View>
    );
  };

  // Render the home screen 
  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.mainContainer}>

        <View style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/1Point_Logo.png')}
            style={styles.headerImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome John!</Text>
          </View>
        </View>

        <Text style={styles.subHeadingText}>LATEST UPDATES</Text>

        {renderSlider()}

        <Text style={styles.subHeadingText}>SUMMARY AND INSIGHTS</Text>


      <View>
        {renderPointsSection()}
      </View>

      </View>

      

    </SafeAreaView >
  );
};


const styles = StyleSheet.create({
  //-------------- Main App styling -----------------
  main: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#F1F1F1',
  },
  mainContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F1F1F1',
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
    backgroundColor: '#000',
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
    backgroundColor: '#f1f1f1',
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
    backgroundColor: '#F1F1F1',
    padding: "1%",
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  pointAmounts: {
    width: 46,
    height: 46,
  },

  row: {
    justifyContent: 'space-evenly',
    backgroundColor: '#ffffff',
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
    color: 'black',
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