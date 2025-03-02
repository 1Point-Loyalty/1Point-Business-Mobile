import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "expo-router";

export default function SettlementReports() {
    const navigation = useNavigation();
    navigation.setOptions({ headerShown: false });

    const months = () => {
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        return allMonths.slice(0, currentMonth);
    };

    const month = months().map(month => ({
        month,
        amount: "100.25",
    }));

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
                    {month.map((item: { month: string; amount: string }, index: number) => (
                        <TouchableOpacity key={index} style={styles.monthCard}
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
        marginLeft: 2,
        marginBottom: 20,
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
        justifyContent: 'space-between',
    },
    monthCard: {
        width: '30%',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#D8D8D8',
        alignItems: 'center',
        marginBottom: 10,
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
