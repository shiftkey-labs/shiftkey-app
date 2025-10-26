import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import server from "@/config/axios";
import { persistAuthSession } from "@/state/authSession";

const VerifyOtp = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[]; message?: string | string[] }>();
  const emailParam = params.email;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam ?? "";
  const messageParam = params.message;
  const initialStatusMessage = Array.isArray(messageParam) ? messageParam[0] : messageParam ?? "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(initialStatusMessage);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (!email) {
      router.replace("/(auth)/login");
    }
  }, [email, router]);

  useEffect(() => {
    setStatusMessage(initialStatusMessage);
  }, [initialStatusMessage]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    const nextValue = sanitizedValue.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = nextValue;
    setOtp(newOtp);

    if (nextValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!nextValue && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    if (verifying || !email) {
      return;
    }

    setVerifying(true);
    try {
      const otpString = otp.join("");
      const response = await server.post(`/auth/verify-otp`, {
        email,
        otp: otpString,
      });

      const successFlag = response.data?.success;
      const isSuccess = response.status === 200 && successFlag !== false;

      if (isSuccess) {
        const userData = response.data.user;
        const token = response.data.token;

        const hasRequiredProfile = await persistAuthSession(userData, token);

        if (!hasRequiredProfile) {
          router.push("/(auth)/signup");
        } else {
          router.push("/");
        }
        return;
      }

      const errorMessage = response.data?.message || "Invalid OTP. Please try again.";
      setStatusMessage(errorMessage);
      Alert.alert("Verification Error", errorMessage);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      setStatusMessage(errorMessage);
      Alert.alert("Verification Error", errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const handleChangeEmail = () => {
    router.back();
  };

  if (!email) {
    return null;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={tw`flex-1`}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow px-5 pb-10 bg-white`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={tw`flex-1 justify-center mt-16`}>
            <Logo />
            <Text style={tw`text-3xl font-poppinsBold text-center mt-5 mb-4`}>
              Enter your verification code
            </Text>
            {statusMessage ? (
              <Text style={tw`text-lg font-poppins text-center mb-4`}>
                {statusMessage}
              </Text>
            ) : null}
            <Text style={tw`text-center mb-6 text-gray font-poppins`}>
              We sent a 6-digit code to {email}
            </Text>
            <View style={tw`flex-row justify-between px-2 mb-6`}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  style={tw`border border-gray w-12 h-12 rounded text-center text-lg font-poppinsMedium mx-1`}
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                  editable={!verifying}
                />
              ))}
            </View>
            <TouchableOpacity
              style={tw`bg-primary p-4 rounded mb-3 flex-row justify-center items-center`}
              onPress={verifyOtp}
              disabled={verifying || otp.some(digit => !digit)}
            >
              {verifying ? (
                <ActivityIndicator color="white" style={tw`mr-2`} />
              ) : null}
              <Text style={tw`text-white text-center`}>
                {verifying ? "Verifying..." : "Verify Code"}
              </Text>
            </TouchableOpacity>
            <Pressable onPress={handleChangeEmail} style={tw`mt-2`}>
              <Text style={tw`text-primary text-center font-poppinsBold`}>
                Change Email
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOtp;
