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
  Pressable,
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
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!email) {
      router.replace("/(auth)/login");
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
  useEffect(() => {
    const initialData: FormData = Object.entries(signupForm).reduce((acc: FormData, [key, field]) => {
      const existingValue = user[key];
      if (field.type === "multi-select") {
        acc[key] = existingValue
          ? (Array.isArray(existingValue) ? existingValue : [existingValue]).filter(Boolean)
          : [];
      } else {
        acc[key] = existingValue ? String(existingValue) : "";
      }
      return acc;
    }, {});
    setFormData(initialData);
  }, [user]);

  // Define all possible required fields from backend schema
  const getRequiredFields = () => {
    const baseRequiredFields = [
      'firstName',
      'lastName',
      'pronouns',
      'isStudent',
    ];

    // Add additional required fields based on student status
    if (formData.isStudent === "Yes") {
      return [...baseRequiredFields, 'currentDegree', 'faculty', 'school'];
    } else if (formData.isStudent === "No") {
      return [...baseRequiredFields, 'organization', 'occupation'];
    }

    return baseRequiredFields;
  };

  // Get the fields that are both required and currently showing on screen
  const fieldsToValidate = missingFields
    .map(field => field.key)
    .filter(key => getRequiredFields().includes(key));

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
        organization: Array.isArray(formData.organization)
          ? formData.organization
          : [formData.organization].filter(Boolean),
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

  // Add this helper function to determine if a field should be shown
  const shouldShowField = (fieldKey: string) => {
    // Always show these fields
    const alwaysShowFields = ['firstName', 'lastName', 'pronouns', 'selfIdentification', 'isStudent'];
    if (alwaysShowFields.includes(fieldKey)) return true;

    // Show student-specific fields only if isStudent is "Yes"
    const studentFields = ['currentDegree', 'faculty', 'school'];
    if (studentFields.includes(fieldKey)) {
      return formData.isStudent === "Yes";
    }

    // Show non-student fields only if isStudent is "No"
    const nonStudentFields = ['organization', 'occupation'];
    if (nonStudentFields.includes(fieldKey)) {
      return formData.isStudent === "No";
    }

    return true;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1 p-5 bg-white`}>
        <Text style={tw`text-3xl font-poppinsBold text-center mb-5`}>
          Complete Your Profile
        </Text>
        {missingFields
          .filter(field => shouldShowField(field.key)) // Filter fields based on conditions
          .map((field) => (
          <View key={field.key}>
            <Text style={tw`text-lg font-poppinsBold mb-2`}>
              {field.label}
              {isFieldInvalid(field.key) && (
                <Text style={tw`text-red-500 text-sm ml-1 font-poppins`}> *Required</Text>
              )}
            </Text>
            {field.type === "text" || field.type === "numeric" ? (
              <TextInput
                style={[
                  tw`border border-gray p-5 rounded-lg mb-5 font-poppins`,
                  isFieldInvalid(field.key) && tw`border-red-500`,
                ]}
                placeholder={field.placeholder}
                keyboardType={field.type === "numeric" ? "numeric" : "default"}
                value={formData[field.key]}
                onChangeText={(value) => handleInputChange(field.key, value)}
                onBlur={() => setTouchedFields(prev => ({ ...prev, [field.key]: true }))}
                editable={!loading}
              />
            ) : field.type === "multi-select" ? (
              <View style={[
                tw`mb-5`,
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
                      disabled={loading}
                    />
                    <Text style={tw`text-base font-poppins`}>{option.label}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Dropdown
                style={[
                  tw`border border-gray p-5 rounded-lg mb-5 bg-white min-h-[60px]`,
                  isFieldInvalid(field.key) && tw`border-red-500`,
                ]}
                data={field.options || []}
                labelField="label"
                valueField="value"
                placeholder="Select an option"
                value={formData[field.key]}
                onChange={(item: any) => handleInputChange(field.key, item.value)}
                onBlur={() => setTouchedFields(prev => ({ ...prev, [field.key]: true }))}
                placeholderStyle={tw`font-poppins text-gray-500`}
                selectedTextStyle={tw`font-poppins text-black`}
                containerStyle={tw`rounded-lg border-0 shadow-none`}
                activeColor={tw.color('primary/10')}
                itemTextStyle={tw`font-poppins text-black`}
                itemContainerStyle={tw`border-b border-lightGray`}
                maxHeight={300}
                disable={loading}
              />
            )}
          </View>
        ))}
        <>
          {hasSubmitAttempt && hasEmptyRequiredFields() && (
            <Text style={tw`text-red-500 text-center mt-5 mb-2 font-poppins`}>
              Please fill in all required fields
            </Text>
          )}
          <Pressable
            style={[
              tw`p-4 rounded-lg mb-10 flex-row justify-center items-center`,
              hasEmptyRequiredFields() ? tw`bg-primary/50` : tw`bg-primary`
            ]}
            onPress={handleSignup}
            disabled={loading || hasEmptyRequiredFields()}
          >
            {loading ? (
              <ActivityIndicator color="white" style={tw`mr-2`} />
            ) : null}
            <Text style={tw`text-white text-center font-poppinsBold`}>
              {loading ? "Updating..." : "Update Profile"}
            </Text>
          </Pressable>
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
