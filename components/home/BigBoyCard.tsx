import React from "react";
import {
  View,
  Text,
  Image as RNImage,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import { dummyImageUrl } from "@/constants/statics";
import { Event } from "@/types/event";
import { getMultiDayEventDayNumber } from "@/helpers/dateUtils";

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
  startTime?: string;
  endTime?: string;
  category: string;
  images: ImageType[];
  onPressShow: () => void;
  style?: any;
  isLoading?: boolean;
  staffOnly?: boolean;
  event?: Event;
}

const BigBoyCard: React.FC<BigBoyCardProps> = ({
  title,
  date,
  startTime,
  endTime,
  category,
  images,
  onPressShow,
  style,
  isLoading = false,
  staffOnly = false,
  event,
}) => {
  const { isDarkMode, colors } = useTheme();
  const imageUrl = images.length > 0 ? images[0].url : dummyImageUrl;

  // Calculate multi-day indicators
  const isMultiDay = event?.fields.isMultipleDays;
  const dayNumber = isMultiDay && event ? getMultiDayEventDayNumber(event) : null;
  const totalDays = event?.fields.numberOfMultipleDays;
  const dayType = event?.fields.multipleDayType;

  return (
    <Pressable
      onPress={onPressShow}
      style={[
        tw`mr-4 rounded-lg overflow-hidden w-80 my-2`,
        {
          backgroundColor: isDarkMode ? colors.lightGray : colors.white,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        style,
      ]}
      disabled={isLoading}
    >
      {isLoading ? (
        <View
          style={tw`absolute z-10 w-full h-full justify-center items-center bg-black/30`}
        >
          <ActivityIndicator size='large' color='#ffffff' />
        </View>
      ) : null}

      {/* Image Section */}
      <View style={tw`relative w-full p-4 pb-0`}>
        <View
          style={tw`relative w-full h-48 rounded-lg overflow-hidden bg-gray-100`}
        >
          <RNImage source={{ uri: imageUrl }} style={tw`w-full h-full`} />
        </View>

        {/* Category Badge */}
        <Pressable
          style={[
            tw`absolute top-7 left-7 rounded-full px-3 py-1`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
          ]}
        >
          <Text
            style={[
              tw`text-sm font-medium`,
              { color: isDarkMode ? colors.text : colors.text },
            ]}
          >
            {category}
          </Text>
        </Pressable>

        {/* Staff Only Badge */}
        {staffOnly && (
          <View
            style={[
              tw`absolute top-7 right-7 rounded-full px-3 py-1`,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
              Staff Only
            </Text>
          </View>
        )}

        {/* Multi-day Event Badge */}
        {isMultiDay && dayNumber && totalDays && (
          <View
            style={[
              tw`absolute bottom-7 left-7 rounded-full px-3 py-1`,
              { backgroundColor: 'rgba(0,0,0,0.7)' },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
              {dayType === "Weekly" ? `Week ${dayNumber} of ${totalDays}` : `Day ${dayNumber} of ${totalDays}`}
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={tw`p-4`}>
        {/* Time Display */}
        {(startTime || endTime) && (
          <Text
            style={[
              tw`text-sm mb-2`,
              { color: isDarkMode ? colors.gray : "#6b7280" },
            ]}
          >
            {startTime && endTime
              ? `${startTime} - ${endTime}`
              : startTime || endTime}
          </Text>
        )}

        {/* Title */}
        <Text
          style={[
            tw`text-xl font-bold mb-3 leading-6`,
            { color: isDarkMode ? colors.text : "#1a1a1a" },
          ]}
          numberOfLines={3}
        >
          {title}
        </Text>

        {/* Date and Time */}
        <View style={tw`flex-row items-center`}>
          <Text
            style={[
              tw`text-sm`,
              { color: isDarkMode ? colors.gray : "#6b7280" },
            ]}
          >
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default BigBoyCard;
