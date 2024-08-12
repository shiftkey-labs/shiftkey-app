import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import axios from "axios";
import state from "../state";

const Signup = () => {
  const router = useRouter();
  const email = state.user.userState.email.get();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        email,
        firstName,
        lastName,
        // Add other fields as needed
      });
      if (response.status === 200) {
        state.user.userState.set(response.data.user); // Update userState with the full user details
        Alert.alert("Signup Successful", "Your account has been created.");
        router.push("/"); // Navigate to the main app
      }
    } catch (error) {
      Alert.alert(
        "Signup Error",
        "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-5 bg-white`}>
      <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
        Complete Your Signup
      </Text>
      <TextInput
        style={tw`border p-3 rounded mb-3`}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={tw`border p-3 rounded mb-3`}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {/* Add other input fields as needed */}
      <TouchableOpacity
        style={tw`bg-primary p-4 rounded mb-3`}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={tw`text-white text-center`}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
