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

      const response = await server.get(
        `/registration/event/${eventId}/attendees`
      );

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
          attendee.id === userId ? { ...attendee, attended: !attendee.attended } : attendee
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
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={tw`flex-row items-center justify-between p-5 bg-white shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-2`}>
          <AntDesign name="arrowleft" size={24} style={tw`text-primary`} />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>{eventTitle}</Text>
        <TouchableOpacity onPress={openScanner} style={tw`p-2`}>
          <AntDesign name="qrcode" size={24} style={tw`text-primary`} />
        </TouchableOpacity>
      </View>

      {/* Attendees List */}
      <FlatList
        data={attendees}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={tw`p-4`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`flex-row justify-between items-center p-4 mb-3 bg-white rounded-lg shadow-sm`}
            onPress={() => markAttendance(item.id)}
          >
            <View>
              <Text style={tw`text-lg font-semibold`}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={tw`text-gray-500 text-sm mt-1`}>
                {item.attended ? 'Present' : 'Not checked in'}
              </Text>
            </View>
            {item.attended ? (
              <AntDesign name="checkcircle" size={24} style={tw`text-primary`} />
            ) : (
              <AntDesign name="checkcircleo" size={24} style={tw`text-gray-400`} />
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
                style={tw`bg-primary p-4 rounded-lg mb-10`}
                onPress={() => setScanning(false)}
              >
                <Text style={tw`text-white text-center font-semibold`}>Close Scanner</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default EventAttendance;
