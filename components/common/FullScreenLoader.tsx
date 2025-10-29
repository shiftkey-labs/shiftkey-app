import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";

interface FullScreenLoaderProps {
  visible: boolean;
  message: string;
  subMessage?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  visible,
  message,
  subMessage = "Please wait...",
}) => {
  const { isDarkMode, colors } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <View style={[tw`absolute inset-0 items-center justify-center z-50`, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
      <View style={[tw`p-8 rounded-2xl items-center max-w-sm mx-4`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
        <ActivityIndicator size="large" color={colors.primary} style={tw`mb-4`} />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>
          {message}
        </Text>
        <Text style={{ color: colors.gray, fontSize: 14, textAlign: 'center' }}>
          {subMessage}
        </Text>
      </View>
    </View>
  );
};

export default FullScreenLoader;
