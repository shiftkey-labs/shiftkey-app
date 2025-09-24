import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import tw from "@/app/styles/tailwind";
import { EventCardProps, Event } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";
import { dummyImageUrl } from "@/constants/statics";
import { getMultiDayEventDayNumber } from "@/helpers/dateUtils";

const EventCard: React.FC<EventCardProps> = ({
  title,
  location,
  date,
  images,
  onPress,
  isLoading = false,
  staffOnly = false,
  event
}) => {
  const { isDarkMode, colors } = useTheme();
  const imageUrl = images?.length ? images[0].url : dummyImageUrl;

  // Calculate multi-day indicators
  const isMultiDay = event?.fields.isMultipleDays;
  const dayNumber = isMultiDay && event ? getMultiDayEventDayNumber(event) : null;
  const totalDays = event?.fields.numberOfMultipleDays;
  const dayType = event?.fields.multipleDayType;

  // Helper function to format date for event cards
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      // Format: "Jan 15, 2024 at 2:30 PM"
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return "Invalid date";
    }
  };

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
        <Image source={{ uri: imageUrl }} style={tw`w-24 h-24 rounded-lg`} />
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
        <View style={tw`flex-row items-start justify-between`}>
          <Text style={{ color: colors.text, fontWeight: 'bold', flex: 1 }}>{title}</Text>
          {isMultiDay && dayNumber && totalDays && (
            <View
              style={[
                tw`ml-2 rounded px-2 py-1`,
                { backgroundColor: colors.primary }
              ]}
            >
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {dayType === "Weekly" ? `Week ${dayNumber}/${totalDays}` : `Day ${dayNumber}/${totalDays}`}
              </Text>
            </View>
          )}
        </View>
        <Text style={{ color: colors.gray, marginTop: 4 }}>{location}</Text>
        <Text style={{ color: colors.gray, marginTop: 4 }}>
          {formatEventDate(date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
