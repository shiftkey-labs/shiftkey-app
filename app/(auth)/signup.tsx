import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
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
  const user = state.user.userState.get();
  const email = user.email;

  // Filter out fields that already have data
  const requiredFields = signupForm.filter(field => {
    const fieldValue = user[field.key];
    return !fieldValue || fieldValue === "" ||
      (Array.isArray(fieldValue) && fieldValue.length === 0);
  });

  // If no required fields are missing, redirect to home
  useEffect(() => {
    if (requiredFields.length === 0) {
      router.push("/");
    }
  }, [requiredFields]);

  // Define the initial form data using only missing fields
  const initialFormData = requiredFields.reduce((acc, field) => {
    acc[field.key] = "";
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
      console.log("Submitting signup with email:", email);
      console.log("Form data:", formData);

      const response = await axios.post(`${DEV_URL}/auth/signup`, {
        email,
        fields: {
          ...formData,
          pronouns: [formData.pronouns],
        },
      });

      if (response.status === 200) {
        console.log("Signup response:", response.data);
        // Update userState with the full user details including the fields structure
        state.user.userState.set(response.data.user);
        Alert.alert("Signup Successful", "Your account has been created.");
        router.push("/"); // Navigate to the main app
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Signup Error",
        "Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-5 bg-white`}>
        <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
          Complete Your Profile
        </Text>
        {requiredFields.map((field) => (
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
        {
          loading ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <TouchableOpacity
              style={tw`bg-blue-500 p-3 rounded mt-5`}
              onPress={handleSignup}
            >
              <Text style={tw`text-white text-center font-montserratBold`}>
                Update Profile
              </Text>
            </TouchableOpacity>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
