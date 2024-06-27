import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "../styles/tailwind";
import eventsData from "@/constants/eventsData";
import { FontAwesome } from "@expo/vector-icons";
import state, { fetchEventById } from "../state";

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventById(id as string);
    }
  }, [id]);

  const event = state.currentEvent.get();

  if (!event) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-xl`}>Loading...</Text>
      </View>
    );
  }

  const handleConfirm = () => {
    setModalVisible(true);
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
      <Image source={event.image} style={tw`w-full h-56`} />
      <View style={tw`p-5`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-2xl font-montserratBold`}>Event Details</Text>
          <TouchableOpacity style={tw`bg-primary p-2 rounded-lg`}>
            <Text style={tw`text-white`}>Invite</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center mt-4`}>
          <Image
            source={event.speakerImage}
            style={tw`w-12 h-12 rounded-full`}
          />
          <View style={tw`ml-3`}>
            <Text style={tw`text-lg font-bold`}>{event.speaker}</Text>
            <Text style={tw`text-gray-500`}>Speaker</Text>
          </View>
        </View>

        <Text style={tw`text-3xl font-montserratBold mt-5`}>{event.title}</Text>
        <View style={tw`flex-row items-center mt-3`}>
          <FontAwesome
            name="calendar"
            size={24}
            color="gray"
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-600`}>{event.date}</Text>
        </View>
        <View style={tw`flex-row items-center mt-3`}>
          <FontAwesome
            name="map-marker"
            size={24}
            color="gray"
            style={tw`mr-2`}
          />
          <Text style={tw`text-gray-600`}>{event.location}</Text>
        </View>

        <Text style={tw`text-lg font-bold mt-5`}>About Event</Text>
        <Text style={tw`text-gray-600 mt-2`}>{event.description}</Text>
        {event.booked ? (
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
