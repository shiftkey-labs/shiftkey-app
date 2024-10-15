import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

interface BigBoyCardProps {
  title: string;
  date: string;
  category: string;
  images: Image[];
  onPressShow: () => void;
  onPressFavorite: () => void;
  style?: any;
}

const dummyImageUrl = "https://example.com/dummy-image.png";

const BigBoyCard: React.FC<BigBoyCardProps> = ({
  title,
  date,
  category,
  images,
  onPressShow,
  onPressFavorite,
  style,
}) => {
  // Extract the first image URL if available, otherwise use a dummy image URL
  const imageUrl = images.length > 0 ? images[0].url : dummyImageUrl;

  return (
    <TouchableOpacity
      onPress={onPressShow}
      style={tw`mr-4 bg-white rounded-lg overflow-hidden w-80 ${style}`}
    >
      <View style={tw`relative w-full`}>
        <Image source={{ uri: imageUrl }} style={tw`w-full h-48`} />
        <TouchableOpacity
          style={tw`absolute top-2 left-2 bg-white rounded p-1`}
        >
          <Text style={tw`text-sm font-bold`}>{category}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`absolute top-2 right-2 bg-white p-1 rounded-full`}
          onPress={onPressFavorite}
        >
          <FontAwesome name="heart-o" size={20} color="red" />
        </TouchableOpacity>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,1)"]}
          style={tw`absolute bottom-0 left-0 right-0 h-24`}
        />
        <View style={tw`absolute bottom-4 left-4`}>
          <Text style={tw`text-2xl font-bold text-white py-1`}>{title}</Text>
          <Text style={tw`text-lg text-white`}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BigBoyCard;
