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
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import tw from "../styles/tailwind";
import server from "@/config/axios";
import { useTheme } from "@/context/ThemeContext";

// Define the Attendee type to fix TypeScript errors
interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  attended: boolean;
}

const EventAttendance = () => {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [eventTitle, setEventTitle] = useState("Event");
  const [searchQuery, setSearchQuery] = useState("");
  const { isDarkMode, colors } = useTheme();

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

  const markAttendance = async (userId: string) => {
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

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
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

  // Filter attendees based on search query
  const filteredAttendees = attendees.filter((attendee) => {
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDarkMode ? colors.text : colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[tw`flex-row items-center justify-between p-5 shadow-sm`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-2`}>
          <AntDesign name="arrowleft" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>{eventTitle}</Text>
        <TouchableOpacity onPress={openScanner} style={tw`p-2`}>
          <AntDesign name="qrcode" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main content area with different background */}
      <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
        {/* Search Bar */}
        <View style={[tw`px-4 py-3`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <View style={[tw`flex-row items-center rounded-lg px-3 py-2`, { backgroundColor: isDarkMode ? colors.background : colors.lightGray }]}>
            <AntDesign name="search1" size={20} color={colors.gray} style={tw`mr-2`} />
            <TextInput
              style={[tw`flex-1 text-base`, { color: colors.text }]}
              placeholder="Search attendees..."
              placeholderTextColor={colors.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <AntDesign name="close" size={20} color={colors.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Attendees List */}
        <FlatList
          data={filteredAttendees}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`p-4`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[tw`flex-row justify-between items-center p-4 mb-3 rounded-lg shadow-sm`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}
              onPress={() => markAttendance(item.id)}
            >
              <View>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'semibold' }}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={{ color: colors.gray, fontSize: 14, marginTop: 4 }}>
                  {item.attended ? 'Present' : 'Not checked in'}
                </Text>
              </View>
              {item.attended ? (
                <AntDesign name="checkcircle" size={24} color={colors.primary} />
              ) : (
                <AntDesign name="checkcircleo" size={24} color={colors.gray} />
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
                  style={[tw`p-4 rounded-lg mb-10`, { backgroundColor: colors.primary }]}
                  onPress={() => setScanning(false)}
                >
                  <Text style={{ color: colors.white, textAlign: 'center', fontWeight: 'semibold' }}>Close Scanner</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EventAttendance;
