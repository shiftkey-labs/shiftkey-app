// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { ActivityIndicator, Platform, View, useColorScheme as useNativeColorScheme } from "react-native";
import tw from "./styles/tailwind";
import { observer } from "@legendapp/state/react";
import { initializeAuth } from "@/state/userState";
import state from "@/state";
import Toast from "react-native-toast-message";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AlertProvider } from "@/context/AlertContext";
import UpdateBanner from "@/components/common/UpdateBanner";
import { setNavigateToLogin } from "@/config/axios";

let crashlyticsModule: typeof import("@react-native-firebase/crashlytics") | null = null;
if (Platform.OS === "android" || Platform.OS === "ios") {
  try {
    crashlyticsModule = require("@react-native-firebase/crashlytics");
  } catch (error) {
    crashlyticsModule = null;
  }
}

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

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const instance = crashlyticsModule?.getCrashlytics();
      if (instance) {
        void crashlyticsModule.setCrashlyticsCollectionEnabled(instance, true);
      }
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      const initialize = async () => {
        try {
          await initializeAuth();
        } finally {
          setIsInitializing(false);
          SplashScreen.hideAsync();
        }
      };
      initialize();
    }
  }, [loaded]);

  useEffect(() => {
    if (isInitializing) return; // Don't navigate while initializing

    if (!user.email) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, isInitializing]);

  // Show loading screen while fonts are loading or while initializing
  if (!loaded || isInitializing) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white dark:bg-black`}>
        <ActivityIndicator size="large" color={systemColorScheme === 'dark' ? '#ffffff' : '#0000ff'} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </ThemeProvider>
  );
});

const AppContent = observer(() => {
  const { isDarkMode, colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const appStatus = state.app.appState.get();
  const showUpdateBanner =
    appStatus.updateAvailable &&
    !appStatus.updateRequired &&
    !appStatus.optionalUpdateDismissed;

  useEffect(() => {
    state.app.checkAppVersion();
  }, []);

  // Register navigation callback for 401 errors
  useEffect(() => {
    setNavigateToLogin(() => {
      router.replace("/(auth)/login");
    });
  }, [router]);

  useEffect(() => {
    if (appStatus.updateRequired) {
      router.replace("/update-required");
    }
  }, [appStatus.updateRequired]);

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
        {showUpdateBanner ? (
          <UpdateBanner
            latestVersion={appStatus.latestVersion}
            onDismiss={state.app.dismissOptionalUpdate}
          />
        ) : null}
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
            name="(settings)"
            options={{ headerShown: false, gestureEnabled: true }}
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
          <Stack.Screen
            name="feedback"
            options={{
              presentation: "modal",
              title: "Share Feedback"
            }}
          />
          <Stack.Screen
            name="update-required"
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack>
      </View>
    </NavigationThemeProvider>
  );
});

export default RootLayoutNav;
