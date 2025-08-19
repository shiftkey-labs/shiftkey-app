import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import tw from "../styles/tailwind";
import { useRouter } from "expo-router";
import state from "../state";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signupForm } from "@/constants/signupForm";
import { updateUserById } from "@/api/userApi";

type SignupFormType = typeof signupForm;
type FormFieldKey = keyof SignupFormType;
type FormField = SignupFormType[FormFieldKey];

interface FormData {
  [key: string]: string | string[] | number | boolean;
}

const EditProfile = () => {
  const user = state.user.userState.get();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    pronouns: Array.isArray(user.pronouns)
      ? user.pronouns
      : user.pronouns
      ? [user.pronouns]
      : [],
    selfIdentification: Array.isArray(user.selfIdentification)
      ? user.selfIdentification
      : user.selfIdentification
      ? [user.selfIdentification]
      : [],
    isStudent: user.isStudent || "",
    occupation: user.occupation || "",
    organization: Array.isArray(user.organization)
      ? user.organization
      : user.organization
      ? [user.organization]
      : [],
    currentDegree: user.currentDegree || "",
    faculty: user.faculty || "",
    school: user.school || "",
    year: user.year || "",
    university: user.university || "",
    program: user.program || "",
    isInternational: user.isInternational || false,
    role: user.role || "",
  });

  // Update form data when user state changes
  useEffect(() => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      pronouns: Array.isArray(user.pronouns)
        ? user.pronouns
        : user.pronouns
        ? [user.pronouns]
        : [],
      selfIdentification: Array.isArray(user.selfIdentification)
        ? user.selfIdentification
        : user.selfIdentification
        ? [user.selfIdentification]
        : [],
      isStudent: user.isStudent || "",
      occupation: user.occupation || "",
      organization: Array.isArray(user.organization)
        ? user.organization
        : user.organization
        ? [user.organization]
        : [],
      currentDegree: user.currentDegree || "",
      faculty: user.faculty || "",
      school: user.school || "",
      year: user.year || "",
      university: user.university || "",
      program: user.program || "",
      isInternational: user.isInternational || false,
      role: user.role || "",
    });
  }, [user]);

  // Define all possible required fields from backend schema
  const getRequiredFields = () => {
    const baseRequiredFields = [
      "firstName",
      "lastName",
      "pronouns",
      "isStudent",
    ];

    // Add additional required fields based on student status
    if (formData.isStudent === "Yes") {
      return [
        ...baseRequiredFields,
        "currentDegree",
        "faculty",
        "school",
        "year",
      ];
    } else if (formData.isStudent === "No") {
      return [...baseRequiredFields, "organization", "occupation"];
    }

    return baseRequiredFields;
  };

  // Get the fields that are both required and currently showing on screen
  const fieldsToValidate = Object.keys(signupForm).filter((key) =>
    getRequiredFields().includes(key as FormFieldKey)
  );

  // Validation helper functions
  const isFieldInvalid = (key: FormFieldKey) => {
    const shouldValidate = fieldsToValidate.includes(key);
    const value = formData[key];
    const isEmpty = Array.isArray(value)
      ? value.length === 0 // For multi-select fields
      : !value || value === "";
    const isFieldTouched = touchedFields[key] || hasSubmitAttempt;

    return shouldValidate && isEmpty && isFieldTouched;
  };

  const hasEmptyRequiredFields = () => {
    return fieldsToValidate.some((key) => {
      const value = formData[key];
      return Array.isArray(value) ? value.length === 0 : !value || value === "";
    });
  };

  // Update handleInputChange to track touched fields
  const handleInputChange = (
    key: string,
    value: string | string[] | number | boolean
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // Add this helper function to determine if a field should be shown
  const shouldShowField = (fieldKey: FormFieldKey) => {
    // Always show these fields
    const alwaysShowFields: FormFieldKey[] = [
      "firstName",
      "lastName",
      "pronouns",
      "selfIdentification",
      "isStudent",
    ];
    if (alwaysShowFields.includes(fieldKey)) return true;

    // Show student-specific fields only if isStudent is "Yes"
    const studentFields: FormFieldKey[] = [
      "currentDegree",
      "faculty",
      "school",
      "year",
    ];
    if (studentFields.includes(fieldKey)) {
      return formData.isStudent === "Yes";
    }

    // Show non-student fields only if isStudent is "No"
    const nonStudentFields: FormFieldKey[] = ["organization", "occupation"];
    if (nonStudentFields.includes(fieldKey)) {
      return formData.isStudent === "No";
    }

    return true;
  };

  const handleSave = async () => {
    setHasSubmitAttempt(true);

    if (hasEmptyRequiredFields()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Prepare data for backend
      const backendData = {
        ...formData,
        // Always send arrays for multi-select fields
        pronouns: Array.isArray(formData.pronouns)
          ? formData.pronouns
          : [formData.pronouns].filter(Boolean),
        selfIdentification: Array.isArray(formData.selfIdentification)
          ? formData.selfIdentification
          : [formData.selfIdentification].filter(Boolean),
        organization: Array.isArray(formData.organization)
          ? formData.organization
          : [formData.organization].filter(Boolean),
        faculty: formData.faculty ? formData.faculty : null,
        school: formData.school ? formData.school : null,
        year: formData.year ? Number(formData.year) : null,
        currentDegree: formData.currentDegree ? formData.currentDegree : null,
      };

      // Update user in backend
      if (user.id) {
        await updateUserById(user.id, backendData);
      } else {
        Alert.alert("Error", "User ID not found. Please try logging in again.");
        return;
      }

      // Update user state
      state.user.userState.set({
        ...user,
        ...formData,
      });

      // Store user data in AsyncStorage
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          ...formData,
        })
      );

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
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
          style={tw`flex-1`}
          contentContainerStyle={tw`p-5`}
          keyboardShouldPersistTaps='handled'
        >
          <Text style={tw`text-3xl font-bold mb-6 text-black`}>
            Edit Profile
          </Text>

          {/* Form Fields */}
          {Object.entries(signupForm)
            .filter(([key, field]) => shouldShowField(field.key))
            .map(([key, field]) => (
              <View key={field.key} style={tw`mb-4`}>
                <Text style={tw`text-lg font-bold mb-2 text-black`}>
                  {field.label}
                  {isFieldInvalid(field.key) && (
                    <Text style={tw`text-red-500 text-sm ml-1`}>
                      {" "}
                      *Required
                    </Text>
                  )}
                </Text>
                {field.type === "text" || field.type === "number" ? (
                  <TextInput
                    style={[
                      tw`p-4 rounded-lg text-base bg-white border`,
                      {
                        borderColor: isFieldInvalid(field.key)
                          ? "#ff0000"
                          : "#d1d5db",
                      },
                    ]}
                    placeholder={field.placeholder}
                    placeholderTextColor='#6b7280'
                    keyboardType={
                      field.type === "number" ? "numeric" : "default"
                    }
                    value={String(formData[field.key] || "")}
                    onChangeText={(value) =>
                      handleInputChange(field.key, value)
                    }
                    onBlur={() =>
                      setTouchedFields((prev) => ({
                        ...prev,
                        [field.key]: true,
                      }))
                    }
                    editable={!loading}
                  />
                ) : field.type === "multi-select" ? (
                  <View
                    style={[
                      tw`p-4 rounded-lg bg-white border`,
                      {
                        borderColor: isFieldInvalid(field.key)
                          ? "#ff0000"
                          : "#d1d5db",
                      },
                    ]}
                  >
                    {field.options?.map((option) => (
                      <View
                        key={option.value}
                        style={tw`flex-row items-center mb-3`}
                      >
                        <Checkbox
                          value={(formData[field.key] as string[])?.includes(
                            option.value
                          )}
                          onValueChange={(checked) => {
                            const currentValues =
                              (formData[field.key] as string[]) || [];
                            const newValues = checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((v) => v !== option.value);
                            handleInputChange(field.key, newValues);
                          }}
                          style={tw`mr-3`}
                          disabled={loading}
                          color='#0455BF'
                        />
                        <Text style={tw`text-base flex-1 text-black`}>
                          {option.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Dropdown
                    style={[
                      tw`border rounded-lg p-4 min-h-[60px] bg-white`,
                      {
                        borderColor: isFieldInvalid(field.key)
                          ? "#ff0000"
                          : "#d1d5db",
                      },
                    ]}
                    data={[...(field.options || [])]}
                    labelField='label'
                    valueField='value'
                    placeholder='Select an option'
                    value={formData[field.key] as string}
                    onChange={(item: any) =>
                      handleInputChange(field.key, item.value)
                    }
                    onBlur={() =>
                      setTouchedFields((prev) => ({
                        ...prev,
                        [field.key]: true,
                      }))
                    }
                    placeholderStyle={tw`text-base text-gray-500`}
                    selectedTextStyle={tw`text-base text-black`}
                    containerStyle={tw`rounded-lg border-0 shadow-lg`}
                    activeColor='#0455BF20'
                    itemTextStyle={tw`text-base text-black`}
                    itemContainerStyle={tw`border-b border-gray-200`}
                    maxHeight={300}
                    disable={loading}
                  />
                )}
              </View>
            ))}

          {/* Additional fields not in signup form but in user state */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-lg font-bold mb-2 text-black`}>
              University
            </Text>
            <TextInput
              style={tw`p-4 rounded-lg text-base bg-white border border-gray-300`}
              placeholder='Enter your university'
              placeholderTextColor='#6b7280'
              value={String(formData.university || "")}
              onChangeText={(value) => handleInputChange("university", value)}
              editable={!loading}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-lg font-bold mb-2 text-black`}>Program</Text>
            <TextInput
              style={tw`p-4 rounded-lg text-base bg-white border border-gray-300`}
              placeholder='Enter your program'
              placeholderTextColor='#6b7280'
              value={String(formData.program || "")}
              onChangeText={(value) => handleInputChange("program", value)}
              editable={!loading}
            />
          </View>

          {/* Validation Error Message */}
          {hasSubmitAttempt && hasEmptyRequiredFields() && (
            <View style={tw`p-4 rounded-lg mb-4 bg-red-50`}>
              <Text style={tw`text-center text-base text-red-500`}>
                Please fill in all required fields
              </Text>
            </View>
          )}

          {/* Save Button */}
          <Pressable
            style={[
              tw`p-4 rounded-lg mb-10 flex-row justify-center items-center`,
              hasEmptyRequiredFields() || loading
                ? tw`bg-gray-400`
                : tw`bg-blue-600`,
            ]}
            onPress={handleSave}
            disabled={loading || hasEmptyRequiredFields()}
          >
            {loading ? (
              <ActivityIndicator color='white' style={tw`mr-2`} />
            ) : null}
            <Text style={tw`text-white text-center font-bold text-base`}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
