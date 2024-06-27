import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import tw from "@/app/styles/tailwind";

export default function AuthLayout() {
  return (
    <View style={tw`flex-1`}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
