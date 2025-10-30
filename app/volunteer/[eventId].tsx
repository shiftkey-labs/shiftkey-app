import React, { useMemo, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import { Alert } from "@/utils/alert";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import tw from "../styles/tailwind";
import server from "@/config/axios";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import state from "@/state";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';

// Define the Attendee type to fix TypeScript errors
type DayKey = `day${number}`;

type Attendee = {
  id: string;
  userId: string;
  fullName: string;
} & Partial<Record<DayKey, boolean>>;

// Draggable Checked-In Modal Component
const CheckedInModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  attendees: Attendee[];
  onMarkAbsent: (id: string) => void;
  colors: any;
  isDarkMode: boolean;
}> = ({ visible, onClose, attendees, onMarkAbsent, colors, isDarkMode }) => {
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow dragging down
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      const threshold = 150;

      if (event.translationY > threshold) {
        // Dismiss modal
        translateY.value = withTiming(1000, { duration: 200 }, () => {
          runOnJS(onClose)();
          translateY.value = 0;
        });
      } else {
        // Snap back
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={tw`flex-1 bg-black/50`}>
          <TouchableOpacity
            style={tw`flex-1`}
            activeOpacity={1}
            onPress={onClose}
          />
          <Reanimated.View
            style={[
              tw`absolute bottom-0 left-0 right-0 rounded-t-3xl`,
              {
                height: '68%',
                backgroundColor: isDarkMode ? colors.lightGray : colors.white,
              },
              animatedStyle
            ]}
          >
            {/* Drag Handle Area */}
            <GestureDetector gesture={panGesture}>
              <View style={tw`items-center pt-3 pb-2`}>
                <View style={[tw`w-12 h-1 rounded-full`, { backgroundColor: colors.gray }]} />
              </View>
            </GestureDetector>

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
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <SwipeableAttendeeItem
                  attendee={item}
                  onSwipe={onMarkAbsent}
                  colors={colors}
                  isDarkMode={isDarkMode}
                  swipeDirection="left"
                />
              )}
              ListEmptyComponent={
                attendees.length === 0 ? (
                  <View style={tw`p-8 items-center`}>
                    <Text style={{ color: colors.gray, textAlign: 'center' }}>
                      No checked-in participants yet
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
          </Reanimated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

// Swipeable Attendee Item Component using ReanimatedSwipeable
const SwipeableAttendeeItem: React.FC<{
  attendee: Attendee;
  onSwipe: (id: string) => void;
  colors: any;
  isDarkMode: boolean;
  swipeDirection: 'right' | 'left'; // right = check in, left = check out
}> = ({ attendee, onSwipe, colors, isDarkMode, swipeDirection }) => {
  const isRightSwipe = swipeDirection === 'right';

  // Render action for swipe right (check in)
  const renderRightActions = () => {
    return (
      <View style={[tw`flex-row items-center justify-start px-6 h-full`, { backgroundColor: '#22c55e' }]}>
        <AntDesign name="check" size={24} color="white" />
        <Text style={{ color: 'white', marginLeft: 8, fontSize: 16, fontWeight: '600' }}>
          Mark Present
        </Text>
      </View>
    );
  };

  // Render action for swipe left (check out)
  const renderLeftActions = () => {
    return (
      <View style={[tw`flex-row items-center justify-end px-6 h-full`, { backgroundColor: '#ef4444' }]}>
        <Text style={{ color: 'white', marginRight: 8, fontSize: 16, fontWeight: '600' }}>
          Mark Absent
        </Text>
        <AntDesign name="close" size={24} color="white" />
      </View>
    );
  };

  return (
    <ReanimatedSwipeable
      friction={1.5}
      enableTrackpadTwoFingerGesture
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={60}
      rightThreshold={60}
      renderLeftActions={isRightSwipe ? renderRightActions : undefined}
      renderRightActions={!isRightSwipe ? renderLeftActions : undefined}
      onSwipeableWillOpen={() => onSwipe(attendee.id)}
    >
      <View style={[tw`flex-row justify-between items-center p-4 rounded-lg shadow-sm`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'semibold' }}>
          {attendee.fullName || "Unknown attendee"}
        </Text>
      </View>
    </ReanimatedSwipeable>
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
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [processingQR, setProcessingQR] = useState(false);
  const [processingName, setProcessingName] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [eventTitle, setEventTitle] = useState(eventNameParam ?? "Event");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDayKey, setSelectedDayKey] = useState<DayKey | null>(null);
  const [availableDayKeys, setAvailableDayKeys] = useState<DayKey[]>([]);
  const [initialDayKeyFromParams, setInitialDayKeyFromParams] = useState<DayKey | null>(() => {
    // Derive initial day from URL params
    if (initialDayLabelParam && /^day\d+$/.test(initialDayLabelParam)) {
      return initialDayLabelParam as DayKey;
    }
    if (initialDayParam && /^\d+$/.test(initialDayParam)) {
      return `day${initialDayParam}` as DayKey;
    }
    return null;
  });
  const [showDayModal, setShowDayModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCheckedInModal, setShowCheckedInModal] = useState(false);
  const { isDarkMode, colors } = useTheme();
  const selectedDayNumber = useMemo(() => {
    if (!selectedDayKey) return null;
    const parsed = parseInt(selectedDayKey.replace("day", ""), 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [selectedDayKey]);

  useEffect(() => {
    if (eventId) {
      fetchAttendees();
    }
  }, [eventId]);

  // Prompt user to select day if not set (only needed if auto-selection didn't work)
  useEffect(() => {
    if (!loading && !selectedDayKey && availableDayKeys.length > 1) {
      // Only show modal if there are multiple days and none is selected
      // (single day is auto-selected in fetchAttendees)
      setShowDayModal(true);
    }
  }, [loading, selectedDayKey, availableDayKeys.length]);

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

      const dayKeySet = new Set<DayKey>();
      const normalisedAttendees: Attendee[] = payload.data.map((record: any) => {
        const attendee: Attendee = {
          id: String(record?.id ?? record?.userId ?? Math.random()),
          userId: String(record?.userId ?? ""),
          fullName: record?.fullName?.toString() ?? "Unknown attendee",
        };

        Object.keys(record || {}).forEach((key) => {
          if (/^day\d+$/.test(key)) {
            const dayKey = key as DayKey;
            dayKeySet.add(dayKey);
            attendee[dayKey] = Boolean(record?.[key]);
          }
        });

        return attendee;
      });

      if (initialDayKeyFromParams) {
        dayKeySet.add(initialDayKeyFromParams);
      }

      const sortedDayKeys = Array.from(dayKeySet).sort(
        (a, b) => parseInt(a.replace("day", ""), 10) - parseInt(b.replace("day", ""), 10)
      );

      setAvailableDayKeys(sortedDayKeys);
      setSelectedDayKey((current) => {
        // Keep current selection if still valid
        if (current && sortedDayKeys.includes(current)) {
          return current;
        }
        // Try to use initial day from params if valid
        if (initialDayKeyFromParams && sortedDayKeys.includes(initialDayKeyFromParams)) {
          return initialDayKeyFromParams;
        }
        // Auto-select only when there's a single option
        if (sortedDayKeys.length === 1) {
          return sortedDayKeys[0];
        }
        return null;
      });

      setAttendees(normalisedAttendees);
      setTotalRegistered(normalisedAttendees.length);
    } catch (error) {
      console.error("Failed to fetch attendees:", error?.message);
      Alert.alert("Error", "Failed to fetch attendees.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAttendance = async (registrationId: string, checkIn: boolean = true) => {
    if (!selectedDayKey) {
      Alert.alert("Error", "Please select a day first.");
      setShowDayModal(true);
      return;
    }

    try {
      // Optimistically remove from UI
      setAttendees(prev => prev.filter(a => a.id !== registrationId));

      // PATCH the registration record with the day field
      await server.patch(`/registration/${registrationId}`, {
        [selectedDayKey]: checkIn
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

      // Find the attendee's name
      const attendee = attendees.find(a => a.id === qrData.registrationId);
      const attendeeName = attendee?.fullName || "Attendee";

      // Show processing overlay with name
      setProcessingName(attendeeName);
      setProcessingQR(true);

      // Mark attendance using the registration ID
      await markAttendance(qrData.registrationId, true);
      setProcessingQR(false);
      setProcessingName("");
      Alert.alert("Success", "Attendance marked successfully!");
    } catch (error) {
      setProcessingQR(false);
      setProcessingName("");
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
    // Total registered uses the separate state that only updates on API response
    const checkedIn = selectedDayKey
      ? attendees.filter((attendee) => Boolean(attendee[selectedDayKey])).length
      : 0;

    return { totalRegistered, checkedIn };
  }, [attendees, selectedDayKey, totalRegistered]);

  const filteredAttendees = useMemo(() => {
    // First filter out already checked-in users for the selected day
    const uncheckedAttendees = selectedDayKey
      ? attendees.filter((attendee) => !Boolean(attendee[selectedDayKey]))
      : attendees;

    // Then apply search filter
    const normalisedQuery = searchQuery.trim().toLowerCase();
    if (!normalisedQuery) {
      return uncheckedAttendees;
    }

    return uncheckedAttendees.filter((attendee) =>
      attendee.fullName?.toLowerCase().includes(normalisedQuery)
    );
  }, [attendees, searchQuery, selectedDayKey]);

  const checkedInAttendees = useMemo(() => {
    // Filter to show only checked-in users for the selected day
    return selectedDayKey
      ? attendees.filter((attendee) => Boolean(attendee[selectedDayKey]))
      : [];
  }, [attendees, selectedDayKey]);

  if (loading) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDarkMode ? colors.text : colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                Registered: {attendanceStats.totalRegistered}
              </Text>
              <Text style={{ color: colors.gray, fontSize: 14, marginHorizontal: 6 }}>•</Text>
              <TouchableOpacity
                onPress={() => setShowCheckedInModal(true)}
                disabled={checkedInAttendees.length === 0}
              >
                <Text style={{ color: checkedInAttendees.length > 0 ? colors.primary : colors.gray, fontSize: 14, fontWeight: checkedInAttendees.length > 0 ? '600' : 'normal' }}>
                  Checked In: {attendanceStats.checkedIn}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: colors.gray, fontSize: 14, marginHorizontal: 6 }}>•</Text>
              <TouchableOpacity
                onPress={() => setShowDayModal(true)}
                style={[
                  tw`px-3 py-1 rounded-full`,
                  { backgroundColor: selectedDayNumber ? colors.primary : colors.gray }
                ]}
              >
                <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600' }}>
                  {selectedDayNumber ? `Day ${selectedDayNumber}` : 'Select Day'}
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
        />

        {scanning && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={scanning}
            onRequestClose={() => setScanning(false)}
          >
            <View style={tw`flex-1`}>
              <CameraView
                style={tw`flex-1`}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
              />
              <View style={tw`absolute bottom-0 left-0 right-0 p-5`}>
                <TouchableOpacity
                  style={[tw`p-4 rounded-lg mb-10`, { backgroundColor: colors.primary }]}
                  onPress={() => setScanning(false)}
                >
                  <Text style={{ color: colors.white, textAlign: 'center', fontWeight: 'semibold' }}>Close Scanner</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {showDayModal && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showDayModal}
            onRequestClose={() => {
              // Only allow closing if a day is already selected
              if (selectedDayKey) {
                setShowDayModal(false);
              }
            }}
          >
            <View style={tw`flex-1 justify-center items-center bg-black/50`}>
              <View style={[tw`w-80 rounded-lg p-6`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                  Select Day
                </Text>
                {availableDayKeys.length > 0 ? (
                  availableDayKeys.map((dayKey) => {
                    const dayNumber = parseInt(dayKey.replace("day", ""), 10);
                    const isSelected = selectedDayKey === dayKey;

                    return (
                      <TouchableOpacity
                        key={dayKey}
                        onPress={() => {
                          setSelectedDayKey(dayKey);
                          setShowDayModal(false);
                        }}
                        style={[
                          tw`p-4 mb-2 rounded-lg`,
                          {
                            backgroundColor: isSelected
                              ? colors.primary
                              : (isDarkMode ? colors.background : colors.lightGray)
                          }
                        ]}
                      >
                        <Text
                          style={{
                            color: isSelected ? colors.white : colors.text,
                            fontSize: 16,
                            fontWeight: isSelected ? '600' : 'normal'
                          }}
                        >
                          Day {dayNumber}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <>
                    <Text style={{ color: colors.gray, textAlign: "center", marginBottom: 16 }}>
                      No day information available for this event.
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDayModal(false);
                        router.back();
                      }}
                      style={[tw`p-4 rounded-lg`, { backgroundColor: colors.primary }]}
                    >
                      <Text style={{ color: colors.white, fontSize: 16, textAlign: 'center', fontWeight: '600' }}>
                        Go Back
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                {selectedDayKey && availableDayKeys.length > 0 && (
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
          onMarkAbsent={(id) => markAttendance(id, false)}
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

      {/* Processing QR Code Overlay */}
      {processingQR && (
        <View style={[tw`absolute inset-0 items-center justify-center`, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
          <View style={[tw`p-8 rounded-2xl items-center max-w-sm mx-4`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
            <ActivityIndicator size="large" color={colors.primary} style={tw`mb-4`} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>
              Checking {processingName} in
            </Text>
            <Text style={{ color: colors.gray, fontSize: 14, textAlign: 'center' }}>
              Please wait...
            </Text>
          </View>
        </View>
      )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default EventAttendance;
