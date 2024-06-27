// app/(auth)/signup.tsx
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

import { Picker } from "@react-native-picker/picker";
import CheckBox from "@react-native-community/checkbox";
import tw from "../styles/tailwind";
import { signUpUser } from "@/helpers/authHelpers";
import { saveUserDetails } from "@/helpers/userHelpers";
import state from "../state";

const Signup = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    program: "",
    year: "",
    isInternational: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const user = await signUpUser(form.email, form.password, form.name);
      await saveUserDetails(user.uid, {
        name: form.name,
        email: form.email,
        university: form.university,
        program: form.program,
        year: form.year,
        isInternational: form.isInternational,
      });
      state.user.set({
        uid: user.uid,
        name: form.name,
        email: form.email,
        university: form.university,
        program: form.program,
        year: form.year,
        isInternational: form.isInternational,
      });
      router.push("/");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-1 justify-center p-5`}>
        <Text style={tw`text-3xl font-montserratBold text-center mb-5`}>
          Sign Up
        </Text>
        <TextInput
          style={tw`border p-3 rounded mb-3`}
          placeholder="Name"
          value={form.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        <TextInput
          style={tw`border p-3 rounded mb-3`}
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
        />
        <TextInput
          style={tw`border p-3 rounded mb-3`}
          placeholder="Password"
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
        />
        <TextInput
          style={tw`border p-3 rounded mb-3`}
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          secureTextEntry
        />
        <View style={tw`border p-3 rounded mb-3`}>
          <Picker
            selectedValue={form.university}
            onValueChange={(value) => handleChange("university", value)}
          >
            <Picker.Item label="Select University" value="" />
            <Picker.Item label="University A" value="University A" />
            <Picker.Item label="University B" value="University B" />
            {/* Add more universities as needed */}
          </Picker>
        </View>
        <TextInput
          style={tw`border p-3 rounded mb-3`}
          placeholder="Program Studying"
          value={form.program}
          onChangeText={(value) => handleChange("program", value)}
        />
        <TextInput
          style={tw`border p-3 rounded mb-3`}
          placeholder="Year of Study"
          value={form.year}
          onChangeText={(value) => handleChange("year", value)}
        />
        <View style={tw`flex-row items-center mb-5`}>
          <CheckBox
            value={form.isInternational}
            onValueChange={(value) => handleChange("isInternational", value)}
          />
          <Text style={tw`ml-2`}>Are you an international student?</Text>
        </View>
        <TouchableOpacity
          style={tw`bg-primary p-4 rounded mb-3`}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={tw`text-white text-center`}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={tw`text-center text-primary`}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
