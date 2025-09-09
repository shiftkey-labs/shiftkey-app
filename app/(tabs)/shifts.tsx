import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from "react-native";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import ShiftEventCard from "@/components/shifts/ShiftEventCard";
import { getAvailableShifts, claimShift } from "@/api/shiftApi";
import state from "../state";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

interface Shift {
  id: string;
  shiftTime: string;
  isAvailable: boolean;
}

interface EventWithShifts {
  id: string;
  title: string;
  location: string;
  startDate: string;
  images: Array<{ url: string }>;
  availableShifts: Shift[];
  totalAvailableShifts: number;
}

export default function ShiftsScreen() {
  const { isDarkMode, colors } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<EventWithShifts | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [claimingShift, setClaimingShift] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Use regular React state instead of Legend State for now
  const [events, setEvents] = useState<EventWithShifts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = state.user.userState.get();

  const fetchShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const shifts = await getAvailableShifts();
      
      // Sort events by start date (earliest first)
      const sortedShifts = shifts.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
      });
      
      setEvents(sortedShifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setError(error.message || "Failed to fetch shifts");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchShifts();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleEventPress = (event: EventWithShifts) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleClaimShift = async (shiftId: string) => {
    if (!user.id) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    setClaimingShift(shiftId);
    try {
      await claimShift(shiftId, user.id);
      Alert.alert("Success", "Shift claimed successfully!");
      setModalVisible(false);
      // Refresh the shifts list
      fetchShifts();
    } catch (error) {
      console.error("Error claiming shift:", error);
      Alert.alert("Error", "Failed to claim shift. Please try again.");
    } finally {
      setClaimingShift(null);
    }
  };

  const formatShiftTime = (timeString: string) => {
    try {
      // Handle different time formats
      if (timeString.includes("-")) {
        return timeString;
      }
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          tw`flex-1 justify-center items-center`,
          { backgroundColor: colors.background }
        ]}
      >
        <ActivityIndicator
          size="large"
          color={isDarkMode ? colors.text : colors.primary}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        tw`flex-1`,
        { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View
        style={[
          tw`px-6 py-4 shadow-sm`,
          { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
        ]}
      >
        <View style={tw`flex-row items-center justify-center mb-2`}>
          <Ionicons name="briefcase-outline" size={28} color={colors.primary} />
          <Text
            style={[
              tw`text-2xl font-bold ml-3`,
              { color: colors.text }
            ]}
          >
            Available Shifts
          </Text>
        </View>
        <Text
          style={[
            tw`text-sm text-center`,
            { color: colors.gray }
          ]}
        >
          Tap on an event to view and claim shifts
        </Text>
      </View>

      <View style={[tw`flex-1 px-4 py-2`, { backgroundColor: colors.background }]}>
        {events.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={tw`pb-6`}
          >
            {events.map((event) => (
              <ShiftEventCard
                key={event.id}
                title={event.title}
                location={event.location}
                date={event.startDate?.split("T")[0] || ""}
                totalAvailableShifts={event.totalAvailableShifts}
                onPress={() => handleEventPress(event)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={tw`flex-1 justify-center items-center`}>
            <Ionicons name="briefcase-outline" size={64} color={colors.gray} />
            <Text
              style={[
                tw`text-lg font-semibold mt-4`,
                { color: colors.text }
              ]}
            >
              No Shifts Available
            </Text>
            <Text
              style={[
                tw`text-sm text-center mt-2 px-8`,
                { color: colors.gray }
              ]}
            >
              All shifts are currently assigned. Check back later for new opportunities.
            </Text>
          </View>
        )}
      </View>

      {/* Shift Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={tw`flex-1 justify-end bg-black bg-opacity-50`}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={[
              tw`rounded-t-3xl p-6 max-h-96`,
              { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
            ]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text
                style={[
                  tw`text-xl font-bold`,
                  { color: colors.text }
                ]}
              >
                {selectedEvent?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={tw`p-2`}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                tw`text-sm mb-4`,
                { color: colors.gray }
              ]}
            >
              Select a shift to claim:
            </Text>

            <ScrollView style={tw`max-h-64`}>
              {selectedEvent?.availableShifts.map((shift) => (
                <TouchableOpacity
                  key={shift.id}
                  style={[
                    tw`flex-row justify-between items-center p-4 rounded-lg mb-2 shadow-sm`,
                    { backgroundColor: isDarkMode ? colors.background : colors.white }
                  ]}
                  onPress={() => handleClaimShift(shift.id)}
                  disabled={claimingShift === shift.id}
                >
                  <View>
                    <Text
                      style={[
                        tw`font-semibold text-base`,
                        { color: colors.text }
                      ]}
                    >
                      {formatShiftTime(shift.shiftTime)}
                    </Text>
                    <Text
                      style={[
                        tw`text-sm mt-1`,
                        { color: colors.gray }
                      ]}
                    >
                      Available
                    </Text>
                  </View>
                  
                  {claimingShift === shift.id ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <View
                      style={[
                        tw`px-4 py-2 rounded-lg`,
                        { backgroundColor: colors.primary }
                      ]}
                    >
                      <Text
                        style={[
                          tw`text-sm font-semibold`,
                          { color: colors.white }
                        ]}
                      >
                        Claim
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}