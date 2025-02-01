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

type Registration = {
  id: string;
  // add other registration fields as needed
};

type Event = {
  id: string;
  fields: {
    eventName?: string;
    location?: string;
    startDate?: string;
    eventDetails?: string;
    volunteerCount?: number;
    shiftsScheduled?: number;
    staffShiftCount?: number;
    images?: Array<{ url: string }>;
  };
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
  const user = state.user.userState.get();
  const userVolunteeredEvents: Event[] = state.volunteer.volunteerState.userVolunteeredEvents.get();

  const userRegistrations: Registration[][] = state.registration.registrationState.userRegistrations.get();

  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await state.event.fetchEventDetails(eventId);
        await state.registration.fetchUserRegistrations(user.email || '');
        if (user.email) {
          await state.volunteer.fetchUserVolunteeredEvents(user.email);
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  useEffect(() => {
    const isRegistered = userRegistrations &&
      userRegistrations[0] &&
      Array.isArray(userRegistrations[0]) &&
      userRegistrations[0].some((registration: Registration) => registration.id === curr?.id);
    setIsEventRegistered(!!isRegistered);
  }, [userRegistrations, curr]);

  console.log("currentEvent", currentEvent);

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
  console.log("user", user.role === "VOLUNTEER");
  console.log("crgr", currentEvent?.volunteerCount);
  console.log("crgs", shiftsScheduled);


  const handleRegistration = async () => {
    if (!user.id || !eventId) return;
    try {
      await state.registration.registerForEvent(user.id, eventId);
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
    try {
      await state.volunteer.volunteerForEvent(user.id, eventId);
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

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <View style={tw`flex-1`}>
        <Image
          source={{
            uri: currentEvent?.images && currentEvent.images.length > 0
              ? currentEvent.images[0].url
              : "https://via.placeholder.com/500"
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
              ) : (
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
              {user.role === "VOLUNTEER" &&
                currentEvent?.staffShiftCount &&
                currentEvent.staffShiftCount > shiftsScheduled &&
                !userVolunteeredEvents.some(event => event.id === curr?.id) && (
                  <TouchableOpacity
                    style={[
                      tw`p-4 rounded-lg flex-1 ml-2`,
                      {
                        backgroundColor: isDarkMode ? colors.lightGray : colors.white,
                        borderWidth: 1,
                        borderColor: colors.primary
                      }
                    ]}
                    onPress={handleVolunteer}
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
    </SafeAreaView>
  );
};

export default EventDetails;
