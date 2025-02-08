import React from "react";
import { View, Text, Image as RNImage, TouchableOpacity, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import { dummyImageUrl } from "@/constants/statics";

interface ImageType {
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
  images: ImageType[];
  onPressShow: () => void;
  style?: any;
  isLoading?: boolean;
}

const BigBoyCard: React.FC<BigBoyCardProps> = ({
  title,
  date,
  category,
  images,
  onPressShow,
  style,
  isLoading = false
}) => {
  const { isDarkMode, colors } = useTheme();
  const imageUrl = images.length > 0 ? images[0].url : dummyImageUrl;

  return (
    <Pressable
      onPress={onPressShow}
      style={[
        tw`mr-4 rounded-lg overflow-hidden w-80 my-2 ${style}`,
        { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
      ]}
      disabled={isLoading}
    >
      {isLoading ? (
        <View style={tw`absolute z-10 w-full h-full justify-center items-center bg-black/30`}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : null}
      <View style={tw`relative w-full`}>
        <RNImage source={{ uri: imageUrl }} style={tw`w-full h-48`} />
        <Pressable
          style={[
            tw`absolute top-2 left-2 rounded p-1`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
          ]}
        >
          <Text style={{ color: isDarkMode ? colors.text : colors.text }}>{category}</Text>
        </Pressable>
        {/* <TouchableOpacity
          style={tw`absolute top-2 right-2 bg-white p-1 rounded-full`}
          onPress={onPressFavorite}
        >
          <FontAwesome name="heart-o" size={20} color="red" />
        </TouchableOpacity> */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,1)"]}
          style={tw`absolute bottom-0 left-0 right-0 h-24`}
        />
        <View style={tw`absolute bottom-4 left-4`}>
          <Text style={tw`text-2xl font-bold text-white py-1`}>{title}</Text>
          <Text style={tw`text-lg text-white`}>
            {new Date(date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default BigBoyCard;
