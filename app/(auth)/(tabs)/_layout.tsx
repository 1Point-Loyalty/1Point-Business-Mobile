import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
const theme = useTheme();

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
          elevation: 2,
          backgroundColor: theme.colors.card,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
        },
      }}>
       <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View>
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={theme.colors.text} size={30}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View>
              <TabBarIcon name={focused ? 'book' : 'book-outline'} color={theme.colors.text} size={30}/>
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
            <View>
              <TabBarIcon name={focused ? 'list' : 'list-outline'} color={theme.colors.text} size={30}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View>
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={theme.colors.text} size={30}/>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
