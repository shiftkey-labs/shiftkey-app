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

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const currentEvent = state.event.eventState.currentEvent.get().fields;
  const [loading, setLoading] = useState(true);
  const user = state.user.userState.get();
  const userRegistrations =
    state.registration.registrationState.userRegistrations.get();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await state.event.fetchEventDetails(id);
        console.log("user", user);

        await state.registration.fetchUserRegistrations(user.email);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
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

  console.log("userRegistrations", userRegistrations);

  const isEventRegistered = userRegistrations.some(
    (registration) => registration.eventId === currentEvent.uid
  );

  const handleConfirm = async () => {
    try {
      await state.registration.registerForEvent(user.id, id);
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

  const handleVolunteer = () => {
    Alert.alert("Volunteer", "You have volunteered for this event.");
  };

  const handleBack = () => {
    router.back();
  };

  const eventImage =
    currentEvent.images && currentEvent.images.length > 0
      ? currentEvent.images[0].url
      : "https://via.placeholder.com/500"; // Dummy image URL if no image is provided

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <View style={tw`flex-1`}>
        <Image source={{ uri: eventImage }} style={tw`absolute w-full h-84`} />
        <TouchableOpacity
          onPress={handleBack}
          style={tw`absolute top-5 left-5 z-10 bg-white p-3 rounded-md shadow-md`}
        >
          <FontAwesome name="chevron-left" size={20} color="black" />
        </TouchableOpacity>
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pt-72`}>
          <View style={tw`p-5 bg-white rounded-t-lg mt-[-10]`}>
            <Text style={tw`text-3xl font-bold mt-2`}>
              {currentEvent.eventName || "Event Name"}
            </Text>
            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome
                name="map-marker"
                size={24}
                style={tw`text-primary`}
              />
              <Text style={tw`text-gray-600 ml-5 text-lg my-3`}>
                {currentEvent.location || "No location specified"}
              </Text>
            </View>

            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name="calendar" size={24} style={tw`text-primary`} />
              <Text style={tw`text-gray-600 ml-4 text-lg`}>
                {new Date(currentEvent.startDate).toLocaleString() ||
                  "No date provided"}
              </Text>
            </View>

            <Text style={tw`text-lg font-bold mt-5`}>About Event</Text>
            <Text style={tw`text-gray-600 mt-2`}>
              {currentEvent.eventDetails || "No event details provided"}
            </Text>
            {isEventRegistered ? (
              <TouchableOpacity
                style={tw`bg-primary p-4 rounded-lg mt-5`}
                onPress={handleViewTicket}
              >
                <Text style={tw`text-white text-center`}>View Ticket</Text>
              </TouchableOpacity>
            ) : (
              <View style={tw`flex-row justify-between mt-5`}>
                <TouchableOpacity
                  style={tw`bg-primary p-4 rounded-lg flex-1 mr-2`}
                  onPress={handleConfirm}
                >
                  <Text style={tw`text-white text-center`}>
                    Confirm Attendance
                  </Text>
                </TouchableOpacity>
                {user.role === "VOLUNTEER" && (
                  <TouchableOpacity
                    style={tw`bg-white p-4 rounded-lg flex-1 ml-2 border border-primary`}
                    onPress={handleVolunteer}
                  >
                    <Text style={tw`text-primary text-center`}>Volunteer</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
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
