import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface ShiftEventCardProps {
  title: string;
  location?: string | null;
  date: string;
  totalAvailableShifts: number;
  onPress: () => void;
}

const ShiftEventCard: React.FC<ShiftEventCardProps> = ({
  title,
  location,
  date,
  totalAvailableShifts,
  onPress,
}) => {
  const { isDarkMode, colors } = useTheme();

  // Helper function to format date for event cards
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      // Format: "Jan 15, 2024"
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <TouchableOpacity
      style={[
        tw`rounded-xl p-4 mb-3 shadow-sm`,
        {
          backgroundColor: isDarkMode ? colors.lightGray : colors.white,
          borderWidth: 1,
          borderColor: isDarkMode ? colors.background : colors.lightGray + "40",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={tw`flex-row items-start justify-between`}>
        {/* Left side - Event info */}
        <View style={tw`flex-1 mr-4`}>
          <Text
            style={[tw`text-lg font-bold mb-2`, { color: colors.text }]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {location && (
            <View style={tw`flex-row items-center mb-2`}>
              <Ionicons
                name='location-outline'
                size={16}
                color={colors.gray}
                style={tw`mr-2`}
              />
              <Text
                style={[tw`text-sm flex-1`, { color: colors.gray }]}
                numberOfLines={1}
              >
                {location}
              </Text>
            </View>
          )}

          <View style={tw`flex-row items-center`}>
            <Ionicons
              name='calendar-outline'
              size={16}
              color={colors.gray}
              style={tw`mr-2`}
            />
            <Text style={[tw`text-sm`, { color: colors.gray }]}>
              {formatEventDate(date)}
            </Text>
          </View>
        </View>

        {/* Right side - Available shifts indicator */}
        <View style={tw`items-center justify-center`}>
          <View
            style={[
              tw`w-16 h-16 rounded-full justify-center items-center mb-2`,
              {
                backgroundColor: colors.primary + "20",
                borderWidth: 2,
                borderColor: colors.primary + "40",
              },
            ]}
          >
            <Text style={[tw`text-2xl font-bold`, { color: colors.primary }]}>
              {totalAvailableShifts}
            </Text>
          </View>
          <Text
            style={[
              tw`text-xs text-center font-medium`,
              { color: colors.primary },
            ]}
          >
            {totalAvailableShifts === 1 ? "Shift" : "Shifts"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ShiftEventCard;
