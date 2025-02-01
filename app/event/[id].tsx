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


  const handleConfirm = async () => {
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
    <SafeAreaView style={tw`flex-1 bg-background`}>
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
          style={tw`absolute top-5 left-5 z-10 bg-white p-3 rounded-md shadow-md`}
        >
          <FontAwesome name="chevron-left" size={20} color="black" />
        </TouchableOpacity>
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pt-72`}>
          <View style={tw`p-5 bg-white rounded-t-lg mt-[-10]`}>
            <Text style={tw`text-3xl font-bold mt-2`}>
              {currentEvent?.eventName || "Event Name"}
            </Text>
            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name="map-marker" size={24} style={tw`text-primary`} />
              <Text style={tw`text-gray-600 ml-5 text-lg my-3`}>
                {currentEvent?.location || "No location specified"}
              </Text>
            </View>

            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name="calendar" size={24} style={tw`text-primary`} />
              <Text style={tw`text-gray-600 ml-4 text-lg`}>
                {currentEvent?.startDate
                  ? new Date(currentEvent.startDate).toLocaleString()
                  : "No date provided"}
              </Text>
            </View>

            <Text style={tw`text-lg font-bold mt-5`}>About Event</Text>
            <Text style={tw`text-gray-600 mt-2`}>
              {currentEvent?.eventDetails || "No event details provided"}
            </Text>
            <View style={tw`flex-row justify-between mt-5`}>
              {isEventRegistered ? (
                <TouchableOpacity
                  style={tw`bg-primary p-4 rounded-lg flex-1 mr-2`}
                  onPress={handleViewTicket}
                >
                  <Text style={tw`text-white text-center`}>View Ticket</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={tw`bg-primary p-4 rounded-lg flex-1 mr-2`}
                  onPress={handleConfirm}
                >
                  <Text style={tw`text-white text-center`}>Confirm Attendance</Text>
                </TouchableOpacity>
              )}
              {user.role === "VOLUNTEER" &&
                currentEvent?.staffShiftCount &&
                currentEvent.staffShiftCount > shiftsScheduled &&
                !userVolunteeredEvents.some(event => event.id === curr?.id) && (
                  <TouchableOpacity
                    style={tw`bg-white p-4 rounded-lg flex-1 ml-2 border border-primary`}
                    onPress={handleVolunteer}
                  >
                    <Text style={tw`text-primary text-center`}>Book Shift</Text>
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
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white rounded-lg p-5 w-4/5`}>
            <View style={tw`items-center mb-5`}>
              <FontAwesome name="check-circle" size={50} color="green" />
              <Text style={tw`text-2xl font-montserratBold mb-2`}>
                Congratulations!
              </Text>
              <Text style={tw`text-center text-gray-600 mb-5`}>
                You have successfully placed an order for this event. Enjoy the
                event!
              </Text>
            </View>
            <TouchableOpacity
              style={tw`bg-primary p-4 rounded-lg mb-3`}
              onPress={handleViewTicket}
            >
              <Text style={tw`text-white text-center`}>View E-Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-gray p-4 rounded-lg`}
              onPress={handleGoHome}
            >
              <Text style={tw`text-center`}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EventDetails;
