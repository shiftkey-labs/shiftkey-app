// src/components/Logo.tsx
import tw from "@/app/styles/tailwind";
import React from "react";
import { Image, View } from "react-native";

const Logo = () => {
  return (
    <View style={tw`items-center mt-10`}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={tw`w-80 h-35`}
      />
    </View>
  );
};

export default Logo;
