import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import tw from "@/app/styles/tailwind";

export default function AuthLayout() {
  return (
    <View style={tw`flex-1`}>
      <Stack>
        <Stack.Screen name="[eventId]" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
