// src/app/login.tsx
import React from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import InputField from "@/components/common/InputField";

const Login = () => {
  const router = useRouter();

  return (
    <View style={tw`flex-1 bg-background p-5`}>
      <Logo />
      <Text style={tw`text-center text-xl font-bold font-montserratBold mt-5`}>
        Welcome Back!
      </Text>
      <Text style={tw`text-center text-base text-gray-500 my-2`}>
        Use Credentials to access your account
      </Text>
      <InputField placeholder="Enter Username" iconName="user" />
      <InputField
        placeholder="Enter Password"
        iconName="lock"
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={() => {}} style={tw`self-end mt-2`}>
        <Text style={tw`text-primary`}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button title="Login" onPress={() => {}} />
      <View style={tw`flex-row justify-center items-center mt-5`}>
        <Text style={tw`text-gray-500`}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={tw`text-primary ml-1`}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
