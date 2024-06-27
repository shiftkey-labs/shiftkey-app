import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "../styles/tailwind";
import eventsData from "@/constants/eventsData";
import { FontAwesome } from "@expo/vector-icons";

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const event = eventsData.find((event) => event.id === id);

  if (!event) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-xl`}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-background`}>
      <Image source={event.image} style={tw`w-full h-56`} />
      <View style={tw`p-5`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-2xl font-montserratBold`}>Event Details</Text>
          <TouchableOpacity style={tw`bg-primary p-2 rounded-lg`}>
            <Text style={tw`text-white`}>Invite</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center mt-4`}>
          <Image
            source={event.details.speakerImage}
            style={tw`w-12 h-12 rounded-full`}
          />
          <View style={tw`ml-3`}>
            <Text style={tw`text-lg font-bold`}>{event.details.speaker}</Text>
            <Text style={tw`text-gray-500`}>Speaker</Text>
          </View>
        </View>

        <Text style={tw`text-3xl font-montserratBold mt-5`}>{event.title}</Text>
        <View style={tw`flex-row items-center mt-3`}>
          <FontAwesome
            name="calendar"
            size={24}
            color="gray"
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-600`}>{event.date}</Text>
        </View>
        <View style={tw`flex-row items-center mt-3`}>
          <FontAwesome
            name="map-marker"
            size={24}
            color="gray"
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-600`}>{event.details.venue}</Text>
        </View>

        <Text style={tw`text-lg font-bold mt-5`}>About Event</Text>
        <Text style={tw`text-gray-600 mt-2`}>{event.details.description}</Text>

        <TouchableOpacity style={tw`bg-primary p-4 rounded-lg mt-5`}>
          <Text style={tw`text-white text-center`}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventDetails;
