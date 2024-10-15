import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import state from "../state";
import { DEV_URL } from "@/config/axios";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setLoading(true);
    try {
      console.log("email", email);

      const response = await axios.post(`${DEV_URL}/auth/send-otp`, {
        email,
      });
      if (response.status === 200) {
        setOtpSent(true);
        Alert.alert("OTP Sent", "Please check your email for the OTP.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Toast.show({
          type: "error",
          text1: "User Not Found",
          text2: "The email you entered does not exist. Please sign up first.",
        });
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${DEV_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      if (response.status === 200) {
        const userData = response.data.user;

        console.log("userData", userData);

        // Update userState with the user data
        state.user.userState.set(userData);

        // Store user data in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // Check for missing fields
        const requiredFields = [
          "email",
          "firstName",
          "lastName",
          "pronouns",
          "isStudent",
          "currentDegree",
          "faculty",
          "school",
          "shirtSize",
          "backgroundCheck",
          "hours",
        ];
        console.log("userData", userData);

        const missingFields = requiredFields.filter(
          (field) => !userData[field]
        );

        if (missingFields.length > 0) {
          // If there are missing fields, redirect to signup
          router.push("/(auth)/signup");
        } else {
          // If all fields are present, redirect to home
          router.push("/");
        }
      }
    } catch (error) {
      Alert.alert("Verification Error", "Invalid OTP. Please try again.");
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
        style={tw` p-3 rounded mb-3 border`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        aria-disabled={otpSent}
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
    </View>
  );
};

export default Login;
