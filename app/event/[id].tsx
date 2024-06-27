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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "../styles/tailwind";
import eventsData from "@/constants/eventsData";
import { FontAwesome } from "@expo/vector-icons";
import state, { fetchEventById } from "../state";
import { addBooking } from "@/helpers/userHelpers";

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const currentEvent = state.currentEvent.get();
  const [loading, setLoading] = useState(true);
  const user = state.user.get();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchEventById(id);
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  const handleConfirm = async () => {
    try {
      await addBooking(user.uid, id, new Date().toISOString());
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to confirm attendance.");
      console.error("Failed to confirm attendance:", error);
    }
  };

  const handleViewTicket = () => {
    router.push("/modal");
  };

  const handleGoHome = () => {
    setModalVisible(false);
    router.push("/");
  };

  return (
    <ScrollView style={tw`flex-1 bg-background`}>
      <Image source={{ uri: currentEvent.image }} style={tw`w-full h-56`} />
      <View style={tw`p-5`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-2xl font-montserratBold`}>Event Details</Text>
          <TouchableOpacity style={tw`bg-primary p-2 rounded-lg`}>
            <Text style={tw`text-white`}>Invite</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center mt-4`}>
          <Image
            source={{ uri: currentEvent.speakerImage }}
            style={tw`w-12 h-12 rounded-full`}
          />
          <View style={tw`ml-3`}>
            <Text style={tw`text-lg font-bold`}>{currentEvent.speaker}</Text>
            <Text style={tw`text-gray-500`}>Speaker</Text>
          </View>
        </View>

        <Text style={tw`text-3xl font-montserratBold mt-5`}>
          {currentEvent.title}
        </Text>
        <View style={tw`flex-row items-center mt-3`}>
          <FontAwesome
            name="calendar"
            size={24}
            color="gray"
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-600`}>{currentEvent.date}</Text>
        </View>
        <View style={tw`flex-row items-center mt-3`}>
          <FontAwesome
            name="map-marker"
            size={24}
            color="gray"
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-600`}>{currentEvent.location}</Text>
        </View>

        <Text style={tw`text-lg font-bold mt-5`}>About Event</Text>
        <Text style={tw`text-gray-600 mt-2`}>{currentEvent.description}</Text>
        {currentEvent.booked ? (
          <TouchableOpacity
            style={tw`bg-primary p-4 rounded-lg mt-5`}
            onPress={handleViewTicket}
          >
            <Text style={tw`text-white text-center`}>View Ticket</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={tw`bg-primary p-4 rounded-lg mt-5`}
            onPress={handleConfirm}
          >
            <Text style={tw`text-white text-center`}>Confirm Attendance</Text>
          </TouchableOpacity>
        )}
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
                Congratulations !
              </Text>
              <Text style={tw`text-center text-gray-600 mb-5`}>
                You have successfully placed order for Darshan Raval music show.
                Enjoy the event!
              </Text>
            </View>
            <TouchableOpacity
              style={tw`bg-primary p-4 rounded-lg mb-3`}
              onPress={handleViewTicket}
            >
              <Text style={tw`text-white text-center`}>View E-Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-gray-200 p-4 rounded-lg`}
              onPress={handleGoHome}
            >
              <Text style={tw`text-center`}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EventDetails;
