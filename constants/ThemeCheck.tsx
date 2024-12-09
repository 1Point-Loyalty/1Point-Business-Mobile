import { useColorScheme } from "react-native";
import { DarkTheme } from "@react-navigation/native";
import { DefaultTheme } from "@react-navigation/native";

const lightTheme = {
    ...DefaultTheme
};

const darkTheme = {
    ...DarkTheme
};

export const useTheme = () => {
    const colorScheme = useColorScheme();
    return colorScheme === 'dark' ? darkTheme : lightTheme;
};