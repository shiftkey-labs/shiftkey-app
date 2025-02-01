import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import EventCard from "@/components/home/EventCard";
import { observer } from "@legendapp/state/react";
import state from "../state";
import { fetchUserRegistrations } from "../state/registrationState";
import { fetchEventDetails } from "../state/eventState";
import { useTheme } from "@/context/ThemeContext";

const MyEvents = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = state.user.userState.get();
  const events = state.event.eventState.get();
  const userRegistrations =
    state.registration.registrationState.userRegistrations.get();
  const { isDarkMode, colors } = useTheme();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user.id) {
      fetchLocalUserRegistrations(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (userRegistrations.length > 0) {
      console.log("userRegistrations", userRegistrations);

      const upcoming = userRegistrations[0].filter((event) => {
        return new Date(event.startDate) >= new Date();
      });

      const past = userRegistrations[0].filter((event) => {
        return new Date(event.startDate) < new Date();
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    }
  }, [userRegistrations]);

  const fetchLocalUserRegistrations = async (uid: string) => {
    try {
      setIsLoading(true);
      await fetchUserRegistrations(uid);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressEvent = async (eventId: string) => {
    console.log("eventId", eventId);

    try {
      await fetchEventDetails(eventId);
      router.push(`/event/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const eventsToDisplay =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  if (isLoading) {
    return (
      <SafeAreaView style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDarkMode ? colors.text : colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1 p-5`, { backgroundColor: colors.background }]}>
      <View style={[tw`flex-1 p-5`, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>My Events</Text>
        <View style={tw`flex-row mb-5`}>
          <TouchableOpacity
            style={[
              tw`flex-1 p-3 rounded-full mr-2`,
              activeTab === "upcoming"
                ? { backgroundColor: colors.primary }
                : { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
            ]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={{
                textAlign: 'center',
                color: activeTab === "upcoming" ? colors.white : colors.gray,
              }}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              tw`flex-1 p-3 rounded-full ml-2`,
              activeTab === "past"
                ? { backgroundColor: colors.primary }
                : { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
            ]}
            onPress={() => setActiveTab("past")}
          >
            <Text
              style={{
                textAlign: 'center',
                color: activeTab === "past" ? colors.white : colors.gray,
              }}
            >
              Past Events
            </Text>
          </TouchableOpacity>
        </View>
        {eventsToDisplay.length > 0 ? (
          <ScrollView>
            {eventsToDisplay.map((event) => (
              <EventCard
                key={event.id}
                title={event.eventName}
                location={event.location}
                date={event.startDate.split("T")[0]}
                images={event.images}
                onPress={() => handlePressEvent(event.id)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              No {activeTab === "upcoming" ? "Upcoming" : "Past"} Event
            </Text>
            <Text style={{ color: colors.gray, marginBottom: 20 }}>No Result Show</Text>
            <TouchableOpacity
              style={[tw`p-4 rounded-lg`, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/")}
            >
              <Text style={{ color: colors.white, textAlign: 'center' }}>Explore Events</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

export default MyEvents;
