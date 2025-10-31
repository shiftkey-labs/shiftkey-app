import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../styles/tailwind";
import { useRouter } from "expo-router";
import state from "@/state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";

type EditProfileFormProps = {
  onSubmitSuccess?: () => void;
  showHeading?: boolean;
};

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onSubmitSuccess,
  showHeading = true,
}) => {
  const user = state.user.userState.get();
  const { colors, isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    pronouns: user.pronouns || "",
    currentDegree: user.currentDegree || "",
    faculty: user.faculty || "",
    school: user.school || "",
    university: user.university || "",
    program: user.program || "",
    year: user.year || "",
    isInternational: user.isInternational || false,
    isStudent: user.isStudent || false,
  });

  const inputStyle = useMemo(
    () => [
      tw`p-3 rounded-lg`,
      {
        backgroundColor: isDarkMode ? colors.lightGray : colors.white,
        color: colors.text,
      },
    ],
    [colors.lightGray, colors.text, colors.white, isDarkMode]
  );

  const labelStyle = useMemo(
    () => [tw`text-sm font-medium mb-1`, { color: colors.gray }],
    [colors.gray]
  );

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        ...formData,
      };

      state.user.userState.set(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      Alert.alert("Success", "Profile updated successfully");
      onSubmitSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: colors.background }]}
      contentContainerStyle={tw`pb-10 px-5`}
    >
      {showHeading ? (
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          View Profile
        </Text>
      ) : null}

      <View style={tw`mb-4`}>
        <Text style={labelStyle}>First Name</Text>
        <TextInput
          style={inputStyle}
          placeholder="First Name"
          placeholderTextColor={colors.gray}
          value={formData.firstName}
          editable={false}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={labelStyle}>Last Name</Text>
        <TextInput
          style={inputStyle}
          placeholder="Last Name"
          placeholderTextColor={colors.gray}
          value={formData.lastName}
          editable={false}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={labelStyle}>Email</Text>
        <TextInput
          style={inputStyle}
          placeholder="Email"
          placeholderTextColor={colors.gray}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          editable={false}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={labelStyle}>Pronouns</Text>
        <TextInput
          style={inputStyle}
          placeholder="Pronouns"
          placeholderTextColor={colors.gray}
          value={formData.pronouns}
          editable={false}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={labelStyle}>Current Degree</Text>
        <TextInput
          style={inputStyle}
          placeholder="Current Degree"
          placeholderTextColor={colors.gray}
          value={formData.currentDegree}
          editable={false}
        />
      </View>
    </ScrollView>
  );
};

const EditProfile = () => {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: colors.background }]}
    >
      <EditProfileForm onSubmitSuccess={() => router.back()} />
    </SafeAreaView>
  );
};

export default EditProfile;
