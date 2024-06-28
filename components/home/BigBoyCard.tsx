import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "@/app/styles/tailwind";

interface BigBoyCardProps {
  title: string;
  date: string;
  category: string;
  image: any;
  onPressShow: () => void;
  onPressFavorite: () => void;
}

const BigBoyCard: React.FC<BigBoyCardProps> = ({
  title,
  date,
  category,
  image,
  onPressShow,
  onPressFavorite,
}) => {
  return (
    <TouchableOpacity
      onPress={onPressShow}
      style={tw`mr-4 bg-white rounded-lg overflow-hidden w-80`}
    >
      <View style={tw`relative w-100`}>
        <Image source={{ uri: image }} style={tw`w-100 h-90`} />
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
          style={tw`absolute bottom-0 left-0 right-0 h-48`}
        />
        <View style={tw`absolute w-70 bottom-4 left-4`}>
          <Text style={tw`text-2xl font-bold text-white py-2`}>{title}</Text>
          <Text style={tw`text-lg text-white`}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BigBoyCard;
