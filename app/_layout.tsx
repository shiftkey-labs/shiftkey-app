// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ActivityIndicator, View, useColorScheme as useNativeColorScheme } from "react-native";
import tw from "./styles/tailwind";
import { observer } from "@legendapp/state/react";
import { initializeEvents } from "./state/eventState";
import { initializeAuth, hasRequiredFields } from "./state/userState";
import state from "./state";
import Toast from "react-native-toast-message";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = observer(() => {
  const systemColorScheme = useNativeColorScheme();
  const router = useRouter();
  const user = state.user.userState.get();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } finally {
        setIsInitializing(false);
        SplashScreen.hideAsync();
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (isInitializing) return; // Don't navigate while initializing

    if (!user.email) {
      console.log("user", user.email);
      router.replace("/(auth)/login");
    } else if (!hasRequiredFields(user)) {
      console.log("user", user);
      router.replace("/(auth)/signup");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, isInitializing]);

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-background dark:bg-dark-background`}>
        <ActivityIndicator size="large" color={systemColorScheme === 'dark' ? '#ffffff' : '#0000ff'} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
});

const AppContent = () => {
  const { isDarkMode, colors } = useTheme();
  const navigationTheme = isDarkMode ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      text: colors.text,
      border: colors.lightGray,
      card: colors.lightGray,
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      text: colors.text,
      border: colors.lightGray,
      card: colors.white,
    },
  };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <View style={tw`flex-1 bg-background dark:bg-dark-background`}>
        <Toast />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDarkMode ? colors.lightGray : colors.white,
            },
            headerTintColor: colors.text,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="event"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="volunteer"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
      </View>
    </NavigationThemeProvider>
  );
};

export default RootLayoutNav;
