import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "../../styles/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import state from "../../state";
import { useTheme } from "@/context/ThemeContext";
import { Event } from "@/types/event";
import { checkUserCanTakeShift } from "../../state/volunteerState";
import { getMultiDayEventDates, formatTimeFromDate } from "@/helpers/dateUtils";
import MultiDaySessionCard from "@/components/home/MultiDaySessionCard";

type Shift = {
  id: string;
  shiftTime: string;
  isAvailable: boolean;
  bookedBy?: {
    name: string;
    email: string;
  };
};

const MultiDayEventDetails = () => {
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const curr: Event = state.event.eventState.currentEvent.get();
  const currentEvent = curr?.fields;
  const [loading, setLoading] = useState(true);
  const [shiftModalVisible, setShiftModalVisible] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
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

  const handleBookShift = async (dayNumber: number) => {
    setSelectedDay(dayNumber);
    if (user?.role === "STAFF" && user?.id && curr?.id) {
      setLoadingShifts(true);
      try {
        const result = await checkUserCanTakeShift(user.id, curr.id);
        setAllShifts(result.allShifts || []);
        setShiftModalVisible(true);
      } catch (error) {
        console.error("Error checking shift availability:", error);
        Alert.alert("Error", "Failed to load available shifts.");
      } finally {
        setLoadingShifts(false);
      }
    }
  };

  const handleMarkAttendance = (dayNumber: number) => {
    router.push(`/volunteer/${curr?.id}?day=${dayNumber}`);
  };

  const handleVolunteer = async () => {
    if (!user.id || selectedShifts.length !== 1) return;

    const shiftId = selectedShifts[0];

    try {
      await state.volunteer.volunteerForEvent(user.id, shiftId);
      setSelectedShifts([]);
      setShiftModalVisible(false);
      Alert.alert("Success", "You have successfully booked a shift for this day", [
        {
          text: "OK",
          onPress: () => {
            // Optionally refresh or navigate
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to sign up as a volunteer.");
      console.error("Failed to sign up as a volunteer:", error);
    }
  };

  const toggleShiftSelection = (shiftId: string) => {
    if (selectedShifts.includes(shiftId)) {
      setSelectedShifts([]);
    } else {
      setSelectedShifts([shiftId]);
    }
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
                  onBookShift={() => handleBookShift(index + 1)}
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

      {/* Shift Booking Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={shiftModalVisible}
        onRequestClose={() => {
          setShiftModalVisible(!shiftModalVisible);
        }}
      >
        <TouchableOpacity
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
          activeOpacity={1}
          onPress={() => setShiftModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[
              tw`rounded-lg p-5 w-4/5`,
              { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
            ]}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Book Shift - {currentEvent.multipleDayType === "Weekly" ? `Week ${selectedDay}` : `Day ${selectedDay}`}
            </Text>
            <Text style={{ color: colors.gray, marginBottom: 20 }}>
              Please select an available shift from the list below.
            </Text>

            <View style={tw`flex-col w-full`}>
              {loadingShifts ? (
                <View style={tw`items-center justify-center py-8`}>
                  <ActivityIndicator size='large' color={colors.primary} />
                  <Text style={{ color: colors.gray, marginTop: 10 }}>
                    Loading available shifts...
                  </Text>
                </View>
              ) : allShifts.length > 0 ? (
                allShifts.map((shift) => {
                  return (
                    <TouchableOpacity
                      key={shift.id}
                      style={[
                        tw`p-4 rounded-lg mb-2 flex-row justify-between items-center`,
                        {
                          backgroundColor: selectedShifts.includes(shift.id)
                            ? colors.primary
                            : isDarkMode
                            ? colors.lightGray
                            : colors.white,
                          borderWidth: 1,
                          borderColor: colors.primary,
                          opacity: shift.isAvailable ? 1 : 0.5,
                        },
                      ]}
                      onPress={() =>
                        shift.isAvailable && toggleShiftSelection(shift.id)
                      }
                      disabled={!shift.isAvailable}
                    >
                      <View style={tw`flex-1`}>
                        <Text
                          style={{
                            color: selectedShifts.includes(shift.id)
                              ? colors.white
                              : colors.text,
                            fontSize: 16,
                          }}
                        >
                          {shift.shiftTime}
                        </Text>
                        {!shift.isAvailable && shift.bookedBy && (
                          <Text style={{ color: colors.gray, fontSize: 12 }}>
                            Booked by: {shift.bookedBy.name}
                          </Text>
                        )}
                        {!shift.isAvailable && !shift.bookedBy && (
                          <Text style={{ color: colors.gray, fontSize: 12 }}>
                            Already taken
                          </Text>
                        )}
                      </View>
                      {selectedShifts.includes(shift.id) && (
                        <FontAwesome
                          name='check'
                          size={16}
                          color={colors.white}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={{ color: colors.gray, textAlign: "center" }}>
                  No shifts found for this session.
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                tw`p-4 rounded-lg mt-4`,
                {
                  backgroundColor:
                    selectedShifts.length > 0 ? colors.primary : colors.gray,
                  opacity: selectedShifts.length > 0 ? 1 : 0.5,
                },
              ]}
              onPress={handleVolunteer}
              disabled={selectedShifts.length === 0 || loadingShifts}
            >
              {loadingShifts ? (
                <ActivityIndicator size='small' color={colors.white} />
              ) : (
                <Text style={{ color: colors.white, textAlign: "center" }}>
                  Book Selected Shift
                </Text>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MultiDayEventDetails;