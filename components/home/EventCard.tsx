import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "@/app/styles/tailwind";

interface EventCardProps {
  title: string;
  location: string;
  date: string;
  image: any;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center bg-white rounded-lg mb-2 shadow-sm`}
      onPress={onPress}
    >
      <Image source={{ uri: image }} style={tw`w-24 h-24 rounded-lg`} />
      <View style={tw`flex-1 ml-3 p-3`}>
        <Text style={tw`font-bold text-md w-50`}>{title}</Text>
        <Text style={tw`text-gray-500 mt-2`}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
