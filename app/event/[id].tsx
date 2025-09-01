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
import { useTheme } from "@/context/ThemeContext";
import { Event, Registration } from "@/types/event";
import { checkUserCanTakeShift, checkUserHasShiftForEvent } from "../state/volunteerState";

// Define a type for shift
type Shift = {
  id: string;
  shiftTime: string;
  isAvailable: boolean;
};

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
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [canTakeShift, setCanTakeShift] = useState<boolean | null>(null);
  const [shiftModalVisible, setShiftModalVisible] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [userHasShift, setUserHasShift] = useState(false);
  const user = state.user.userState.get();
  const userVolunteeredEvents: Event[] =
    state.volunteer.volunteerState.userVolunteeredEvents.get();

  const userRegistrations: Registration[] =
    state.registration.registrationState.userRegistrations.get();

  const { isDarkMode, colors } = useTheme();

  // Helper function to format date and time
  const formatEventDateTime = (dateString?: string) => {
    if (!dateString) return "No date provided";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      // Format: "Monday, January 15, 2024 at 2:30 PM"
      return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Helper function to format date only
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return "No date provided";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      // Format: "Monday, January 15, 2024"
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Helper function to format time only
  const formatEventTime = (dateString?: string) => {
    if (!dateString) return "No time provided";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid time";

      // Format: "2:30 PM"
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching event details for eventId:", eventId);
        await state.event.fetchEventDetails(eventId);
        console.log("Current event after fetch:", curr);
        console.log("Current event fields:", currentEvent);

        // Event details are loaded, show the UI
        setLoading(false);

        // Continue fetching user-specific data in the background
        if (user?.email) {
          setLoadingRegistrations(true);
          console.log("Fetching user data for email:", user.email);
          console.log("Current user state:", user);

          try {
            await state.registration.fetchUserRegistrations(
              user.email,
              "UPCOMING"
            );
            await state.volunteer.fetchUserVolunteeredEvents(user.email);
            console.log("User registrations after fetch:", userRegistrations);
            console.log(
              "User volunteered events after fetch:",
              userVolunteeredEvents
            );
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          } finally {
            setLoadingRegistrations(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId, user?.email]);

  useEffect(() => {
    if (!loadingRegistrations) {
      const isRegistered =
        userRegistrations &&
        Array.isArray(userRegistrations) &&
        userRegistrations.length > 0 &&
        userRegistrations.some(
          (registration: Registration) =>
            registration?.eventId?.[0] === curr?.id
        );
      setIsEventRegistered(!!isRegistered);
    }
  }, [userRegistrations, curr, loadingRegistrations]);

  const checkShiftAvailability = async () => {
    if (user?.id && curr?.id && user?.role === "STAFF") {
      setLoadingShifts(true);
      try {
        const result = await checkUserCanTakeShift(user.id, curr.id);
        setCanTakeShift(result.canTakeShift);
        setAllShifts(result.allShifts || []);
      } catch (error) {
        console.error("Error checking shift availability:", error);
        setCanTakeShift(false);
      } finally {
        setLoadingShifts(false);
      }
    } else {
      setCanTakeShift(false);
    }
  };

  // Auto-check shift availability when user data is loaded and user is staff
  useEffect(() => {
    if (
      !loadingRegistrations &&
      user?.role === "STAFF" &&
      curr?.id &&
      user?.id
    ) {
      checkShiftAvailability();
    }
  }, [loadingRegistrations, user?.role, curr?.id, user?.id]);

  // Check if user has a shift for this event
  useEffect(() => {
    if (!loadingRegistrations && curr?.id) {
      const hasShift = checkUserHasShiftForEvent(curr.id);
      setUserHasShift(hasShift);
    }
  }, [loadingRegistrations, curr?.id, userVolunteeredEvents]);

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

  if (!currentEvent) {
    return (
      <View
        style={[
          tw`flex-1 items-center justify-center`,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={tw`text-xl`}>Event not found</Text>
      </View>
    );
  }

  const handleRegistration = async () => {
    if (!user.id || !eventId) return;
    try {
      await state.registration.registerForEvent(user.id, eventId);
      await state.registration.fetchUserRegistrations(user.email || "");
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
    if (!user.id || selectedShifts.length !== 1) return;

    // Get the selected shift ID
    const shiftId = selectedShifts[0];

    try {
      await state.volunteer.volunteerForEvent(user.id, shiftId);
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

  const handleMarkAttendance = () => {
    // Navigate to volunteer event page for marking attendance of registered students
    router.push(`/volunteer/${curr?.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const showShiftModal = async () => {
    if (canTakeShift) {
      setShiftModalVisible(true);
    } else if (!loadingShifts && canTakeShift === false) {
      Alert.alert(
        "No Shifts Available",
        "There are no available shifts for this event."
      );
    }
  };

  const toggleShiftSelection = (shiftId: string) => {
    if (selectedShifts.includes(shiftId)) {
      setSelectedShifts([]);
    } else {
      setSelectedShifts([shiftId]);
    }
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <View style={tw`flex-1 pt-12`}>
        <Image
          source={{
            uri:
              currentEvent?.images && currentEvent.images.length > 0
                ? currentEvent.images[0].url
                : "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png",
          }}
          style={tw`absolute w-full h-84`}
        />
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
            <Text
              style={{
                color: colors.text,
                fontSize: 30,
                fontWeight: "bold",
                marginTop: 8,
              }}
            >
              {currentEvent?.eventName || "Event Name"}
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
                {formatEventDate(currentEvent?.startDate)}
              </Text>
            </View>

            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name='clock-o' size={24} color={colors.primary} />
              <Text
                style={{
                  color: colors.gray,
                  fontSize: 18,
                  marginLeft: 16,
                }}
              >
                {formatEventTime(currentEvent?.startDate)}
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
            <Text style={{ color: colors.gray, marginTop: 8, flex: 1 }}>
              {currentEvent?.eventDetails || "No event details provided"}
            </Text>
            <View style={tw`flex-row justify-between mt-5 mb-6`}>
              {loadingRegistrations ? (
                <TouchableOpacity
                  style={[
                    tw`p-4 rounded-lg flex-1 mr-2`,
                    { backgroundColor: colors.gray, opacity: 0.5 },
                  ]}
                  disabled
                >
                  <ActivityIndicator size='small' color={colors.white} />
                </TouchableOpacity>
              ) : isEventRegistered ? (
                <TouchableOpacity
                  style={[
                    tw`p-4 rounded-lg flex-1 mr-2`,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleViewTicket}
                >
                  <Text style={{ color: colors.white, textAlign: "center" }}>
                    View Ticket
                  </Text>
                </TouchableOpacity>
              ) : (
                currentEvent?.registration && (
                  <TouchableOpacity
                    style={[
                      tw`p-4 rounded-lg flex-1 mr-2`,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleRegistration}
                  >
                    <Text style={{ color: colors.white, textAlign: "center" }}>
                      Register
                    </Text>
                  </TouchableOpacity>
                )
              )}
              {user?.role === "STAFF" && (
                <TouchableOpacity
                  style={[
                    tw`p-4 rounded-lg flex-1 ml-2`,
                    {
                      backgroundColor: userHasShift 
                        ? colors.primary
                        : isDarkMode
                        ? colors.lightGray
                        : colors.white,
                      borderWidth: userHasShift ? 0 : 1,
                      borderColor: colors.primary,
                      opacity:
                        loadingShifts || (!userHasShift && canTakeShift === false) ? 0.5 : 1,
                    },
                  ]}
                  onPress={userHasShift ? handleMarkAttendance : showShiftModal}
                  disabled={loadingShifts || (!userHasShift && canTakeShift === false)}
                >
                  {loadingShifts ? (
                    <ActivityIndicator size='small' color={userHasShift ? colors.white : colors.primary} />
                  ) : (
                    <Text
                      style={{ 
                        color: userHasShift ? colors.white : colors.primary, 
                        textAlign: "center" 
                      }}
                    >
                      {userHasShift
                        ? "Mark Attendance"
                        : canTakeShift === true
                        ? "Book Shift"
                        : canTakeShift === false
                        ? "No Shifts Available"
                        : "Check Shifts"}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View
            style={[
              tw`rounded-lg p-5 w-4/5`,
              { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
            ]}
          >
            <View style={tw`items-center mb-5`}>
              <FontAwesome
                name='check-circle'
                size={50}
                color={isDarkMode ? colors.secondary : "green"}
              />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                Congratulations!
              </Text>
              <Text
                style={{
                  color: colors.gray,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                You have successfully placed an order for this event. Enjoy the
                event!
              </Text>
            </View>
            <TouchableOpacity
              style={[
                tw`p-4 rounded-lg mb-3`,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleViewTicket}
            >
              <Text style={{ color: colors.white, textAlign: "center" }}>
                View E-Ticket
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tw`p-4 rounded-lg`, { backgroundColor: colors.gray }]}
              onPress={handleGoHome}
            >
              <Text style={{ color: colors.text, textAlign: "center" }}>
                Go to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
              Book a Shift
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
                        {!shift.isAvailable && (
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
                  No shifts found for this event.
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

export default EventDetails;
