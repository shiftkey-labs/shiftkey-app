import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/app/styles/tailwind";

interface SectionHeaderProps {
  title: string;
  onPressSeeAll: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onPressSeeAll,
}) => {
  return (
    <View style={tw`flex-row justify-between items-center mt-5 mb-3`}>
      <Text style={tw`font-bold text-lg`}>{title}</Text>
      {/* <TouchableOpacity onPress={onPressSeeAll}>
        <Text style={tw`text-primary`}>See All</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default SectionHeader;
