import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 27,
          left: 16,
          right: 16,
          height: 60,
          elevation: 0,
          backgroundColor: 'white',
          borderRadius: 50,
          alignItems: "center",
          justifyContent: 'center',
        },
      }}>
       <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{alignItems: 'center'}}>
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color="black" size={30}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{alignItems: 'center'}}>
              <TabBarIcon name={focused ? 'book' : 'book-outline'} color="black" size={30}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="QRScan"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 66,
              width: 66,
              borderRadius: 999,
              backgroundColor: '#E95F23',
              marginTop: 30,
            }}>
              <TabBarIcon name={focused ? 'qr-code' : 'qr-code-outline'} color="white" size={36} style={{marginBottom: 0}}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{alignItems: 'center'}}>
              <TabBarIcon name={focused ? 'list' : 'list-outline'} color="black" size={30}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{alignItems: 'center'}}>
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color="black" size={30}/>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
