import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import axios from "axios"; // For making API requests
import state from "../state";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // New state for OTP
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [loading, setLoading] = useState(false);

  // Function to request OTP
  const requestOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/auth/send-otp", {
        email,
      });
      if (response.status === 200) {
        setOtpSent(true);
        Alert.alert("OTP Sent", "Please check your email for the OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/verify-otp",
        { email, otp }
      );
      if (response.status === 200) {
        state.user.userState.set(response.data.user); // Store the authenticated user in state
        router.push("/"); // Navigate to the main app
      }
    } catch (error) {
      Alert.alert("Login Error", "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-5 bg-white`}>
      <Logo />
      <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
        Login
      </Text>
      <TextInput
        style={tw`border p-3 rounded mb-3`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {otpSent && (
        <TextInput
          style={tw`border p-3 rounded mb-5`}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />
      )}
      {!otpSent ? (
        <TouchableOpacity
          style={tw`bg-primary p-4 rounded mb-3`}
          onPress={requestOtp}
          disabled={loading}
        >
          <Text style={tw`text-white text-center`}>Request OTP</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={tw`bg-primary p-4 rounded mb-3`}
          onPress={verifyOtp}
          disabled={loading}
        >
          <Text style={tw`text-white text-center`}>Verify OTP</Text>
        </TouchableOpacity>
      )}
      {!otpSent && (
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={tw`text-center text-primary`}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Login;
