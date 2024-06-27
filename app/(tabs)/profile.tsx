import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import tw from "../styles/tailwind";
import { FontAwesome } from "@expo/vector-icons";

const Profile = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <ScrollView style={tw`flex-1 bg-background p-5`}>
        <View style={tw`items-center mb-5`}>
          <Image
            source={require("@/assets/images/events/vansh.png")}
            style={tw`w-24 h-24 rounded-full mb-3`}
          />
          <Text style={tw`text-2xl font-montserratBold`}>John Doe</Text>
          <Text style={tw`text-gray-600`}>johndoe@example.com</Text>
        </View>
        <View style={tw`bg-white p-5 rounded-lg shadow-md mb-5`}>
          <Text style={tw`text-lg font-montserratBold mb-3`}>
            Account Settings
          </Text>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mb-3`}
            onPress={() => console.log("Edit Profile pressed")}
          >
            <Text style={tw`text-gray-700`}>Edit Profile</Text>
            <FontAwesome name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mb-3`}
            onPress={() => console.log("Change Password pressed")}
          >
            <Text style={tw`text-gray-700`}>Change Password</Text>
            <FontAwesome name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mb-3`}
            onPress={() => console.log("Notifications pressed")}
          >
            <Text style={tw`text-gray-700`}>Notifications</Text>
            <FontAwesome name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={tw`bg-white p-5 rounded-lg shadow-md`}>
          <Text style={tw`text-lg font-montserratBold mb-3`}>More Options</Text>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mb-3`}
            onPress={() => console.log("Privacy Policy pressed")}
          >
            <Text style={tw`text-gray-700`}>Privacy Policy</Text>
            <FontAwesome name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mb-3`}
            onPress={() => console.log("Terms of Service pressed")}
          >
            <Text style={tw`text-gray-700`}>Terms of Service</Text>
            <FontAwesome name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between mb-3`}
            onPress={() => console.log("Help & Support pressed")}
          >
            <Text style={tw`text-gray-700`}>Help & Support</Text>
            <FontAwesome name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between`}
            onPress={() => console.log("Logout pressed")}
          >
            <Text style={tw`text-red-600`}>Logout</Text>
            <FontAwesome name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
