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
import tw from "../styles/tailwind";
import axios from "axios";
import state from "../state";
import { signupForm } from "@/constants/signupForm";

const Signup = () => {
  const router = useRouter();
  const email = state.user.userState.get().email;

  // Define the initial form data
  const initialFormData = {
    firstName: state.user.userState.firstName.get() || "",
    lastName: state.user.userState.lastName.get() || "",
    pronouns: state.user.userState.pronouns.get() || "",
    isStudent: state.user.userState.isStudent.get() || "",
    currentDegree: state.user.userState.currentDegree.get() || "",
    faculty: state.user.userState.faculty.get() || "",
    school: state.user.userState.school.get() || "",
    shirtSize: state.user.userState.shirtSize.get() || "",
    backgroundCheck: state.user.userState.backgroundCheck.get() || "",
    hours: state.user.userState.hours.get() || "",
  };
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
      console.log(state.user.userState.get());

      const response = await axios.post("http://localhost:3000/auth/signup", {
        email,
        ...formData,
      });
      if (response.status === 200) {
        state.user.userState.set(response.data.user); // Update userState with the full user details
        Alert.alert("Signup Successful", "Your account has been created.");
        router.push("/"); // Navigate to the main app
      }
    } catch (error) {
      console.log(error);

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
          <>
            <Text style={tw`text-lg font-montserratBold mb-2`}>
              {field.label}
            </Text>
            <TextInput
              key={field.key}
              style={tw`border p-3 rounded mb-3`}
              placeholder={field.placeholder}
              value={formData[field.key]}
              onChangeText={(value) => handleInputChange(field.key, value)}
            />
          </>
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
