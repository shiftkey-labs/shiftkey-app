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
  imageUrl,
  onPress,
  isLoading = false,
  staffOnly = false
}) => {
  const { isDarkMode, colors } = useTheme();
  const resolvedImageUrl =
    imageUrl || (images?.length ? images[0].url : dummyImageUrl);

  const formattedDate = (() => {
    if (!date) {
      return "Date to be announced";
    }
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return date;
    }
    return parsed.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  })();

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
      <View style={tw`relative`}>
        <Image
          source={{ uri: resolvedImageUrl }}
          style={tw`w-24 h-24 rounded-lg`}
          resizeMode="contain"
        />
        {staffOnly && (
          <View
            style={[
              tw`absolute top-1 right-1 rounded px-1`,
              { backgroundColor: colors.primary }
            ]}
          >
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>Staff Only</Text>
          </View>
        )}
      </View>
      <View style={tw`flex-1 ml-3 p-3`}>
        <Text style={{ color: colors.text, fontWeight: 'bold' }}>{title}</Text>
        <Text style={{ color: colors.gray, marginTop: 4 }}>
          {location || "Location TBA"}
        </Text>
        <Text style={{ color: colors.gray, marginTop: 4 }}>
          {formattedDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
