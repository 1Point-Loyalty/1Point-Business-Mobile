import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="editpromotion" options={{ headerShown: false, title: 'lol', headerTitle: 'Edit Promotion',  }} />
        <Stack.Screen name="awardpoints" options={{ headerShown: false, title: 'lol', headerTitle: 'Award Points',  }} />
        <Stack.Screen name="createpromotion" options={{ headerShown: false, title: 'lol', headerTitle: 'Create Promotion',  }} />
        <Stack.Screen name="redeempoints" options={{ headerShown: false, title: 'lol', headerTitle: 'Redeem Points',  }} />
      </Stack>
    </ThemeProvider>
  );
}
