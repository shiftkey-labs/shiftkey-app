import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "@/app/styles/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface MultiDaySessionCardProps {
  dayNumber: number;
  date: Date;
  eventStartDate?: string;
  multipleDayType?: string;
  onMarkAttendance: () => void;
}

const MultiDaySessionCard: React.FC<MultiDaySessionCardProps> = ({
  dayNumber,
  date,
  eventStartDate,
  multipleDayType,
  onMarkAttendance,
}) => {
  const { isDarkMode, colors } = useTheme();

  const formatSessionDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSessionTime = (eventStartDate?: string) => {
    if (!eventStartDate) return "Time TBD";

    try {
      const startDate = new Date(eventStartDate);
      return startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Time TBD";
    }
  };

  const getSessionTitle = () => {
    return multipleDayType === "Weekly"
      ? `Week ${dayNumber}`
      : `Day ${dayNumber}`;
  };

  const isPastSession = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate < today;
  };

  const isToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  };

  const past = isPastSession();
  const today = isToday();

  return (
    <View
      style={[
        tw`rounded-lg p-4 mb-3 shadow-sm`,
        {
          backgroundColor: isDarkMode ? colors.lightGray : colors.white,
          borderWidth: today ? 2 : 1,
          borderColor: today ? colors.primary : colors.gray + "30",
          opacity: past ? 0.7 : 1,
        },
      ]}
    >
      {/* Session Header */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center`}>
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {getSessionTitle()}
            </Text>
            {today && (
              <View
                style={[
                  tw`ml-2 rounded-full px-2 py-1`,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={{ color: colors.white, fontSize: 10, fontWeight: "bold" }}>
                  Today
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              color: colors.gray,
              fontSize: 14,
              marginTop: 2,
            }}
          >
            {formatSessionDate(date)}
          </Text>
          <Text
            style={{
              color: colors.gray,
              fontSize: 14,
              marginTop: 1,
            }}
          >
            {formatSessionTime(eventStartDate)}
          </Text>
        </View>

        {/* Status Icon */}
        <FontAwesome
          name="calendar"
          size={24}
          color={today ? colors.primary : colors.gray}
        />
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          tw`w-full p-3 rounded-lg`,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={onMarkAttendance}
      >
        <Text
          style={{
            color: colors.white,
            textAlign: "center",
            fontWeight: "semibold",
          }}
        >
          Mark Attendance
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MultiDaySessionCard;