import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/app/styles/tailwind";
import { EventCardProps } from "@/types/event";
import { useTheme } from "@/context/ThemeContext";
import { dummyImageUrl } from "@/constants/statics";
import { formatTimeFromDate } from "@/helpers/dateUtils";

interface TimelineEventCardProps extends EventCardProps {
  showTime?: boolean;
}

const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  title,
  location,
  date,
  images,
  onPress,
  isLoading = false,
  staffOnly = false,
  showTime = true,
}) => {
  const { isDarkMode, colors } = useTheme();
  const imageUrl = images?.length ? images[0].url : dummyImageUrl;

  return (
    <TouchableOpacity
      style={[
        tw`flex-row items-center rounded-lg mb-3 shadow-sm`,
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
      
      {/* Time Column */}
      {showTime && (
        <View style={tw`px-4 py-4 items-center justify-center min-w-20`}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {formatTimeFromDate(date)}
          </Text>
        </View>
      )}
      
      {/* Event Image */}
      <View style={tw`relative`}>
        <Image source={{ uri: imageUrl }} style={tw`w-20 h-20 rounded-lg`} />
        {staffOnly && (
          <View
            style={[
              tw`absolute -top-1 -right-1 rounded px-1`,
              { backgroundColor: colors.primary }
            ]}
          >
            <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>STAFF</Text>
          </View>
        )}
      </View>
      
      {/* Event Details */}
      <View style={tw`flex-1 ml-4 py-4 pr-4`}>
        <Text 
          style={{ 
            color: colors.text, 
            fontWeight: 'bold',
            fontSize: 16,
          }}
          numberOfLines={2}
        >
          {title}
        </Text>
        
        {location && (
          <View style={tw`flex-row items-center mt-2`}>
            <FontAwesome 
              name="map-marker" 
              size={12} 
              color={colors.gray}
              style={tw`mr-2`} 
            />
            <Text 
              style={{ 
                color: colors.gray, 
                fontSize: 14,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>
        )}
      </View>
      
      {/* Chevron */}
      <View style={tw`px-4`}>
        <FontAwesome 
          name="chevron-right" 
          size={14} 
          color={colors.gray} 
        />
      </View>
    </TouchableOpacity>
  );
};

export default TimelineEventCard;