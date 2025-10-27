import React, { useMemo, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Animated,
  PanResponder,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import tw from "../styles/tailwind";
import server from "@/config/axios";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import state from "@/state";

// Define the Attendee type to fix TypeScript errors
type DayKey = "day1" | "day2" | "day3" | "day4";

interface Attendee {
  id: string;
  userId: string;
  fullName: string;
  day1?: boolean;
  day2?: boolean;
  day3?: boolean;
  day4?: boolean;
}

// Draggable Checked-In Modal Component
const CheckedInModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  attendees: Attendee[];
  onSwipe: (id: string) => void;
  colors: any;
  isDarkMode: boolean;
}> = ({ visible, onClose, attendees, onSwipe, colors, isDarkMode }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical drags that are clearly downward
        const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        const isDownward = gestureState.dy > 0;
        const hasMovedEnough = Math.abs(gestureState.dy) > 10;
        return isVertical && isDownward && hasMovedEnough;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging down (positive dy)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 150; // Drag threshold to dismiss

        if (gestureState.dy > threshold) {
          // Dismiss modal
          Animated.timing(translateY, {
            toValue: 1000,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          // Snap back
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50`}>
        <TouchableOpacity
          style={tw`flex-1`}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            tw`absolute bottom-0 left-0 right-0 rounded-t-3xl`,
            {
              height: '68%',
              backgroundColor: isDarkMode ? colors.lightGray : colors.white,
              transform: [{ translateY }],
            }
          ]}
        >
          {/* Drag Handle Area */}
          <View {...panResponder.panHandlers} style={tw`items-center pt-3 pb-2`}>
            <View style={[tw`w-12 h-1 rounded-full`, { backgroundColor: colors.gray }]} />
          </View>

          {/* Modal Header */}
          <View style={tw`px-6 py-3`}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
              Checked In
            </Text>
            <Text style={{ color: colors.gray, fontSize: 14, textAlign: 'center', marginTop: 4 }}>
              {attendees.length} participant{attendees.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Checked-In List */}
          <View style={[tw`flex-1`, { backgroundColor: isDarkMode ? colors.background : '#f3f4f6' }]}>
            <FlatList
              data={attendees}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={tw`px-4 pb-4 pt-2`}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              scrollEnabled={true}
              directionalLockEnabled={false}
              renderItem={({ item }) => (
                <SwipeableAttendeeItem
                  attendee={item}
                  onSwipe={onSwipe}
                  colors={colors}
                  isDarkMode={isDarkMode}
                  swipeDirection="left"
                />
              )}
              ListEmptyComponent={
                <View style={tw`p-8 items-center`}>
                  <Text style={{ color: colors.gray, textAlign: 'center' }}>
                    No checked-in participants yet
                  </Text>
                </View>
              }
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Swipeable Attendee Item Component
const SwipeableAttendeeItem: React.FC<{
  attendee: Attendee;
  onSwipe: (id: string) => void;
  colors: any;
  isDarkMode: boolean;
  swipeDirection: 'right' | 'left'; // right = check in, left = check out
}> = ({ attendee, onSwipe, colors, isDarkMode, swipeDirection }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSwiping, setIsSwiping] = useState(false);

  const isRightSwipe = swipeDirection === 'right';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture if it's clearly a horizontal swipe (dx > dy)
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const hasMovedEnough = Math.abs(gestureState.dx) > 5;

        // Check if swipe is in the correct direction
        const isCorrectDirection = isRightSwipe
          ? gestureState.dx > 0  // Right swipe needs positive dx
          : gestureState.dx < 0; // Left swipe needs negative dx

        return isHorizontal && hasMovedEnough && isCorrectDirection;
      },
      onPanResponderTerminationRequest: () => false, // Don't allow termination once we've started
      onPanResponderGrant: () => {
        setIsSwiping(true);
      },
      onPanResponderMove: (_, gestureState) => {
        // Allow right swipe for check-in (positive dx) or left swipe for check-out (negative dx)
        if (isRightSwipe && gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
        } else if (!isRightSwipe && gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsSwiping(false);
        const threshold = 100; // Swipe threshold

        const swipeSuccess = isRightSwipe
          ? gestureState.dx > threshold
          : gestureState.dx < -threshold;

        if (swipeSuccess) {
          // Swipe successful - animate out and mark attendance
          Animated.timing(translateX, {
            toValue: isRightSwipe ? 500 : -500,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            onSwipe(attendee.id);
          });
        } else {
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={tw`overflow-hidden rounded-lg`}>
      <View
        style={[
          tw`absolute inset-0 flex-row items-center rounded-lg`,
          isRightSwipe ? tw`px-6` : tw`px-6 justify-end`,
          { backgroundColor: isRightSwipe ? '#22c55e' : '#ef4444' }, // green for check-in, red for check-out
        ]}
      >
        {isRightSwipe ? (
          <>
            <AntDesign name="check" size={24} color="white" />
            <Text style={{ color: 'white', marginLeft: 8, fontSize: 16, fontWeight: '600' }}>
              Mark Present
            </Text>
          </>
        ) : (
          <>
            <Text style={{ color: 'white', marginRight: 8, fontSize: 16, fontWeight: '600' }}>
              Mark Absent
            </Text>
            <AntDesign name="close" size={24} color="white" />
          </>
        )}
      </View>
      <Animated.View
        style={[
          tw`flex-row justify-between items-center p-4 rounded-lg shadow-sm`,
          {
            backgroundColor: isDarkMode ? colors.lightGray : colors.white,
            transform: [{ translateX }],
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'semibold' }}>
            {attendee.fullName || "Unknown attendee"}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const EventAttendance = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const attendanceContext = state.event.eventState.attendanceContext.get();
  const currentEventFromState = state.event.eventState.currentEvent.get();

  const extractParam = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  };

  // Extract params from URL or context
  const eventIdParam = extractParam(params.eventId) ?? attendanceContext.parentEventId ?? undefined;
  const initialDayParam = extractParam(params.day) ?? (attendanceContext.day !== null && attendanceContext.day !== undefined ? String(attendanceContext.day) : undefined);
  const initialDayLabelParam = extractParam(params.dayLabel) ?? attendanceContext.dayLabel ?? undefined;
  const eventNameParam = extractParam(params.eventName) ?? currentEventFromState?.eventName ?? undefined;

  const eventId = eventIdParam ? String(eventIdParam) : "";

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [eventTitle, setEventTitle] = useState(eventNameParam ?? "Event");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(initialDayParam ?? null);
  const [selectedDayLabel, setSelectedDayLabel] = useState<string | null>(initialDayLabelParam ?? null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCheckedInModal, setShowCheckedInModal] = useState(false);
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    if (eventId) {
      fetchAttendees();
    }
  }, [eventId]);

  // Prompt user to select day if not set
  useEffect(() => {
    if (!loading && !selectedDay) {
      setShowDayModal(true);
    }
  }, [loading, selectedDay]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const fetchAttendees = async (isRefreshing = false) => {
    if (!eventId) {
      setAttendees([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      const response = await server.get(`/registrations/${eventId}`);
      const payload = response.data;

      if (!payload?.success || !Array.isArray(payload.data)) {
        setAttendees([]);
        return;
      }

      const normalisedAttendees: Attendee[] = payload.data.map((record: any) => ({
        id: String(record?.id ?? record?.userId ?? Math.random()),
        userId: String(record?.userId ?? ""),
        fullName: record?.fullName?.toString() ?? "Unknown attendee",
        day1: Boolean(record?.day1),
        day2: Boolean(record?.day2),
        day3: Boolean(record?.day3),
        day4: Boolean(record?.day4),
      }));

      setAttendees(normalisedAttendees);
    } catch (error) {
      console.error("Failed to fetch attendees:", error?.message);
      Alert.alert("Error", "Failed to fetch attendees.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAttendance = async (registrationId: string, checkIn: boolean = true) => {
    if (!selectedDayLabel) {
      Alert.alert("Error", "Please select a day first.");
      setShowDayModal(true);
      return;
    }

    try {
      // Optimistically remove from UI
      setAttendees(prev => prev.filter(a => a.id !== registrationId));

      // PATCH the registration record with the day field
      await server.patch(`/registration/${registrationId}`, {
        [selectedDayLabel]: checkIn
      });

      // Refresh the list from server in the background
      await fetchAttendees(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Failed to ${checkIn ? 'check in' : 'check out'}.`);
      // Refetch on error to sync with backend
      await fetchAttendees();
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanning(false);
    try {
      // Decode base64 QR code data
      const decodedData = atob(data);
      const qrData = JSON.parse(decodedData);

      // Validate the structure
      if (!qrData.registrationId || !qrData.eventId) {
        Alert.alert("Invalid QR Code", "This QR code is not valid for attendance.");
        return;
      }

      // Check if the QR code is for this event
      if (qrData.eventId !== eventId) {
        Alert.alert(
          "Wrong Event",
          "This QR code is for a different event. Please scan the correct registration QR code."
        );
        return;
      }

      // Mark attendance using the registration ID
      await markAttendance(qrData.registrationId, true);
      Alert.alert("Success", "Attendance marked successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to scan QR code. Please try again or mark attendance manually.");
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendees(true);
  };

  const attendanceStats = useMemo(() => {
    // Total registered is always the full list count
    const totalRegistered = attendees.length;
    const checkedIn = selectedDayLabel
      ? attendees.filter((attendee) => Boolean(attendee[selectedDayLabel as DayKey])).length
      : 0;

    return { totalRegistered, checkedIn };
  }, [attendees, selectedDayLabel]);

  const filteredAttendees = useMemo(() => {
    // First filter out already checked-in users for the selected day
    const uncheckedAttendees = selectedDayLabel
      ? attendees.filter((attendee) => !Boolean(attendee[selectedDayLabel as DayKey]))
      : attendees;

    // Then apply search filter
    const normalisedQuery = searchQuery.trim().toLowerCase();
    if (!normalisedQuery) {
      return uncheckedAttendees;
    }

    return uncheckedAttendees.filter((attendee) =>
      attendee.fullName?.toLowerCase().includes(normalisedQuery)
    );
  }, [attendees, searchQuery, selectedDayLabel]);

  const checkedInAttendees = useMemo(() => {
    // Filter to show only checked-in users for the selected day
    return selectedDayLabel
      ? attendees.filter((attendee) => Boolean(attendee[selectedDayLabel as DayKey]))
      : [];
  }, [attendees, selectedDayLabel]);

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
      <View style={[tw`p-5 shadow-sm`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-2`}>
            <AntDesign name="left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={tw`flex-1 items-center`}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{eventTitle}</Text>
            <View style={tw`flex-row items-center mt-2`}>
              <Text style={{ color: colors.gray, fontSize: 14 }}>
                Registered: {attendanceStats.totalRegistered}  •  Checked In: {attendanceStats.checkedIn}  •
              </Text>
              <TouchableOpacity
                onPress={() => setShowDayModal(true)}
                style={[
                  tw`ml-1 px-3 py-1 rounded-full`,
                  { backgroundColor: selectedDay ? colors.primary : colors.gray }
                ]}
              >
                <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600' }}>
                  {selectedDay ? `Day ${selectedDay}` : 'Select Day'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`p-2`} />
        </View>
      </View>

      <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
        <View style={[tw`px-4 py-3`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
          <View style={[tw`flex-row items-center rounded-lg px-3 py-2`, { backgroundColor: isDarkMode ? colors.background : colors.lightGray }]}>
            <AntDesign name="search" size={20} color={colors.gray} style={tw`mr-2`} />
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

        <FlatList
          data={filteredAttendees}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`p-4`}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <SwipeableAttendeeItem
              attendee={item}
              onSwipe={(id) => markAttendance(id, true)}
              colors={colors}
              isDarkMode={isDarkMode}
              swipeDirection="right"
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListFooterComponent={
            checkedInAttendees.length > 0 ? (
              <TouchableOpacity
                onPress={() => setShowCheckedInModal(true)}
                style={tw`mt-6 mb-4 py-4 items-center`}
              >
                <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '600' }}>
                  View {checkedInAttendees.length} Checked In
                </Text>
              </TouchableOpacity>
            ) : null
          }
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

        {showDayModal && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showDayModal}
            onRequestClose={() => {
              // Only allow closing if a day is already selected
              if (selectedDay) {
                setShowDayModal(false);
              }
            }}
          >
            <View style={tw`flex-1 justify-center items-center bg-black/50`}>
              <View style={[tw`w-80 rounded-lg p-6`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                  Select Day
                </Text>
                {[1, 2, 3, 4].map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => {
                      setSelectedDay(String(day));
                      setSelectedDayLabel(`day${day}`);
                      setShowDayModal(false);
                    }}
                    style={[
                      tw`p-4 mb-2 rounded-lg`,
                      {
                        backgroundColor: selectedDay === String(day)
                          ? colors.primary
                          : (isDarkMode ? colors.background : colors.lightGray)
                      }
                    ]}
                  >
                    <Text style={{
                      color: selectedDay === String(day) ? colors.white : colors.text,
                      fontSize: 16,
                      fontWeight: selectedDay === String(day) ? '600' : 'normal'
                    }}>
                      Day {day}
                    </Text>
                  </TouchableOpacity>
                ))}
                {selectedDay && (
                  <TouchableOpacity
                    onPress={() => setShowDayModal(false)}
                    style={[tw`p-4 mt-2 rounded-lg border`, { borderColor: colors.gray }]}
                  >
                    <Text style={{ color: colors.gray, fontSize: 16, textAlign: 'center' }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>
        )}

        {/* Checked-In Participants Modal */}
        <CheckedInModal
          visible={showCheckedInModal}
          onClose={() => setShowCheckedInModal(false)}
          attendees={checkedInAttendees}
          onSwipe={(id) => markAttendance(id, false)}
          colors={colors}
          isDarkMode={isDarkMode}
        />
      </View>

      {/* Floating QR Scanner Button */}
      <TouchableOpacity
        onPress={openScanner}
        style={[
          tw`absolute bottom-8 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg`,
          { backgroundColor: colors.primary }
        ]}
      >
        <AntDesign name="qrcode" size={28} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EventAttendance;
