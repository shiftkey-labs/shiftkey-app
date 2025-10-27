import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../styles/tailwind";
import EventCard from "@/components/home/EventCard";
import SectionHeader from "@/components/home/SectionHeader";
import RefreshableScrollView from "@/components/common/RefreshableScrollView";
import { useRouter, useFocusEffect } from "expo-router";
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
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
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
    // Prevent multiple simultaneous presses
    if (loadingEventId) return;

    setLoadingEventId(eventId);

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoadingEventId(null);
    }, 10000); // 10 second timeout

    try {
      await events.fetchEventDetails(eventId);
      clearTimeout(timeout);
      router.push(`/event/${eventId}`);
      // Don't clear loading here - useFocusEffect will clear it when we return
    } catch (error) {
      clearTimeout(timeout);
      console.error("Failed to load event details:", error);
      // Alert is handled by axios interceptor
      // Clear loading state on error so user can retry
      setLoadingEventId(null);
    }
  }, [events, router, loadingEventId]);

  const handlePressSeeAll = (section: string) => {
    // TODO: Navigate to full events list
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

  // Clear loading state when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      setLoadingEventId(null);
    }, [])
  );

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
              isLoading={loadingEventId === targetId}
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
