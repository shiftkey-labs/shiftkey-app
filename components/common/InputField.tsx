// src/components/InputField.tsx
import React from "react";
import { View, TextInput, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/app/styles/tailwind";

interface InputFieldProps {
  placeholder: string;
  iconName: string;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  iconName,
  secureTextEntry = false,
}) => {
  return (
    <View
      style={tw`flex-row items-center border border-gray-300 rounded-lg p-3 my-2`}
    >
      {/* <FontAwesome name={iconName} size={20} color="gray" style={tw`mr-2`} /> */}
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={tw`flex-1 text-base`}
      />
    </View>
  );
};

export default InputField;
