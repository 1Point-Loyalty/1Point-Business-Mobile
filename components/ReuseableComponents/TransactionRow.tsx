import { useTheme } from "@/constants/ThemeCheck";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Image, StyleSheet } from 'react-native';

export const TransactionRow = ({ transactionAmount, transactionLocation, transactionDate, transactionCustomerId, transactionStatus }: { transactionAmount: number, transactionLocation: string, transactionDate: string, transactionCustomerId: string, transactionStatus: string }) => {
    const theme = useTheme();
    
    const displayStatus = () => {
        if (transactionStatus === "Complete") {
            return (
                "green"
            );
        } else {
            return (
               "red"
            );
        }
    }
    
    return (
            
    <ThemedView style={{backgroundColor: theme.colors.background}}>
        <ThemedView style={[styles.sliderSection, styles.shadowProp, {backgroundColor: theme.colors.card}]}>
            <ThemedView style={{backgroundColor: theme.colors.card}}>
                <Image
                    source={require('@/assets/images/1Point_Logo.png')}
                    style={styles.imageContainer}
                />
            </ThemedView>
            <ThemedView style={styles.contentContainerWhole}>
                <ThemedView style={{paddingVertical: 5}}>
                    <ThemedText style={styles.customerContainer}>
                        {'Customer ID: ' + transactionCustomerId}
                    </ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.contentContainer}>
                    <ThemedText style={[styles.labelContainer]}>
                        {'Amount: ' + transactionAmount}
                    </ThemedText>
                    <ThemedText style={[styles.labelContainer]}>
                        {'Date: ' + transactionDate}
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.contentContainer}>
                    <ThemedText style={[styles.labelContainer]}>
                        {transactionLocation}
                    </ThemedText>
                    <ThemedText style={[styles.labelContainer, {color: displayStatus()}]}>
                        {transactionStatus}
                    </ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    </ThemedView>
          
    );
}

const styles = StyleSheet.create({

//-------------- Transaction Section styling -----------------

sliderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 26,
    margin: 5,
    position: 'relative',
    minHeight: 100,
 },

shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

imageContainer: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
}
,
//-------------- Content Section styling -----------------

contentContainerWhole: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '70%',
    padding: 5,
},

contentContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    width: '50%',
},

customerContainer: {
    backgroundColor: '#FF8D4D',
    color: 'white',
    textAlign: 'center',
    borderRadius: 26,
    fontSize: 11,
    width: '100%'
  },

  labelContainer: {
    backgroundColor: 'lightgrey',
    color: 'black',
    textAlign: 'center',
    borderRadius: 26,
    fontSize: 11,
    width: '100%'
  },

});