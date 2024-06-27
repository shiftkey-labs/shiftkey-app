import tw from "@/app/styles/tailwind";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-primary rounded-lg p-4 mt-4`}
    >
      <Text style={tw`text-white text-center text-base font-bold`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
