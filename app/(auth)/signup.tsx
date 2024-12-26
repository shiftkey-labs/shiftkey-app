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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from 'expo-checkbox';
import tw from "../styles/tailwind";
import axios from "axios";
import state from "../state";
import { signupForm } from "@/constants/signupForm";
import { DEV_URL } from "@/config/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SignupFormType = typeof signupForm;
type FormFieldKey = keyof SignupFormType;
type FormField = SignupFormType[FormFieldKey];

interface FormData {
  [key: string]: string | string[];
}

interface UserState {
  id: null | string;
  firstName: string;
  lastName: string;
  email: string;
  pronouns: string;
  isStudent: string;
  currentDegree: string;
  faculty: string;
  school: string;
  hours: number;
  university: string;
  program: string;
  year: string;
  isInternational: boolean;
  role: string;
  [key: string]: string | number | boolean | null;
}

const Signup = () => {
  const router = useRouter();
  const user = state.user.userState.get() as UserState;
  const email = user.email;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!email) {
      router.replace("/(auth)/login");
      return;
    }
  }, [email]);

  // If not authenticated, show nothing while redirecting
  if (!email) {
    return null;
  }

  // Filter out fields that already have data
  const missingFields = Object.entries(signupForm)
    .filter(([key, field]) => {
      const value = user[key];
      return !value || value === "" || value === null ||
        (Array.isArray(value) && value.length === 0);
    })
    .map(([_, field]) => field);

  // If no missing fields, redirect to home
  useEffect(() => {
    if (missingFields.length === 0) {
      router.replace("/");
    }
  }, [missingFields.length]);

  // Initialize form data with missing fields
  const initialFormData: FormData = Object.entries(signupForm).reduce((acc: FormData, [key, field]) => {
    const existingValue = user[key];
    console.log(`Field ${key}:`, { existingValue, fieldType: field.type });

    // Special handling for fields that might come from backend in a different format
    if (field.type === "multi-select") {
      // Handle all multi-select fields (including pronouns and selfIdentification)
      acc[key] = existingValue
        ? (Array.isArray(existingValue) ? existingValue : [existingValue]).filter(Boolean)
        : [];
    } else {
      // Handle single value fields
      acc[key] = existingValue ? String(existingValue) : "";
    }

    return acc;
  }, {});

  console.log("Initial Form Data:", initialFormData);
  console.log("Missing Fields:", missingFields.map(f => f.key));

  // Create formData state
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // Update form data when user data changes
  useEffect(() => {
    const updatedFormData = { ...formData };
    let hasUpdates = false;

    Object.entries(signupForm).forEach(([key, field]) => {
      const existingValue = user[key];
      if (existingValue !== undefined && existingValue !== null) {
        let newValue: string | string[];

        if (field.type === "multi-select") {
          // Handle all multi-select fields consistently
          newValue = (Array.isArray(existingValue) ? existingValue : [existingValue]).filter(Boolean);
        } else {
          newValue = String(existingValue);
        }

        if (JSON.stringify(newValue) !== JSON.stringify(formData[key])) {
          updatedFormData[key] = newValue;
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) {
      console.log("Updating form data:", updatedFormData);
      setFormData(updatedFormData);
    }
  }, [user]);

  const handleInputChange = (key: string, value: string | string[]) => {
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

      // Prepare data for backend
      const backendData = {
        email,
        ...formData,
        // Always send arrays for multi-select fields
        pronouns: Array.isArray(formData.pronouns) ? formData.pronouns : [formData.pronouns].filter(Boolean),
        selfIdentification: Array.isArray(formData.selfIdentification)
          ? formData.selfIdentification
          : [formData.selfIdentification].filter(Boolean),
      };

      const response = await axios.post(`${DEV_URL}/auth/signup`, backendData);

      if (response.status === 200) {
        console.log("Signup response:", response.data);

        // Create a complete user object by merging existing data with form data
        const updatedUserData = {
          ...user,
          ...formData,
          // Store arrays consistently for multi-select fields
          pronouns: Array.isArray(formData.pronouns) ? formData.pronouns : [formData.pronouns].filter(Boolean),
          selfIdentification: Array.isArray(formData.selfIdentification)
            ? formData.selfIdentification
            : [formData.selfIdentification].filter(Boolean),
          ...response.data.user, // Prioritize server response data
        };

        // Update userState with the complete user details
        state.user.userState.set(updatedUserData);

        // Store complete user data in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(updatedUserData));

        Alert.alert("Signup Successful", "Your profile has been updated.");
        router.push("/"); // Navigate to the main app
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Update Error",
        "There was an error updating your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <ScrollView
          style={tw`flex-1 p-5 bg-white`}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
            Complete Your Profile
          </Text>
          {missingFields.map((field: FormField) => (
            <View key={field.key}>
              <Text style={tw`text-lg font-montserratBold mb-2`}>
                {field.label}
              </Text>
              {field.type === "text" ? (
                <TextInput
                  style={tw`border p-3 rounded mb-3`}
                  placeholder={field.placeholder}
                  value={formData[field.key] as string}
                  onChangeText={(value) => handleInputChange(field.key, value)}
                />
              ) : field.type === "multi-select" ? (
                <View style={tw`mb-3`}>
                  {field.options?.map((option) => (
                    <View key={option.value} style={tw`flex-row items-center mb-2`}>
                      <Checkbox
                        value={(formData[field.key] as string[])?.includes(option.value)}
                        onValueChange={(checked) => {
                          const currentValues = (formData[field.key] as string[]) || [];
                          const newValues = checked
                            ? [...currentValues, option.value]
                            : currentValues.filter((v) => v !== option.value);
                          handleInputChange(field.key, newValues);
                        }}
                        style={tw`mr-2`}
                      />
                      <Text style={tw`text-base font-montserrat`}>{option.label}</Text>
                    </View>
                  ))}
                </View>
              ) : field.type === "dropdown" ? (
                <Dropdown
                  style={tw`border p-3 rounded mb-3`}
                  data={[...field.options]}
                  labelField="label"
                  valueField="value"
                  placeholder="Select an option"
                  value={formData[field.key] as string}
                  onChange={(item: { label: string; value: string }) => handleInputChange(field.key, item.value)}
                />
              ) : null}
            </View>
          ))}
          {loading ? (
            <View style={tw`flex-1 items-center justify-center`}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <TouchableOpacity
              style={tw`bg-blue-500 p-3 rounded mt-5 mb-5`}
              onPress={handleSignup}
            >
              <Text style={tw`text-white text-center font-montserratBold`}>
                Update Profile
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
