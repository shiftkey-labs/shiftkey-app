import React from "react";
import { View, Text } from "react-native";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";

interface TimelineHeaderProps {
  date: Date;
  isToday?: boolean;
  isTomorrow?: boolean;
  eventCount: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  date,
  isToday = false,
  isTomorrow = false,
  eventCount,
}) => {
  const { colors } = useTheme();

  const getHeaderTitle = () => {
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    
    // Format as "Monday, January 15"
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getDateSubtitle = () => {
    if (isToday || isTomorrow) {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
    return null;
  };

  return (
    <View style={tw`mb-4 mt-6`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1`}>
          <Text
            style={{
              color: colors.text,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {getHeaderTitle()}
          </Text>
          {getDateSubtitle() && (
            <Text
              style={{
                color: colors.gray,
                fontSize: 16,
                marginTop: 2,
              }}
            >
              {getDateSubtitle()}
            </Text>
          )}
        </View>
        <View
          style={[
            tw`px-3 py-1 rounded-full`,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {eventCount} {eventCount === 1 ? "event" : "events"}
          </Text>
        </View>
      </View>
      <View
        style={[
          tw`h-px mt-3`,
          { backgroundColor: colors.gray + "30" },
        ]}
      />
    </View>
  );
};

export default TimelineHeader;