import { StatusBar } from "expo-status-bar";
import { Platform, Image, TouchableOpacity } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import tw from "./styles/tailwind";
import { useRouter } from "expo-router";

export default function ModalScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

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
          Point this QR code to the scan place
        </Text>
        <Image
          source={require("@/assets/images/events/qr-code.png")}
          style={tw`w-48 h-48`}
        />
        <Text style={tw`text-xl font-montserratBold mt-5`}>DWP IV X AW</Text>
        <View style={tw`flex-row justify-between w-full mt-5`}>
          <View>
            <Text style={tw`text-gray-500`}>Full Name</Text>
            <Text style={tw`font-bold`}>Vansh</Text>
          </View>
          <View>
            <Text style={tw`text-gray-500`}>Hours</Text>
            <Text style={tw`font-bold`}>10.00AM</Text>
          </View>
        </View>
        <View style={tw`w-full mt-5`}>
          <Text style={tw`text-gray-500`}>Date</Text>
          <Text style={tw`font-bold`}>27 Dec 2023</Text>
        </View>
      </View>
    </View>
  );
}
