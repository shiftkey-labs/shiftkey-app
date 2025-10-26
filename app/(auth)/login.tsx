import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import Toast from "react-native-toast-message";
import server from "@/config/axios";
import { persistAuthSession } from "@/state/authSession";

const Login = () => {
  const router = useRouter();
  const defaultStatusMessage = "Please enter your email to continue";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(defaultStatusMessage);

  // Sanitize email input
  const handleEmailChange = (text: string) => {
    // Remove whitespace, convert to lowercase, and only allow valid email characters
    // Valid chars: a-z, 0-9, @, ., -, _
    const sanitized = text
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/g, ''); // Remove any character that's not valid for email
    setEmail(sanitized);
  };

  const requestOtp = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await server.post(`/auth/send-otp`, {
        email,
      });

      const successFlag = response.data?.success;
      const isSuccess = response.status === 200 && successFlag !== false;

      if (isSuccess) {
        const successMessage = response.data?.message || "OTP sent successfully.";
        const token = response.data?.token;
        const userData = response.data?.user;

        setStatusMessage(successMessage);
        Toast.show({
          type: "success",
          text1: successMessage,
        });

        if (token && userData) {
          const hasRequiredProfile = await persistAuthSession(userData, token);

          if (!hasRequiredProfile) {
            router.replace("/(auth)/signup");
          } else {
            router.replace("/");
          }
        } else {
          router.push({
            pathname: "/(auth)/verify-otp",
            params: { email, message: successMessage },
          });
        }
      } else {
        const errorMessage = response.data?.message || "Failed to send verification code. Please try again.";
        setStatusMessage(errorMessage);
        Alert.alert("Request Failed", errorMessage);
      }
    } catch (error: any) {
      // Handle error response from API
      const errorMessage = error.response?.data?.message || "Failed to send verification code. Please try again.";
      setStatusMessage(errorMessage);

      Alert.alert("Request Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={tw`flex-1`}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow px-5 bg-white`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={tw`flex-1 justify-center mt-16`}>
            <Logo />
            <Text style={tw`text-3xl font-poppinsBold text-center mt-5`}>
              Let's sign you in
            </Text>
            <Text style={tw`text-lg font-poppins text-center mb-10`}>
              {statusMessage}
            </Text>
            <TextInput
              style={tw`border border-gray p-5 rounded-lg mb-5`}
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              placeholderTextColor="#666666"
            />
            <TouchableOpacity
              style={tw`bg-primary p-4 rounded mb-3 flex-row justify-center items-center`}
              onPress={requestOtp}
              disabled={loading || !email}
            >
              {loading ? (
                <ActivityIndicator color="white" style={tw`mr-2`} />
              ) : null}
              <Text style={tw`text-white text-center`}>
                {loading ? "Logging In" : "Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
