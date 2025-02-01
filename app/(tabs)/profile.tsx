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
        pronouns: "",
        isStudent: "",
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
      AsyncStorage.removeItem("user");
      router.push("/(auth)/login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (user.id) {
        await deleteUserById(user.id);
      }

      state.user.userState.set({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        pronouns: "",
        isStudent: "",
        currentDegree: "",
        faculty: "",
        school: "",
        hours: 0,
        university: "",
        program: "",
        year: "",
        isInternational: false,
        role: "STUDENT"
      });


      await AsyncStorage.removeItem("user");
      router.push("/(auth)/login");

    } catch (error) {
      Alert.alert("Delete Account Error", error.message);
    }
  };
  console.log(user.id)
  console.log("user", user);

  if (!user) {
    return null;
  }

  const { accountSettings, moreOptions } =
    roleSettingsOptions[user.role as keyof typeof roleSettingsOptions] || roleSettingsOptions.STUDENT;

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView style={[tw`flex-1 p-5`, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Links here are dummy, will be replaced with actual settings
        </Text>
        <View style={tw`mb-5`}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>
            {user.firstName || "John"} {user.lastName || "Doe"}
          </Text>
          <Text style={{ color: colors.gray }}>
            {user.email || "johndoe@example.com"}
          </Text>
        </View>
        <View style={[tw`p-5 rounded-lg shadow-sm mb-5`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Account Settings
          </Text>
          {accountSettings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center justify-between mb-3`}
              onPress={item.action}
            >
              <Text style={{ color: colors.text }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[tw`p-5 rounded-lg shadow-sm`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            More Options
          </Text>
          {moreOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center justify-between mb-3`}
              onPress={item.action}
            >
              <Text style={{ color: colors.text }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[tw`p-4 rounded mb-3 mt-5`, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <Text style={{ color: colors.white, textAlign: 'center' }}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`p-4 rounded mb-3`}
          onPress={handleDeleteAccount}
        >
          <Text style={{ color: colors.error, textAlign: 'center' }}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
