// src/app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import Logo from "@/components/common/Logo";
import { auth } from "@/config/firebaseConfig";
import InputField from "@/components/common/InputField";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      Alert.alert("Login Error", error.message);
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
      />
      <TextInput
        style={tw`border p-3 rounded mb-5`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={tw`bg-primary p-4 rounded mb-3`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={tw`text-white text-center`}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={tw`text-center text-primary`}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
