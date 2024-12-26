import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import state from "../state";
import server, { DEV_URL } from "@/config/axios";
import { SafeAreaView } from "react-native";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Move to previous input on backspace
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const requestOtp = async () => {
    setLoading(true);
    try {
      console.log("email", email);

      const response = await server.post(`/auth/send-otp`, {
        email,
      });
      if (response.status === 200) {
        setOtpSent(true);
        Alert.alert("OTP Sent", "Please check your email for the OTP.");
      }
    } catch (error: any) {
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
    setVerifying(true);
    try {
      const otpString = otp.join("");
      const response = await server.post(`/auth/verify-otp`, {
        email,
        otp: otpString,
      });
      if (response.status === 200) {
        const userData = response.data.user;
        console.log("Received userData:", userData);

        // Update userState with the user data 
        state.user.userState.set(userData);

        // Store user data in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // Check if user has the required fields in their profile
        const hasRequiredFields = userData.firstName &&
          userData.lastName &&
          userData.role &&
          userData.email;

        if (!hasRequiredFields) {
          // If basic required fields are missing, redirect to signup
          console.log("Missing required fields, redirecting to signup");
          router.push("/(auth)/signup");
        } else {
          // If all required fields are present, redirect to home
          console.log("All required fields present, redirecting to home");
          router.push("/");
        }
      }
    } catch (error) {
      Alert.alert("Verification Error", "Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const renderButton = () => {
    if (!otpSent) {
      return (
        <TouchableOpacity
          style={tw`bg-primary p-4 rounded mb-3 flex-row justify-center items-center`}
          onPress={requestOtp}
          disabled={loading || !email}
        >
          {loading ? (
            <ActivityIndicator color="white" style={tw`mr-2`} />
          ) : null}
          <Text style={tw`text-white text-center`}>
            {loading ? "Sending OTP..." : "Request OTP"}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={tw`bg-primary p-4 rounded mb-3 flex-row justify-center items-center`}
        onPress={verifyOtp}
        disabled={verifying || otp.some(digit => !digit)}
      >
        {verifying ? (
          <ActivityIndicator color="white" style={tw`mr-2`} />
        ) : null}
        <Text style={tw`text-white text-center`}>
          {verifying ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <ScrollView
        contentContainerStyle={tw`flex-1 justify-center p-5 bg-white`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`flex-1 justify-center`}>
          <Logo />
          <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
            Login
          </Text>
          {!otpSent && (
            <TextInput
              style={tw`border p-3 rounded mb-5`}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          )}
          {otpSent && (
            <View style={tw`mb-5`}>
              <Text style={tw`text-center mb-3 text-gray-600`}>Enter verification code</Text>
              <View style={tw`flex-row justify-between px-2`}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={tw`border w-12 h-12 rounded text-center text-lg font-montserratMedium mx-1`}
                    maxLength={1}
                    keyboardType="numeric"
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                        inputRefs.current[index - 1].focus();
                      }
                    }}
                    editable={!verifying}
                  />
                ))}
              </View>
            </View>
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
              disabled={loading || otp.some(digit => !digit)}
            >
              <Text style={tw`text-white text-center`}>Verify OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
