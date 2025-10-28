import React from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "./styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import { observer } from "@legendapp/state/react";
import state from "@/state";
import Logo from "@/components/common/Logo";

const UpdateRequired = observer(() => {
  const { colors } = useTheme();
  const appStatus = state.app.appState.get();

  const handleCloseApp = () => {
    // Close the app
    BackHandler.exitApp();
  };

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: colors.background }]}
    >
      <View style={tw`flex-1 justify-center items-center px-8`}>
        <Logo />

        <Text
          style={{
            color: colors.text,
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 32,
            marginBottom: 16,
          }}
        >
          Update Required
        </Text>

        <Text
          style={{
            color: colors.gray,
            fontSize: 16,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          A new version of the app is required to continue.
        </Text>

        {appStatus.latestVersion ? (
          <Text
            style={{
              color: colors.gray,
              fontSize: 16,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Please update to version {appStatus.latestVersion}
          </Text>
        ) : (
          <Text
            style={{
              color: colors.gray,
              fontSize: 16,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Please update to the latest version.
          </Text>
        )}

        <TouchableOpacity
          style={[
            tw`px-8 py-4 rounded-full`,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleCloseApp}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Close App
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

export default UpdateRequired;
