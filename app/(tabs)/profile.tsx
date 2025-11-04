// app/profile.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../styles/tailwind";
import { useRouter } from "expo-router";
import state from "@/state";
import { roleSettingsOptions } from "@/config/roleSettingsOptions";
import { deleteUserById } from "@/api/userApi";
import { useTheme } from "@/context/ThemeContext";
import Constants from "expo-constants";
import { clearAuthSession } from "@/state/authSession";
import server from "@/config/axios";
import { Alert } from "@/utils/alert";
type CrashlyticsModule = typeof import("@react-native-firebase/crashlytics");
let crashlyticsModule: CrashlyticsModule | null = null;
if (Platform.OS === "android" || Platform.OS === "ios") {
  try {
    crashlyticsModule = require("@react-native-firebase/crashlytics");
  } catch (error) {
    crashlyticsModule = null;
  }
}

const Profile = () => {
  const user = state.user.userState.get();
  const router = useRouter();
  const { isDarkMode, colors, themePreference, setManualTheme } = useTheme();
  const appVersion = Constants.expoConfig?.version ?? "";
  const isDarkModeEnabled = themePreference === "dark";
  const crashlyticsInstance = useMemo(() => {
    return crashlyticsModule?.getCrashlytics() ?? null;
  }, []);

  const handleThemeToggle = (value: boolean) => {
    setManualTheme(value);
  };

  const handleLogout = async () => {
    try {
      await server.post("/auth/logout");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to contact the server. Logging out locally.";
      console.error("Logout request failed:", error);
      Alert.alert("Logout Error", message);
    } finally {
      await clearAuthSession();
      router.replace("/(auth)/login");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await server.post("/user/delete-account");
              await clearAuthSession();
              router.replace("/(auth)/login");
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Failed to delete account. Please try again.";
              console.error("Delete account failed:", error);
              Alert.alert("Error", message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return null;
  }

  const { supportOptions, accountOptions, legalOptions } =
    roleSettingsOptions[user.role as keyof typeof roleSettingsOptions] || roleSettingsOptions.STUDENT;

  const devCrashOption =
    __DEV__ && crashlyticsInstance
      ? [
          {
            label: "Trigger Crashlytics Test Crash",
            action: () => {
              if (crashlyticsModule) {
                crashlyticsModule.crash(crashlyticsInstance);
              }
            },
          },
        ]
      : [];
  const combinedSupportOptions = [...supportOptions, ...devCrashOption];

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView style={[tw`flex-1 p-5`, { backgroundColor: colors.background }]}>
        <View style={tw`mb-3`}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>
            {user.firstName || "John"} {user.lastName || "Doe"}
          </Text>
          <Text style={{ color: colors.gray }}>
            {user.email || "johndoe@example.com"}
          </Text>
        </View>
        <View style={[tw`px-5 pt-3 pb-2 rounded-lg shadow-sm mb-3`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            General
          </Text>
          {combinedSupportOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center justify-between`, { paddingVertical: 8 }]}
              onPress={item.action}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[tw`px-5 pt-3 pb-2 rounded-lg shadow-sm mb-3`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            App Settings
          </Text>
          <View style={[tw`flex-row items-center justify-between`, { paddingVertical: 8 }]}>
            <Text style={{ color: colors.text, fontSize: 16 }}>Enable dark mode</Text>
            <Switch
              value={isDarkModeEnabled}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.gray, true: colors.primary }}
              thumbColor={isDarkModeEnabled ? colors.white : colors.lightGray}
              ios_backgroundColor={colors.gray}
            />
          </View>
        </View>
        <View style={[tw`px-5 pt-3 pb-2 rounded-lg shadow-sm mb-3`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            Account
          </Text>
          {accountOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center justify-between`, { paddingVertical: 8 }]}
              onPress={item.action}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[tw`flex-row items-center justify-between`, { paddingVertical: 8 }]}
            onPress={handleLogout}
          >
            <Text style={{ color: colors.text, fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[tw`flex-row items-center justify-between`, { paddingVertical: 8 }]}
            onPress={handleDeleteAccount}
          >
            <Text style={{ color: colors.error, fontSize: 16 }}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        <View style={[tw`px-5 pt-3 pb-2 rounded-lg shadow-sm mb-3`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            Legal
          </Text>
          {legalOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center justify-between`, { paddingVertical: 8 }]}
              onPress={item.action}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {appVersion ? (
          <Text
            style={{
              color: colors.gray,
              textAlign: "center",
              marginTop: 12,
              marginBottom: 20,
            }}
          >
            Version {appVersion}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
