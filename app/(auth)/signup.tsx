import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import tw from "../styles/tailwind";
import axios from "axios";
import state from "../state";
import { signupForm } from "@/constants/signupForm";
import { DEV_URL } from "@/config/axios";

const Signup = () => {
  const router = useRouter();
  const email = state.user.userState.get().email;

  // Define the initial form data
  const initialFormData = signupForm.reduce((acc, field) => {
    acc[field.key] = state.user.userState[field.key]?.get() || "";
    return acc;
  }, {});

  // Create formData state
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      console.log("email", email);
      console.log("formData", formData);

      const response = await axios.post(`${DEV_URL}/auth/signup`, {
        email,
        ...formData,
      });
      console.log("response", response);

      if (response.status === 200) {
        state.user.userState.set(response.data.user); // Update userState with the full user details
        Alert.alert("Signup Successful", "Your account has been created.");
        router.push("/"); // Navigate to the main app
      }
    } catch (error) {
      console.log(error.message);
      Alert.alert(
        "Signup Error",
        "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-5 bg-white`}>
        <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
          Complete Your Signup
        </Text>
        {signupForm.map((field) => (
          <View key={field.key}>
            <Text style={tw`text-lg font-montserratBold mb-2`}>
              {field.label}
            </Text>
            {field.type === "text" || field.type === "numeric" ? (
              <TextInput
                style={tw`border p-3 rounded mb-3`}
                placeholder={field.placeholder}
                keyboardType={field.type === "numeric" ? "numeric" : "default"}
                value={formData[field.key]}
                onChangeText={(value) => handleInputChange(field.key, value)}
              />
            ) : (
              <Dropdown
                style={tw`border p-3 rounded mb-3`}
                data={field.options}
                labelField="label"
                valueField="value"
                placeholder="Select an option"
                value={formData[field.key]}
                onChange={(item) => handleInputChange(field.key, item.value)}
              />
            )}
          </View>
        ))}
        <TouchableOpacity
          style={tw`bg-primary p-4 rounded mb-3`}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={tw`text-white text-center`}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
