import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import tw from "@/app/styles/tailwind";
import { EventCardProps } from "@/types/event";

const dummyImageUrl =
  "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png";

const EventCard: React.FC<EventCardProps> = ({
  title,
  location,
  date,
  images,
  onPress,
  isLoading = false
}) => {
  const imageUrl = images ? images[0].url : dummyImageUrl;

  return (
    <TouchableOpacity
      style={tw`flex-row items-center bg-white rounded-lg mb-2 shadow-sm`}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isLoading}
    >
      {isLoading ? (
        <View style={tw`absolute z-10 w-full h-full justify-center items-center bg-black/30`}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : null}
      <Image source={{ uri: imageUrl }} style={tw`w-24 h-24 rounded-lg`} />
      <View style={tw`flex-1 ml-3 p-3`}>
        <Text style={tw`font-bold text-md w-full`}>{title}</Text>
        <Text style={tw`text-gray-500 mt-1`}>{location}</Text>
        <Text style={tw`text-gray-400 mt-1`}>
          {new Date(date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
