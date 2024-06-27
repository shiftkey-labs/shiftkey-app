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
  location,
  date,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center p-3 bg-white rounded-lg mb-2 shadow-sm`}
      onPress={onPress}
    >
      <Image source={image} style={tw`w-16 h-16 rounded-lg`} />
      <View style={tw`flex-1 ml-3`}>
        <Text style={tw`font-montserratBold text-base`}>{title}</Text>
        <Text style={tw`text-gray-500`}>{location}</Text>
        <Text style={tw`text-gray-500`}>{date}</Text>
      </View>
      <TouchableOpacity
        style={tw`bg-primary p-2 rounded-full`}
        onPress={onPress}
      >
        <Text style={tw`text-white text-center`}>Join</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default EventCard;
