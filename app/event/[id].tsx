import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../styles/tailwind";
import { FontAwesome } from "@expo/vector-icons";
import state from "@/state";
import { useTheme } from "@/context/ThemeContext";
import { EventDetails as EventDetailsType } from "@/types/event";
import { dummyImageUrl } from "@/constants/statics";
import QRCode from "react-native-qrcode-svg";

const EventDetails = () => {
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const currentEvent = state.event.eventState.currentEvent.get() as EventDetailsType | null;
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  const { isDarkMode, colors } = useTheme();
  const currentEventId = currentEvent?.id ?? eventId ?? null;
  const registrationLink = currentEvent?.registrationLink;

  const parseDate = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatDateLabel = (value?: string | null, fallback = "No date provided") => {
    if (!value) return fallback;
    const parsed = parseDate(value);
    if (!parsed) {
      return value;
    }
    return parsed.toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      // If event is already loaded and matches the requested ID, skip loading
      if (currentEvent && String(currentEvent.id) === String(eventId)) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const event = await state.event.fetchEventDetails(eventId);

        if (!event) {
          Alert.alert("Event Unavailable", "We couldn't load details for this event.");
        }

      } catch (error) {
        console.error("Failed to fetch event details:", error);
        Alert.alert("Error", "Unable to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!currentEvent) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: colors.background }]}>
        <Text style={tw`text-xl`}>Event not found</Text>
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (!registrationLink) {
      Alert.alert("No Link", "This event doesn't have a registration link.");
      return;
    }

    try {
      await Share.share({
        message: `Register for ${currentEvent?.eventName || 'this event'}: ${registrationLink}`,
        url: registrationLink,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleMarkAttendance = () => {
    const preferredParentId =
      typeof currentEvent?.parentEventID === "string" && currentEvent.parentEventID.trim()
        ? currentEvent.parentEventID.trim()
        : typeof currentEventId === "string" && currentEventId.trim()
          ? currentEventId.trim()
          : null;

    if (!preferredParentId) {
      return;
    }

    const attendanceDay =
      typeof currentEvent?.day === "number" && Number.isFinite(currentEvent.day)
        ? currentEvent.day
        : null;
    const attendanceDayLabel =
      typeof currentEvent?.dayLabel === "string" && currentEvent.dayLabel.trim()
        ? currentEvent.dayLabel.trim()
        : null;

    state.event.eventState.attendanceContext.set({
      parentEventId: preferredParentId,
      day: attendanceDay,
      dayLabel: attendanceDayLabel,
    });

    const params: Record<string, string> = {
      eventId: preferredParentId,
    };

    if (attendanceDay !== null) {
      params.day = String(attendanceDay);
    }

    if (attendanceDayLabel) {
      params.dayLabel = attendanceDayLabel;
    }

    const eventName =
      typeof currentEvent?.eventName === "string" && currentEvent.eventName.trim()
        ? currentEvent.eventName.trim()
        : null;
    if (eventName) {
      params.eventName = eventName;
    }

    router.push({ pathname: "/volunteer/[eventId]", params });
  };

  const heroImageUri = (() => {
    const directImage =
      typeof currentEvent?.image === "string" ? currentEvent.image?.trim() : "";

    if (directImage) {
      return directImage;
    }

    const legacyImages = (currentEvent as unknown as { images?: Array<{ url?: string }> })
      ?.images;
    const legacyImageUrl =
      legacyImages?.find((image) => typeof image?.url === "string" && image.url.trim())
        ?.url?.trim() ?? "";

    return legacyImageUrl || dummyImageUrl;
  })();
  const staffOnShift = Array.isArray(currentEvent?.volunteers)
    ? currentEvent.volunteers
        .filter((volunteer): volunteer is string => typeof volunteer === "string")
        .map((volunteer) => volunteer.trim())
        .filter(Boolean)
    : [];
  const formattedStartDate = formatDateLabel(currentEvent?.startDate);

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <View style={tw`flex-1`}>
        <View
          style={[
            tw`absolute w-full h-84`,
            {
              overflow: "hidden",
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              backgroundColor: colors.background,
            },
          ]}
        >
          <Image
            source={{ uri: heroImageUri }}
            style={tw`w-full h-full`}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          onPress={handleBack}
          style={[
            tw`absolute top-5 left-5 z-10 p-3 rounded-md shadow-md`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
          ]}
        >
          <FontAwesome name="chevron-left" size={20} color={colors.text} />
        </TouchableOpacity>
        {registrationLink && (
          <TouchableOpacity
            onPress={() => setShowQRModal(true)}
            style={[
              tw`absolute top-5 right-5 z-10 p-3 rounded-md shadow-md`,
              { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
            ]}
          >
            <FontAwesome name="share-alt" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pt-72`}>
          <View style={[
            tw`p-5 rounded-t-lg mt-[-10]`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white }
          ]}>
            <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold', marginTop: 8 }}>
              {currentEvent?.eventName || "Event Name"}
            </Text>
            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name="map-marker" size={24} color={colors.primary} />
              <Text style={{ color: colors.gray, fontSize: 18, marginLeft: 16 }}>
                {currentEvent?.location || "No location specified"}
              </Text>
            </View>

            <View style={tw`flex-row items-center mt-3`}>
              <FontAwesome name="calendar" size={24} color={colors.primary} />
              <Text style={{ color: colors.gray, fontSize: 18, marginLeft: 16 }}>
                {formattedStartDate}
              </Text>
            </View>

            {(currentEvent?.parentRegistrationCount ?? 0) > 0 && (
              <View style={tw`flex-row items-center mt-3`}>
                <FontAwesome name="users" size={24} color={colors.primary} />
                <Text style={{ color: colors.gray, fontSize: 18, marginLeft: 16 }}>
                  {currentEvent.parentRegistrationCount} {currentEvent.parentRegistrationCount === 1 ? 'participant' : 'participants'} registered
                </Text>
              </View>
            )}

            {staffOnShift.length > 0 && (
              <>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
                  Staff on this shift
                </Text>
                {staffOnShift.map((member, index) => (
                  <Text
                    key={`${member}-${index}`}
                    style={{ color: colors.gray, marginTop: index === 0 ? 8 : 4 }}
                  >
                    {member}
                  </Text>
                ))}
              </>
            )}
            {(currentEvent?.parentRegistrationCount ?? 0) > 0 && (
              <TouchableOpacity
                style={[
                  tw`mt-5 p-4 rounded-lg`,
                  { backgroundColor: colors.primary }
                ]}
                onPress={handleMarkAttendance}
              >
                <Text style={{ color: colors.white, textAlign: "center" }}>
                  Mark Attendance
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={tw`flex-1 bg-black/70 justify-center items-center`}>
          <View style={[tw`w-11/12 max-w-md rounded-2xl p-6`, { backgroundColor: isDarkMode ? colors.lightGray : colors.white }]}>
            <Text style={[tw`text-2xl font-bold text-center mb-4`, { color: colors.text }]}>
              {currentEvent?.eventName || "Event"}
            </Text>

            <Text style={[tw`text-center mb-6`, { color: colors.gray }]}>
              Scan this QR Code to register for this event
            </Text>

            <View style={tw`items-center mb-6`}>
              {registrationLink ? (
                <QRCode
                  value={registrationLink}
                  size={200}
                  backgroundColor={isDarkMode ? colors.lightGray : colors.white}
                  color={isDarkMode ? colors.text : colors.black}
                />
              ) : (
                <Text style={{ color: colors.gray }}>No registration link available</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setShowQRModal(false)}
              style={[tw`py-4 rounded-lg`, { backgroundColor: colors.primary }]}
            >
              <Text style={[tw`text-center font-semibold`, { color: colors.white }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EventDetails;
