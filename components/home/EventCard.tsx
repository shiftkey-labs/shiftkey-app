import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import tw from "@/app/styles/tailwind";
import { EventCardProps } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";
import { dummyImageUrl } from "@/constants/statics";

const EventCard: React.FC<EventCardProps> = ({
  title,
  location,
  date,
  images,
  onPress,
  isLoading = false
}) => {
  const { isDarkMode, colors } = useTheme();
  const imageUrl = images?.length ? images[0].url : dummyImageUrl;

  return (
    <TouchableOpacity
      style={[
        tw`flex-row items-center rounded-lg mb-2 shadow-sm`,
        { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
      ]}
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
        <Text style={{ color: colors.text, fontWeight: 'bold' }}>{title}</Text>
        <Text style={{ color: colors.gray, marginTop: 4 }}>{location}</Text>
        <Text style={{ color: colors.gray, marginTop: 4 }}>
          {new Date(date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
