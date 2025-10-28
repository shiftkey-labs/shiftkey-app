import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  size?: "small" | "large";
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  size = "large",
}) => {
  const { colors } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <View style={tw`absolute inset-0 justify-center items-center`}>
      <View style={tw`absolute inset-0 bg-black/30`} />
      <View style={tw`items-center`}>
        <ActivityIndicator size={size} color={colors.white} />
        {message ? (
          <Text style={{ color: colors.white, marginTop: 8 }}>{message}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default LoadingOverlay;
