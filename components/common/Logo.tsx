// src/components/Logo.tsx
import tw from "@/app/styles/tailwind";
import React from "react";
import { Image, View } from "react-native";

const Logo = () => {
  return (
    <View style={tw`items-center mb-10`}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={tw`w-70 h-30`}
      />
    </View>
  );
};

export default Logo;
