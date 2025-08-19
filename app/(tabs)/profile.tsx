// app/profile.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import tw from "../styles/tailwind";
import { useRouter } from "expo-router";
import state from "../state";
import { roleSettingsOptions } from "@/config/roleSettingsOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUserById } from "@/api/userApi";
import { useTheme } from "@/context/ThemeContext";

const Profile = () => {
  const user = state.user.userState.get();
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();

  const handleLogout = async () => {
    try {
      state.user.userState.set({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        pronouns: [],
        selfIdentification: [],
        isStudent: "",
        occupation: "",
        organization: [],
        currentDegree: "",
        faculty: "",
        school: "",
        hours: 0,
        university: "",
        program: "",
        year: "",
        isInternational: false,
        role: "STUDENT",
      });
      await AsyncStorage.removeItem("user");
      router.push("/(auth)/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Logout Error", errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
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
              if (user.id) {
                await deleteUserById(user.id);
              }

              state.user.userState.set({
                id: null,
                firstName: "",
                lastName: "",
                email: "",
                pronouns: [],
                selfIdentification: [],
                isStudent: "",
                occupation: "",
                organization: [],
                currentDegree: "",
                faculty: "",
                school: "",
                hours: 0,
                university: "",
                program: "",
                year: "",
                isInternational: false,
                role: "STUDENT",
              });

              await AsyncStorage.removeItem("user");
              router.push("/(auth)/login");
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred";
              Alert.alert("Delete Account Error", errorMessage);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  const { accountSettings, moreOptions } =
    roleSettingsOptions[user.role as keyof typeof roleSettingsOptions] ||
    roleSettingsOptions.STUDENT;

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[tw`flex-1 p-5`, { backgroundColor: colors.background }]}
      >
        <View style={tw`mb-6`}>
          <Text
            style={{ color: colors.text, fontSize: 28, fontWeight: "bold" }}
          >
            {user.firstName || "User"} {user.lastName || ""}
          </Text>
          <Text style={{ color: colors.gray, fontSize: 16, marginTop: 4 }}>
            {user.email || "user@example.com"}
          </Text>
          {user.role && (
            <Text
              style={{
                color: colors.primary,
                fontSize: 14,
                marginTop: 2,
                fontWeight: "500",
              }}
            >
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
            </Text>
          )}
        </View>

        <View
          style={[
            tw`p-5 rounded-lg shadow-sm mb-5`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Account Settings
          </Text>
          {accountSettings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                tw`flex-row items-center justify-between py-3`,
                index < accountSettings.length - 1 && tw`border-b`,
                { borderBottomColor: colors.gray + "20" },
              ]}
              onPress={item.action}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>
                {item.label}
              </Text>
              <Text style={{ color: colors.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            tw`p-5 rounded-lg shadow-sm mb-5`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            More Options
          </Text>
          {moreOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                tw`flex-row items-center justify-between py-3`,
                index < moreOptions.length - 1 && tw`border-b`,
                { borderBottomColor: colors.gray + "20" },
              ]}
              onPress={item.action}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>
                {item.label}
              </Text>
              <Text style={{ color: colors.gray }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[tw`p-4 rounded-lg mb-4`, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <Text
            style={{
              color: colors.white,
              textAlign: "center",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`p-4 rounded-lg mb-6`,
            {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: colors.error,
            },
          ]}
          onPress={handleDeleteAccount}
        >
          <Text
            style={{
              color: colors.error,
              textAlign: "center",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
