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
import Checkbox from 'expo-checkbox';
import tw from "../styles/tailwind";
import axios from "axios";
import state from "../state";
import { signupForm } from "@/constants/signupForm";
import { DEV_URL } from "@/config/axios";

interface FormField {
  label: string;
  key: string;
  placeholder?: string;
  type: string;
  options?: Array<{ label: string; value: string }>;
}

interface FormData {
  [key: string]: string | string[];
}

const Signup = () => {
  const router = useRouter();
  const user = state.user.userState.get();
  const email = user.email;

  // Filter out fields that already have data
  const requiredFields = signupForm.filter((field: FormField) => {
    const fieldValue = user[field.key as keyof typeof user];
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
  const initialFormData: FormData = requiredFields.reduce((acc: FormData, field: FormField) => {
    // Use existing user data if available
    const existingValue = user[field.key as keyof typeof user];
    if (existingValue !== undefined && existingValue !== "" && existingValue !== null) {
      // Convert the value to the appropriate type based on field type
      if (field.type === "multi-select") {
        acc[field.key] = Array.isArray(existingValue) ? existingValue : [existingValue as string];
      } else {
        acc[field.key] = String(existingValue);
      }
    } else {
      // Initialize with empty value if no existing data
      acc[field.key] = field.type === "multi-select" ? [] : "";
    }
    return acc;
  }, {});

  // Create formData state
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // Update form data when user data changes
  useEffect(() => {
    const updatedFormData = { ...formData };
    let hasUpdates = false;

    requiredFields.forEach((field: FormField) => {
      const existingValue = user[field.key as keyof typeof user];
      if (existingValue !== undefined && existingValue !== "" && existingValue !== null) {
        const newValue = field.type === "multi-select"
          ? (Array.isArray(existingValue) ? existingValue : [existingValue as string])
          : String(existingValue);

        if (JSON.stringify(newValue) !== JSON.stringify(formData[field.key])) {
          updatedFormData[field.key] = newValue;
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) {
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

      const response = await axios.post(`${DEV_URL}/auth/signup`, {
        email,
        ...formData,
      });

      if (response.status === 200) {
        console.log("Signup response:", response.data);
        // Update userState with the full user details
        state.user.userState.set(response.data.user);
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
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-5 bg-white`}>
        <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
          Complete Your Profile
        </Text>
        {requiredFields.map((field: FormField) => (
          <View key={field.key}>
            <Text style={tw`text-lg font-montserratBold mb-2`}>
              {field.label}
            </Text>
            {field.type === "text" || field.type === "numeric" ? (
              <TextInput
                style={tw`border p-3 rounded mb-3`}
                placeholder={field.placeholder}
                keyboardType={field.type === "numeric" ? "numeric" : "default"}
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
            ) : (
              <Dropdown
                style={tw`border p-3 rounded mb-3`}
                data={field.options || []}
                labelField="label"
                valueField="value"
                placeholder="Select an option"
                value={formData[field.key] as string}
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
