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
import tw from "../styles/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import state from "../state";
import { addBooking } from "@/helpers/userHelpers";
import { useTheme } from "@/context/ThemeContext";
import { Event, Registration } from "@/types/event";

const EventDetails = () => {
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const curr: Event = state.event.eventState.currentEvent.get();
  const currentEvent = curr?.fields;
  const shiftsScheduled = currentEvent?.shiftsScheduled || 0;
  const [isEventRegistered, setIsEventRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canTakeShift, setCanTakeShift] = useState(false);
  const [shiftModalVisible, setShiftModalVisible] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const user = state.user.userState.get();
  const userVolunteeredEvents: Event[] = state.volunteer.volunteerState.userVolunteeredEvents.get();

  const userRegistrations: Registration[] = state.registration.registrationState.userRegistrations.get();

  const { isDarkMode, colors } = useTheme();

  const getDefaultShift = () => {
    if (!currentEvent?.startDate || !currentEvent?.endDate) return [];

    const startDate = new Date(currentEvent.startDate);
    const endDate = new Date(currentEvent.endDate);

    // If dates are invalid, return empty array
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];

    // Format the time slot as "HH:MM AM/PM - HH:MM AM/PM"
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return [`${formatTime(startDate)} - ${formatTime(endDate)}`];
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await state.event.fetchEventDetails(eventId);
        if (user?.email) {
          await state.registration.fetchUserRegistrations(user.email, "UPCOMING");
          await state.volunteer.fetchUserVolunteeredEvents(user.email);
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId, user?.email]);

  useEffect(() => {
    const isRegistered = userRegistrations &&
      Array.isArray(userRegistrations) &&
      userRegistrations.length > 0 &&
      userRegistrations.some((registration: Registration) =>
        registration?.eventId?.[0] === curr?.id
      );
    setIsEventRegistered(!!isRegistered);
  }, [userRegistrations, curr]);

  useEffect(() => {
    const canTake = user?.role === "STAFF" &&
      currentEvent?.staffShiftCount != null &&
      currentEvent.staffShiftCount > shiftsScheduled &&
      Array.isArray(userVolunteeredEvents) &&
      !userVolunteeredEvents.some(event => event?.id === curr?.id);
    setCanTakeShift(canTake);
  }, [user?.role, currentEvent?.staffShiftCount, shiftsScheduled, userVolunteeredEvents, curr?.id]);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!currentEvent) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-xl`}>Event not found</Text>
      </View>
    );
  }

  const handleRegistration = async () => {
    if (!user.id || !eventId) return;
    try {
      await state.registration.registerForEvent(user.id, eventId);
      await state.registration.fetchUserRegistrations(user.email || '');
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to confirm registration.");
      console.error("Failed to confirm registration:", error);
    }
  };

  const handleViewTicket = () => {
    router.push("/modal");
  };

  const handleGoHome = () => {
    setModalVisible(false);
    router.push("/");
  };

  const handleVolunteer = async () => {
    if (!user.id || !eventId) return;
    const shiftsScheduled = selectedShifts.join(", ");
    try {
      await state.volunteer.volunteerForEvent(user.id, eventId);
      setSelectedShifts([]);
      setShiftModalVisible(false);
      Alert.alert("Success", "You have successfully booked a shift", [
        {
          text: "OK",
          onPress: () => {
            router.navigate("/my-volunteer");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to sign up as a volunteer.");
      console.error("Failed to sign up as a volunteer:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const showShiftModal = () => {
    setShiftModalVisible(true);
  };

  const toggleShiftSelection = (shift: string) => {
    setSelectedShifts(prev =>
      prev.includes(shift)
        ? prev.filter(s => s !== shift)
        : [...prev, shift]
    );
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <View style={tw`flex-1`}>
        <Image
          source={{
            uri: currentEvent?.images && currentEvent.images.length > 0
              ? currentEvent.images[0].url
              : "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png"
          }}
          style={tw`absolute w-full h-84`}
        />
        <TouchableOpacity
          onPress={handleBack}
          style={[
            tw`absolute top-5 left-5 z-10 p-3 rounded-md shadow-md`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
          ]}
        >
          <FontAwesome name="chevron-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pt-72`}>
          <View style={[
            tw`p-5 rounded-t-lg mt-[-10]`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
          ]}>
            <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold', marginTop: 8 }}>
              {currentEvent?.eventName || "Event Name"}
            </Text>
            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name="map-marker" size={24} color={colors.primary} />
              <Text style={{ color: colors.gray, fontSize: 18, marginLeft: 20, marginVertical: 12 }}>
                {currentEvent?.location || "No location specified"}
              </Text>
            </View>

            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name="calendar" size={24} color={colors.primary} />
              <Text style={{ color: colors.gray, fontSize: 18, marginLeft: 16 }}>
                {currentEvent?.startDate
                  ? new Date(currentEvent.startDate).toLocaleString()
                  : "No date provided"}
              </Text>
            </View>

            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
              About Event
            </Text>
            <Text style={{ color: colors.gray, marginTop: 8 }}>
              {currentEvent?.eventDetails || "No event details provided"}
            </Text>
            <View style={tw`flex-row justify-between mt-5`}>
              {isEventRegistered ? (
                <TouchableOpacity
                  style={[
                    tw`p-4 rounded-lg flex-1 mr-2`,
                    { backgroundColor: colors.primary }
                  ]}
                  onPress={handleViewTicket}
                >
                  <Text style={{ color: colors.white, textAlign: 'center' }}>View Ticket</Text>
                </TouchableOpacity>
              ) : currentEvent?.registration && (
                <TouchableOpacity
                  style={[
                    tw`p-4 rounded-lg flex-1 mr-2`,
                    { backgroundColor: colors.primary }
                  ]}
                  onPress={handleRegistration}
                >
                  <Text style={{ color: colors.white, textAlign: 'center' }}>Register</Text>
                </TouchableOpacity>
              )}
              {canTakeShift && (
                <TouchableOpacity
                  style={[
                    tw`p-4 rounded-lg flex-1 ml-2`,
                    {
                      backgroundColor: isDarkMode ? colors.lightGray : colors.white,
                      borderWidth: 1,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={showShiftModal}
                >
                  <Text style={{ color: colors.primary, textAlign: 'center' }}>Book Shift</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={[
            tw`rounded-lg p-5 w-4/5`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
          ]}>
            <View style={tw`items-center mb-5`}>
              <FontAwesome name="check-circle" size={50} color={isDarkMode ? colors.secondary : "green"} />
              <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                Congratulations!
              </Text>
              <Text style={{ color: colors.gray, textAlign: 'center', marginBottom: 20 }}>
                You have successfully placed an order for this event. Enjoy the event!
              </Text>
            </View>
            <TouchableOpacity
              style={[
                tw`p-4 rounded-lg mb-3`,
                { backgroundColor: colors.primary }
              ]}
              onPress={handleViewTicket}
            >
              <Text style={{ color: colors.white, textAlign: 'center' }}>View E-Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`p-4 rounded-lg`,
                { backgroundColor: colors.gray }
              ]}
              onPress={handleGoHome}
            >
              <Text style={{ color: colors.text, textAlign: 'center' }}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
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
            onPress={e => e.stopPropagation()}
            style={[
              tw`rounded-lg p-5 w-4/5`,
              { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
            ]}
          >
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              Book a Shift
            </Text>
            <Text style={{ color: colors.gray, marginBottom: 20 }}>
              Please select a shift from the list below.
            </Text>

            <View style={tw`flex-col w-full`}>
              {(currentEvent?.shiftsAvailable && currentEvent.shiftsAvailable.length > 0
                ? currentEvent.shiftsAvailable
                : getDefaultShift()
              ).map((shift: string) => (
                <TouchableOpacity
                  key={shift}
                  style={[
                    tw`p-4 rounded-lg mb-2 flex-row justify-between items-center`,
                    {
                      backgroundColor: selectedShifts.includes(shift)
                        ? colors.primary
                        : isDarkMode ? colors.lightGray : colors.white,
                      borderWidth: 1,
                      borderColor: colors.primary
                    }
                  ]}
                  onPress={() => toggleShiftSelection(shift)}
                >
                  <Text
                    style={{
                      color: selectedShifts.includes(shift) ? colors.white : colors.text,
                      fontSize: 16
                    }}
                  >
                    {shift}
                  </Text>
                  {selectedShifts.includes(shift) && (
                    <FontAwesome name="check" size={16} color={colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[
                tw`p-4 rounded-lg mt-4`,
                {
                  backgroundColor: selectedShifts.length > 0 ? colors.primary : colors.gray,
                  opacity: selectedShifts.length > 0 ? 1 : 0.5
                }
              ]}
              onPress={handleVolunteer}
              disabled={selectedShifts.length === 0}
            >
              <Text style={{ color: colors.white, textAlign: 'center' }}>
                Book {selectedShifts.length} Shift{selectedShifts.length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default EventDetails;
