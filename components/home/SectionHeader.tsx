import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";

interface SectionHeaderProps {
  title: string;
  onPressSeeAll: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onPressSeeAll,
}) => {
  const { isDarkMode, colors } = useTheme();

  return (
    <View style={tw`flex-row justify-between items-center mt-5 mb-3`}>
      <Text style={{ color: isDarkMode ? colors.text : colors.text, fontSize: 18, fontWeight: 'bold' }}>
        {title}
      </Text>
      {/* <TouchableOpacity onPress={onPressSeeAll}>
        <Text style={{ color: isDarkMode ? colors.primary : colors.primary }}>See All</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default SectionHeader;
