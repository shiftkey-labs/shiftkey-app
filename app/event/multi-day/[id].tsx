import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "../../styles/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import state from "../../state";
import { useTheme } from "@/context/ThemeContext";
import { Event } from "@/types/event";
import { getMultiDayEventDates, formatTimeFromDate } from "@/helpers/dateUtils";
import MultiDaySessionCard from "@/components/home/MultiDaySessionCard";

const MultiDayEventDetails = () => {
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const curr: Event = state.event.eventState.currentEvent.get();
  const currentEvent = curr?.fields;
  const [loading, setLoading] = useState(true);
  const user = state.user.userState.get();

  const { isDarkMode, colors } = useTheme();

  // State for calculated event dates
  const [eventDates, setEventDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('🔄 Fetching multi-day event details for ID:', eventId);
        const eventData = await state.event.fetchEventDetails(eventId);
        console.log('📅 Multi-day event data loaded:', {
          eventName: eventData?.fields?.eventName,
          isMultipleDays: eventData?.fields?.isMultipleDays,
          numberOfMultipleDays: eventData?.fields?.numberOfMultipleDays,
          multipleDayType: eventData?.fields?.multipleDayType,
          startDate: eventData?.fields?.startDate
        });
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  // Calculate dates after event is loaded
  useEffect(() => {
    if (curr && curr.fields.isMultipleDays) {
      console.log('🔢 Calculating session dates for multi-day event...');
      const dates = getMultiDayEventDates(curr);
      console.log('📍 Calculated event dates:', {
        count: dates.length,
        dates: dates.map(d => d.toLocaleDateString()),
        numberOfDays: curr.fields.numberOfMultipleDays,
        dayType: curr.fields.multipleDayType
      });
      setEventDates(dates);
    } else {
      console.log('❌ Event not loaded or not multi-day:', {
        eventLoaded: !!curr,
        isMultipleDays: curr?.fields?.isMultipleDays
      });
      setEventDates([]);
    }
  }, [curr]);

  const handleBack = () => {
    router.back();
  };


  const handleMarkAttendance = (dayNumber: number) => {
    router.push(`/volunteer/${curr?.id}?day=${dayNumber}`);
  };


  if (loading) {
    return (
      <View
        style={[
          tw`flex-1 items-center justify-center`,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    );
  }

  if (!currentEvent || !currentEvent.isMultipleDays) {
    return (
      <View
        style={[
          tw`flex-1 items-center justify-center`,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text, fontSize: 18 }}>
          Invalid multi-day event
        </Text>
      </View>
    );
  }

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <View style={tw`flex-1 pt-12`}>
        {/* Header Image */}
        <Image
          source={{
            uri:
              currentEvent?.images && currentEvent.images.length > 0
                ? currentEvent.images[0].url
                : "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png",
          }}
          style={tw`absolute w-full h-84`}
        />

        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          style={[
            tw`absolute top-15 left-5 z-10 p-3 rounded-md shadow-md`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
          ]}
        >
          <FontAwesome name='chevron-left' size={20} color={colors.text} />
        </TouchableOpacity>

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={[tw`pt-72`, { flexGrow: 1 }]}
        >
          <View
            style={[
              tw`p-5 rounded-t-lg mt-[-10] flex-1`,
              { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
            ]}
          >
            {/* Event Header */}
            <Text
              style={{
                color: colors.text,
                fontSize: 30,
                fontWeight: "bold",
                marginTop: 8,
              }}
            >
              {currentEvent?.eventName || "Multi-Day Event"}
            </Text>

            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name='map-marker' size={24} color={colors.primary} />
              <Text
                style={{
                  color: colors.gray,
                  fontSize: 18,
                  marginLeft: 16,
                }}
              >
                {currentEvent?.location || "No location specified"}
              </Text>
            </View>

            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name='calendar' size={24} color={colors.primary} />
              <Text
                style={{
                  color: colors.gray,
                  fontSize: 18,
                  marginLeft: 16,
                }}
              >
                {currentEvent.multipleDayType === "Weekly"
                  ? `${currentEvent.numberOfMultipleDays} weeks`
                  : `${currentEvent.numberOfMultipleDays} days`}
              </Text>
            </View>

            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 20,
              }}
            >
              About Event
            </Text>
            <Text style={{ color: colors.gray, marginTop: 8, marginBottom: 20 }}>
              {currentEvent?.eventDetails || "No event details provided"}
            </Text>

            {/* Sessions List */}
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              Sessions
            </Text>

            {eventDates.length > 0 ? (
              eventDates.map((date, index) => (
                <MultiDaySessionCard
                  key={index}
                  dayNumber={index + 1}
                  date={date}
                  eventStartDate={currentEvent.startDate}
                  multipleDayType={currentEvent.multipleDayType}
                  onMarkAttendance={() => handleMarkAttendance(index + 1)}
                />
              ))
            ) : (
              <View style={[tw`p-4 rounded-lg mb-4`, { backgroundColor: isDarkMode ? colors.background : colors.lightGray }]}>
                <Text style={{ color: colors.gray, fontSize: 16, textAlign: 'center' }}>
                  No sessions configured for this multi-day event.
                </Text>
                {currentEvent?.numberOfMultipleDays && (
                  <Text style={{ color: colors.gray, fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                    Expected {currentEvent.numberOfMultipleDays} {currentEvent.multipleDayType?.toLowerCase() || 'day'} sessions.
                  </Text>
                )}
                <Text style={{ color: colors.gray, fontSize: 12, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
                  Check console logs for debugging information.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

    </View>
  );
};

export default MultiDayEventDetails;