import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Text, View } from "@/components/Themed";
import tw from "./styles/tailwind";
import { useRouter } from "expo-router";
import state from "./state";
import { useTheme } from "@/context/ThemeContext";

export default function ModalScreen() {
  const router = useRouter();
  const user = state.user.userState.get();
  const currentEvent = state.event.eventState.currentEvent.get();
  const qrRef = useRef(null);
  const { isDarkMode, colors } = useTheme();

  const qrCodeValue = user.id + "~" + new Date().toISOString() + "~" + currentEvent.id;

  const handleBack = () => {
    router.back();
  };

  const eventDate = new Date(currentEvent.fields.startDate);
  const eventTime = eventDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[tw`flex-1 p-5`, { backgroundColor: isDarkMode ? colors.background : colors.background }]}>
      <TouchableOpacity onPress={handleBack} style={tw`mb-5`}>
        <Text style={{ color: colors.primary }}>Back</Text>
      </TouchableOpacity>
      <View style={[tw`items-center mb-5`, { backgroundColor: isDarkMode ? colors.background : colors.background }]}>
        <Text style={[tw`text-2xl font-montserratBold mb-5`, { color: colors.text }]}>View Ticket</Text>
        <Text style={[tw`text-lg font-montserratBold mb-2`, { color: colors.text }]}>
          Scan This QR Code
        </Text>
        <Text style={[tw`text-center mb-5`, { color: colors.gray }]}>
          Point this QR code at the scanner
        </Text>
        <QRCode
          value={qrCodeValue}
          size={200}
          backgroundColor={isDarkMode ? colors.background : colors.white}
          color={isDarkMode ? colors.text : colors.black}
          ref={qrRef}
        />
        <Text style={[tw`text-xl font-montserratBold mt-5`, { color: colors.text }]}>
          {currentEvent.fields.eventName || "Event Title"}
        </Text>
        <View style={[tw`flex-row justify-between w-full mt-5`, { backgroundColor: isDarkMode ? colors.background : colors.background }]}>
          <View style={{ backgroundColor: isDarkMode ? colors.background : colors.background }}>
            <Text style={{ color: colors.gray }}>Full Name</Text>
            <Text style={[tw`font-bold`, { color: colors.text }]}>
              {user.firstName + " " + user.lastName}
            </Text>
          </View>
          {eventTime !== "12:00 AM" && (
            <View style={{ backgroundColor: isDarkMode ? colors.background : colors.background }}>
              <Text style={{ color: colors.gray }}>Hours</Text>
              <Text style={[tw`font-bold`, { color: colors.text }]}>
                {eventTime}
              </Text>
            </View>
          )}
        </View>
        <View style={[tw`w-full mt-5`, { backgroundColor: isDarkMode ? colors.background : colors.background }]}>
          <Text style={{ color: colors.gray }}>Date</Text>
          <Text style={[tw`font-bold`, { color: colors.text }]}>
            {eventDate.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </View>
  );
}
