import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";

interface UpdateBannerProps {
  latestVersion?: string | null;
  onDismiss?: () => void;
}

const UpdateBanner: React.FC<UpdateBannerProps> = ({
  latestVersion,
  onDismiss,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  // Position above tab bar (tab bar is ~80px, add some padding)
  const bottomOffset = Math.max(bottom, 16) + 90;

  const message = latestVersion
    ? `App update (${latestVersion}) available. Please update soon.`
    : "App update available. Please update soon.";

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: bottomOffset,
        zIndex: 9999,
      }}
    >
      <View
        style={[
          tw`rounded-2xl flex-row items-center`,
          {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 6,
            elevation: 6,
            maxWidth: 420,
            alignSelf: "center",
          },
        ]}
      >
        <Text
          style={{
            color: colors.white,
            fontWeight: "600",
            flex: 1,
            marginRight: 12,
          }}
          numberOfLines={2}
        >
          {message}
        </Text>
        {onDismiss ? (
          <TouchableOpacity
            onPress={onDismiss}
            style={tw`px-2 py-1`}
            accessibilityRole="button"
            accessibilityLabel="Dismiss update notification"
          >
            <Text style={{ color: colors.white, fontWeight: "700" }}>X</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default UpdateBanner;
