// components/SearchBar.tsx
import React from "react";
import { View, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/app/styles/tailwind";

const SearchBar = () => {
  return (
    <View
      style={tw`flex-row items-center bg-gray-200 p-2 rounded-full shadow-md`}
    >
      <FontAwesome name="search" size={20} color="gray" style={tw`ml-2`} />
      <TextInput placeholder="Search" style={tw`flex-1 ml-2 text-base`} />
      <FontAwesome name="sliders" size={20} color="gray" style={tw`mr-2`} />
    </View>
  );
};

export default SearchBar;
