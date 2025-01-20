// app/[eventId].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import tw from "../styles/tailwind";
import server from "@/config/axios";

const EventAttendance = () => {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [eventTitle, setEventTitle] = useState("Event");

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchAttendees();
    }
  }, [eventId]);



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await server.get(`/event/read/${eventId}`);

      setEventTitle(response.data.fields.eventName);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch event details.");
    }
  };

  const fetchAttendees = async () => {
    try {
      console.log("eventId", eventId);

      const response = await server.get(
        `/registration/event/${eventId}/attendees`
      );
      console.log("response", response.data.attendees);

      setAttendees(response.data.attendees);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch attendees.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (userId) => {
    try {
      await server.post(
        `/registration/event/${eventId}/attendees/${userId}/mark-attendance`
      );
      // Update the attendee's attendance status in the state
      setAttendees((prevAttendees) =>
        prevAttendees.map((attendee) =>
          attendee.id === userId ? { ...attendee, attended: true } : attendee
        )
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to mark attendance.");
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanning(false);
    try {
      console.log("qr,", data);

      markAttendance(data.split("~")[0]);
      Alert.alert("Success", "Attendance marked via QR code.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to mark attendance via QR code.");
    }
  };

  const openScanner = () => {
    if (hasPermission === null) {
      Alert.alert("Error", "Camera permissions not determined.");
    } else if (hasPermission === false) {
      Alert.alert("Error", "No access to camera.");
    } else {
      setScanning(true);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Stack.Screen
        options={{
          title: "My home",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <View style={tw`flex-row items-center justify-between p-4 bg-gray-200`}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold`}>{eventTitle}</Text>
        <TouchableOpacity onPress={openScanner}>
          <AntDesign name="qrcode" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Attendees List */}
      <FlatList
        data={attendees}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`flex-row justify-between items-center p-4 border-b`}
            onPress={() => markAttendance(item.id)}
          >
            <Text>
              {item.firstName} {item.lastName}
            </Text>
            {item.attended ? (
              <AntDesign name="checkcircle" size={24} color="green" />
            ) : (
              <AntDesign name="checkcircleo" size={24} color="gray" />
            )}
          </TouchableOpacity>
        )}
      />

      {/* QR Code Scanner Modal */}
      {scanning && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={scanning}
          onRequestClose={() => setScanning(false)}
        >
          <CameraView
            style={tw`flex-1`}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            <View style={tw`flex-1 justify-end p-5`}>
              <TouchableOpacity
                style={tw`bg-white p-4 rounded`}
                onPress={() => setScanning(false)}
              >
                <Text style={tw`text-center`}>Close Scanner</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default EventAttendance;
