import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Text, View } from "@/components/Themed";
import tw from "./styles/tailwind";
import { useRouter } from "expo-router";
import state from "./state";

export default function ModalScreen() {
  const router = useRouter();
  const user = state.user.userState.get();
  const currentEvent = state.event.eventState.currentEvent.get();
  const qrRef = useRef(null);  

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
    <View style={tw`flex-1 bg-background p-5`}>
      <TouchableOpacity onPress={handleBack} style={tw`mb-5`}>
        <Text style={tw`text-primary`}>Back</Text>
      </TouchableOpacity>
      <View style={tw`items-center mb-5`}>
        <Text style={tw`text-2xl font-montserratBold mb-5`}>View Ticket</Text>
        <Text style={tw`text-lg font-montserratBold mb-2`}>
          Scan This QR Code
        </Text>
        <Text style={tw`text-center text-gray-600 mb-5`}>
          Point this QR code at the scanner
        </Text>
        <QRCode
          value={qrCodeValue}
          size={200}
          backgroundColor="white"
          color="black"
          ref={qrRef}
        />
        <Text style={tw`text-xl font-montserratBold mt-5`}>
          {currentEvent.fields.eventName || "Event Title"}
        </Text>
        <View style={tw`flex-row justify-between w-full mt-5`}>
          <View>
            <Text style={tw`text-gray-500`}>Full Name</Text>
            <Text style={tw`font-bold`}>
              {user.firstName + " " + user.lastName}
            </Text>
          </View>
          {eventTime !== "12:00 AM" && (
            <View>
              <Text style={tw`text-gray-500`}>Hours</Text>
              <Text style={tw`font-bold`}>{eventTime}</Text>
            </View>
          )}
        </View>
        <View style={tw`w-full mt-5`}>
          <Text style={tw`text-gray-500`}>Date</Text>
          <Text style={tw`font-bold`}>{eventDate.toLocaleDateString()}</Text>
        </View>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
