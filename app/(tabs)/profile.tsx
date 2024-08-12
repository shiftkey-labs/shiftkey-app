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
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import state from "../state";
import { roleSettingsOptions } from "@/config/roleSettingsOptions";

const Profile = () => {
  const user = state.user.userState.get();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      state.user.set(null);
      router.push("/(auth)/login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  if (!user) {
    return null;
  }

  const { accountSettings, moreOptions } =
    roleSettingsOptions[user.role] || roleSettingsOptions.STUDENT;

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <ScrollView style={tw`flex-1 bg-background p-5`}>
        <View style={tw`mb-5`}>
          <Text style={tw`text-2xl font-montserratBold`}>
            {user.name || "John Doe"}
          </Text>
          <Text style={tw`text-gray-600`}>
            {user.email || "johndoe@example.com"}
          </Text>
        </View>
        <View style={tw`bg-white p-5 rounded-lg shadow-sm mb-5`}>
          <Text style={tw`text-lg font-montserratBold mb-3`}>
            Account Settings
          </Text>
          {accountSettings.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center justify-between mb-3`}
              onPress={item.action}
            >
              <Text style={tw`text-text`}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={tw`bg-white p-5 rounded-lg shadow-sm`}>
          <Text style={tw`text-lg font-montserratBold mb-3`}>More Options</Text>
          {moreOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center justify-between mb-3`}
              onPress={item.action}
            >
              <Text style={tw`text-text`}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={tw`bg-red-600 p-4 rounded mb-3 mt-5`}
          onPress={handleLogout}
        >
          <Text style={tw`text-white text-center`}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`p-4 rounded mb-3`} onPress={handleLogout}>
          <Text style={tw`text-red-600 text-center`}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
