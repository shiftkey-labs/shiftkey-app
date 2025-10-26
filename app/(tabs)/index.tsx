import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import tw from "../styles/tailwind";
import EventCard from "@/components/home/EventCard";
import SectionHeader from "@/components/home/SectionHeader";
import RefreshableScrollView from "@/components/common/RefreshableScrollView";
import { useRouter } from "expo-router";
import state from "@/state";
import { initializeAuth } from "@/state/userState";
import { useTheme } from "@/context/ThemeContext";
import { UpcomingEvent } from "@/types/event";
import { getUpcomingEvents } from "@/api/eventApi";
const Home: React.FC = () => {
  const router = useRouter();
  const events = state.event;
  const user = state.user.userState.get();
  const [eventsList, setEventsList] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, colors } = useTheme();

  const loadEvents = useCallback(async () => {
    try {
      const response = await getUpcomingEvents();
      if (response?.success && Array.isArray(response.events)) {
        setEventsList(response.events);
      } else {
        setEventsList([]);
      }
    } catch (error) {
      console.error("Failed to load upcoming events:", error);
      setEventsList([]);
    }
  }, []);

  const handlePressEvent = useCallback(async (eventId: string) => {
    try {
      await events.fetchEventDetails(eventId);
      router.push(`/event/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  }, [events, router]);

  const handlePressSeeAll = (section: string) => {
    console.log("See all pressed for section:", section);
  };

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        await initializeAuth();
        await loadEvents();
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [loadEvents]);

  if (isLoading) {
    return (
      <SafeAreaView style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDarkMode ? colors.text : colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <RefreshableScrollView
        style={[tw`flex-1 p-5`, { backgroundColor: colors.background }]}
        contentContainerStyle={tw`pb-6`}
        onRefresh={loadEvents}
      >
        <View style={tw`pt-5`}>
          <Text style={{ color: colors.text, fontSize: 36, fontWeight: 'bold' }}>
            Hi {user.firstName}
          </Text>
        </View>
        <SectionHeader
          title="Upcoming Events"
          onPressSeeAll={() => handlePressSeeAll("Upcoming Events")}
        />
        {eventsList.map((event) => {
          const targetId = event.parentEventID || event.id;
          return (
            <EventCard
              key={event.id}
              title={event.eventName || "No Title"}
              location={event.location || "No Location"}
              date={event.startDate || ""}
              imageUrl={event.image}
              onPress={() => handlePressEvent(targetId)}
            />
          );
        })}
        {eventsList.length === 0 && (
          <Text style={{ color: colors.gray, marginTop: 16 }}>
            No upcoming events found.
          </Text>
        )}
      </RefreshableScrollView>
    </SafeAreaView>
  );
};

export default Home;
