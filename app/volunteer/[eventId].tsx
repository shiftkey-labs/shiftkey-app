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
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import tw from "../styles/tailwind";
import server from "@/config/axios";
import { useTheme } from "@/context/ThemeContext";
import { Dropdown } from "react-native-element-dropdown";

// Define the Attendee type to fix TypeScript errors
interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  attended: boolean;
  // Add specific day columns
  day1?: boolean;
  day2?: boolean;
  day3?: boolean;
  day4?: boolean;
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
  const [isMultipleDays, setIsMultipleDays] = useState(false);
  const [selectedDay, setSelectedDay] = useState("1");
  const [totalDays, setTotalDays] = useState(4);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchAttendees();
    }
  }, [eventId]);

  // Add a new useEffect to refetch attendees when selectedDay changes
  useEffect(() => {
    if (eventId && !loading) {
      fetchAttendees();
    }
  }, [selectedDay]);

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

      if (response.data.fields.isMultipleDays) {
        setIsMultipleDays(true);
      } else {
        setIsMultipleDays(false);
        setSelectedDay("1");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch event details.");
    }
  };

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      // Fetch all attendees for the event
      const response = await server.get(
        `/registration/event/${eventId}/attendees`
      );

      console.log("Response data:", JSON.stringify(response.data, null, 2));

      const dayParam = selectedDay || "1";

      // We need to fetch the attendance status for the selected day
      // First, let's get all attendees
      const allAttendees = response.data.attendees;

      // Now, let's fetch the attendance status for the selected day
      try {
        const dayResponse = await server.get(
          `/registration/event/${eventId}/attendees/${dayParam}`
        );

        console.log("Day response:", JSON.stringify(dayResponse.data, null, 2));

        // Create a map of attendee IDs to their attendance status for the selected day
        const attendanceMap = new Map();
        if (dayResponse.data.attendees) {
          dayResponse.data.attendees.forEach((attendee: Attendee) => {
            attendanceMap.set(attendee.id, true);
          });
        }

        // Update the attendance status for each attendee
        const attendeesWithDayStatus = allAttendees.map((attendee: Attendee) => {
          const updatedAttendee = { ...attendee };

          // Set the day-specific attendance status
          const dayKey = `day${dayParam}` as keyof Attendee;
          if (dayKey === 'day1') {
            updatedAttendee.day1 = attendanceMap.has(attendee.id);
          } else if (dayKey === 'day2') {
            updatedAttendee.day2 = attendanceMap.has(attendee.id);
          } else if (dayKey === 'day3') {
            updatedAttendee.day3 = attendanceMap.has(attendee.id);
          } else if (dayKey === 'day4') {
            updatedAttendee.day4 = attendanceMap.has(attendee.id);
          }

          return updatedAttendee;
        });

        console.log("Attendees with day status:", JSON.stringify(attendeesWithDayStatus, null, 2));

        // Set the attendees with their day-specific attendance status
        setAttendees(attendeesWithDayStatus);
      } catch (error) {
        console.error("Error fetching day-specific attendance:", error);
        // If we can't fetch the day-specific attendance, just use the general attendance
        setAttendees(allAttendees);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch attendees.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (userId: string) => {
    try {
      // Ensure selectedDay is a valid value before sending to the backend
      const dayParam = selectedDay || "1";

      console.log("dayParam", dayParam)

      // Send the day parameter correctly in the request body
      await server.post(
        `/registration/event/${eventId}/attendees/${userId}/mark-attendance`,
        { day: dayParam }
      );

      // Refetch attendees to ensure UI is updated with latest data from backend
      await fetchAttendees();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to mark attendance.");
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanning(false);
    try {
      // Pass the user ID from the QR code to markAttendance
      await markAttendance(data.split("~")[0]);
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

  const generateDayOptions = () => {
    const options = [];
    for (let i = 1; i <= totalDays; i++) {
      options.push({ label: `Day ${i}`, value: i.toString() });
    }
    return options;
  };

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

      <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
        <View style={[tw`px-4 py-3`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <View style={[tw`flex-row items-center rounded-lg px-3 py-2 flex-1 mr-2`, { backgroundColor: isDarkMode ? colors.background : colors.lightGray }]}>
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

            {isMultipleDays && (
              <View style={[tw`rounded-lg`, { minWidth: 100 }]}>
                <Dropdown
                  style={[tw`px-2 py-1 rounded-lg`, {
                    backgroundColor: isDarkMode ? colors.background : colors.lightGray,
                    height: 40,
                    width: 120
                  }]}
                  placeholderStyle={{ color: colors.text }}
                  selectedTextStyle={{ color: colors.text }}
                  data={generateDayOptions()}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={`Day ${selectedDay}`}
                  value={selectedDay}
                  onChange={item => {
                    setSelectedDay(item.value);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign name="calendar" style={tw`mr-2`} color={colors.text} size={16} />
                  )}
                />
              </View>
            )}
          </View>
        </View>

        <FlatList
          data={filteredAttendees}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`p-4`}
          renderItem={({ item }) => {
            // Ensure we use a valid day parameter
            const dayParam = selectedDay || "1";
            const dayKey = `day${dayParam}` as keyof Attendee;
            const isAttendedForSelectedDay = item[dayKey] as boolean || false;

            return (
              <TouchableOpacity
                style={[tw`flex-row justify-between items-center p-4 mb-3 rounded-lg shadow-sm`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}
                onPress={() => markAttendance(item.id)}
              >
                <View>
                  <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'semibold' }}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={{ color: colors.gray, fontSize: 14, marginTop: 4 }}>
                    {isAttendedForSelectedDay ? 'Present' : 'Not checked in'}
                  </Text>
                </View>
                {isAttendedForSelectedDay ? (
                  <AntDesign name="checkcircle" size={24} color={colors.primary} />
                ) : (
                  <AntDesign name="checkcircleo" size={24} color={colors.gray} />
                )}
              </TouchableOpacity>
            );
          }}
        />

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
