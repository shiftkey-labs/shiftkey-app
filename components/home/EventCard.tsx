import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "@/app/styles/tailwind";

interface Image {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: {
      url: string;
      width: number;
      height: number;
    };
    large: {
      url: string;
      width: number;
      height: number;
    };
    full: {
      url: string;
      width: number;
      height: number;
    };
  };
}

interface EventCardProps {
  title: string;
  location: string;
  date: string;
  images: Image[];
  onPress: () => void;
}

const dummyImageUrl = "https://example.com/dummy-image.png";

const EventCard: React.FC<EventCardProps> = ({
  title,
  location,
  date,
  images,
  onPress,
}) => {
  // Extract the first image URL if available, otherwise use a dummy image URL
  const imageUrl = images.length > 0 ? images[0].url : dummyImageUrl;

  return (
    <TouchableOpacity
      style={tw`flex-row items-center bg-white rounded-lg mb-2 shadow-sm`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: imageUrl }} style={tw`w-24 h-24 rounded-lg`} />
      <View style={tw`flex-1 ml-3 p-3`}>
        <Text style={tw`font-bold text-md w-full`}>{title}</Text>
        <Text style={tw`text-gray-500 mt-1`}>{location}</Text>
        <Text style={tw`text-gray-400 mt-1`}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
