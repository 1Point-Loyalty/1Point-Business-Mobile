import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "expo-router";
import auth from '@react-native-firebase/auth';

export default function SettlementReports() {
    const navigation = useNavigation();
    navigation.setOptions({ headerShown: false });

    const [monthsData, setMonthsData] = useState<{ month: string; amount: string }[]>([]);

    interface Invoice {
        invoiceDate: string;
        totalAmount: string;
        invoiceID: string;
    }

    const fetchInvoices = async () => {
        try {
            const currentUser = auth().currentUser;
            if (!currentUser) {
                console.error("User not authenticated");
                return;
            }
            const userId = currentUser.uid;
            //const token = await currentUser.getIdToken();
            const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJjNDAxN2U3MGE4MWM5NTMxY2YxYjY4MjY4M2Q5OThlNGY1NTg5MTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcG9pbnQtYWRtaW4iLCJhdWQiOiJwb2ludC1hZG1pbiIsImF1dGhfdGltZSI6MTc0MTQzMjg3OSwidXNlcl9pZCI6Im81dDlxVXBxSGlnTk5mVXpycDdOaDAxd2l6NzIiLCJzdWIiOiJvNXQ5cVVwcUhpZ05OZlV6cnA3TmgwMXdpejcyIiwiaWF0IjoxNzQxNDMyODc5LCJleHAiOjE3NDE0MzY0NzksImVtYWlsIjoiYXNodmluZ3Jld2FsMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYXNodmluZ3Jld2FsMDJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.bCZQxjDB_tkR4Sm9hnBp9QD_mEAqKkQjODZeZInaRzmoLzKcTGiezRy6AGLdwVf3daG8piG4uelrvyhQRKzlphY3ZmckHPTmxSCmsNIUJhL4IpYXwgbnqV9kiT60YKeCkx4_KdykryXgQFX0sr1VjWz5HNWXnd9M7tk-WKwvV1oDJa4NAljBt_VbJcuBftYPe70PWjt3gf5J3Du6_VH3qAX__PrvTOQUMrxSiXKYWVvo79OZaiHjnGgTsPCmtjSFDlRfUuxgCHQTCOZw_uRTJHWAxvS6Nr2OraBUGHnPIdUVxWA7bSdeKe8Kv0P9a-XfAPCTko5BepWuzWXXLurR4Q"

            const apiURL = `https://admin.1-point.ca/api/getInvoices/${userId}`;
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

            const invoices = await response.json();
            processInvoices(invoices);

        } catch (error) {
            console.error("Error Fetching Invoices:", error);
        } finally {

        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const processInvoices = (invoices: Invoice[]) => {
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonthIndex = new Date().getMonth();
        const data = allMonths.slice(0, currentMonthIndex).map(month => ({
            month,
            amount: "0.00",
        }));

        invoices.forEach((invoice) => {
            const dateParts = invoice.invoiceDate.split(' ');
            const monthStr = dateParts[0];
            const monthIndex = allMonths.indexOf(monthStr) - 1;

            if (monthIndex >= 0 && monthIndex < currentMonthIndex) {
                const invoiceAmount = parseFloat(invoice.totalAmount).toFixed(2);
                data[monthIndex].amount = invoiceAmount;
            } else {
                console.error(`Error: Invoice date ${invoice.invoiceDate} is invalid or in the future.`)
            }
        });
        setMonthsData(data);
    };

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back-outline" size={24} color="#000" />
                        <Text style={styles.backButtonText}>
                            Back
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.primarySubHeader}>
                    <Text style={styles.subHeaderPrimaryText}>
                        Settlement Reports
                    </Text>
                </View>
                <View style={styles.secondarySubHeader}>
                    <Text style={styles.subHeaderSecondaryText}>
                        Tap a month to download/view your settlement report
                    </Text>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.yearContainer}>
                    <Text style={styles.yearText}>
                        2025
                    </Text>
                </View>
                <TouchableOpacity style={styles.selectAllButton}
                    onPress={() => { }}>
                    <Text style={styles.selectAllText}>
                        Select all
                    </Text>
                </TouchableOpacity>
                <View style={styles.monthsContainer}>
                    {monthsData.map((item, index) => (
                        <TouchableOpacity key={index}
                            style={[
                                styles.monthCard,
                                index % 3 === 0 ? styles.monthCardFirst : null,
                                (index + 1) % 3 === 0 ? styles.monthCardLast : null
                            ]}
                            onPress={() => { }}>
                            <Text style={styles.monthText}>
                                {item.month}
                            </Text>
                            <Text style={styles.amountText}>
                                ${item.amount}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    //-------------- Main App Styling -----------------

    main: {
        flex: 1,
        backgroundColor: '#fff',
    },

    //-------------- Header Styling -----------------

    headerContainer: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40,
    },
    backButton: {
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 20,
        fontWeight: 'bold',
    },

    //-------------- Sub-Header Styling -----------------

    primarySubHeader: {
        paddingHorizontal: 50,
        paddingTop: 15,
    },
    subHeaderPrimaryText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E95F23'
    },
    secondarySubHeader: {
        paddingHorizontal: 50,
        paddingTop: 15,
    },
    subHeaderSecondaryText: {
        fontSize: 18,
    },

    //-------------- Content Container Styling -----------------

    contentContainer: {
        margin: 25,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    yearContainer: {
        alignItems: 'center',
    },
    yearText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#E95F23',
        marginBottom: 10,
        textAlign: 'center',
    },
    selectAllButton: {
        paddingVertical: 12,
        marginLeft: 4,
        marginBottom: 16,
    },
    selectAllText: {
        color: '#808080',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },

    //-------------- Months Display Styling -----------------

    monthsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    monthCard: {
        width: '30%',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#D8D8D8',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 7,
        marginLeft: 7,
    },
    monthCardFirst: {
        marginLeft: 2,
    },
    monthCardLast: {
        marginRight: 0,
    },
    monthText: {
        color: '#E95F23',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    amountText: {
        fontSize: 16,
    }
});
