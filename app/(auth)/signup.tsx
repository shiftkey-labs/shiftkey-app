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

  // Define all possible required fields from backend schema
  const backendRequiredFields = [
    'firstName',
    'lastName',
    'pronouns',
    'isStudent',
    'currentDegree',
    'school',
  ];

  // Get the fields that are both required by backend and currently showing on screen
  const fieldsToValidate = missingFields
    .map(field => field.key)
    .filter(key => backendRequiredFields.includes(key));

  // Add validation states
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  // Validation helper functions
  const isFieldInvalid = (key: string) => {
    const shouldValidate = fieldsToValidate.includes(key);
    const value = formData[key];
    const isEmpty = Array.isArray(value) 
      ? value.length === 0  // For multi-select fields
      : !value || value === "";
    const isFieldTouched = touchedFields[key] || hasSubmitAttempt;

    return shouldValidate && isEmpty && isFieldTouched;
  };

  const hasEmptyRequiredFields = () => {
    return fieldsToValidate.some(key => {
      const value = formData[key];
      return Array.isArray(value) 
        ? value.length === 0
        : !value || value === "";
    });
  };

  // Update handleInputChange to track touched fields
  const handleInputChange = (key: string, value: string | string[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // Group form-related state together
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setHasSubmitAttempt(true);
    
    if (hasEmptyRequiredFields()) {
      return;
    }

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
        // Update userState with the full user details including the fields structure
        state.user.userState.set(response.data.user);

        // Store updated user data in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        Alert.alert("Signup Successful", "Your account has been created.");
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
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-5 bg-white`}>
        <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
          Complete Your Profile
        </Text>
        {missingFields.map((field) => (
          <View key={field.key}>
            <Text style={tw`text-lg font-montserratBold mb-2`}>
              {field.label}
              {isFieldInvalid(field.key) && (
                <Text style={tw`text-red-500 text-sm ml-1`}> *Required</Text>
              )}
            </Text>
            {field.type === "text" || field.type === "numeric" ? (
              <TextInput
                style={[
                  tw`border p-3 rounded mb-3`,
                  isFieldInvalid(field.key) && tw`border-red-500`,
                ]}
                placeholder={field.placeholder}
                keyboardType={field.type === "numeric" ? "numeric" : "default"}
                value={formData[field.key]}
                onChangeText={(value) => handleInputChange(field.key, value)}
                onBlur={() => setTouchedFields(prev => ({ ...prev, [field.key]: true }))}
              />
            ) : field.type === "multi-select" ? (
              <View style={[
                tw`mb-3`,
                isFieldInvalid(field.key) && tw`border-red-500`,
              ]}>
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
            ) : (
              <Dropdown
                style={[
                  tw`border p-3 rounded mb-3`,
                  isFieldInvalid(field.key) && tw`border-red-500`,
                ]}
                data={field.options || []}
                labelField="label"
                valueField="value"
                placeholder="Select an option"
                value={formData[field.key]}
                onChange={(item) => handleInputChange(field.key, item.value)}
                onBlur={() => setTouchedFields(prev => ({ ...prev, [field.key]: true }))}
              />
            )}
          </View>
        ))}
        {loading ? (
          <View style={tw`flex-1 items-center justify-center`}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            {hasSubmitAttempt && hasEmptyRequiredFields() && (
              <Text style={tw`text-red-500 text-center mt-5 mb-2 font-montserratBold`}>
                Please fill in all required fields
              </Text>
            )}
            <TouchableOpacity
              style={tw`bg-blue-500 p-3 rounded mb-10`}
              onPress={handleSignup}
            >
              <Text style={tw`text-white text-center font-montserratBold`}>
                Update Profile
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
