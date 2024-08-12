import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import axios from "axios";
import Toast from "react-native-toast-message"; // Import the Toast component
import state from "../state";
import server from "@/config/axios";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
      console.log(email, otp);

      const response = await axios.post(
        "http://localhost:3000/auth/verify-otp",
        {
          email,
          otp,
        }
      );
      console.log(response);

      if (response.status === 200) {
        console.log(response.data);

        if (response.data.user.status === "Active") {
          state.user.userState.set(response.data.user);
          router.push("/");
        } else {
          state.user.userState.set({ email, name: "", uid: null }); // Temporarily store the email and set other fields to null
          router.push("/(auth)/signup"); // Redirect to signup
        }
      }
    } catch (error) {
      Alert.alert("Login Error", "Invalid OTP. Please try again.");
      console.log(error.message);
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
