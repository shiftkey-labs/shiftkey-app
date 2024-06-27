import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
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
    <View style={tw`mr-4`}>
      <View style={tw`relative w-80`}>
        <Image source={{ uri: image }} style={tw`w-80 h-40 rounded-lg`} />
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
      </View>
      <View style={tw`bg-white p-4 rounded-lg mt-2`}>
        <Text style={tw`font-bold text-base`}>{title}</Text>
        <Text style={tw`text-gray-500`}>{date}</Text>
        <TouchableOpacity
          style={tw`bg-primary p-2 rounded mt-2`}
          onPress={onPressShow}
        >
          <Text style={tw`text-white text-center`}>Show</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BigBoyCard;
