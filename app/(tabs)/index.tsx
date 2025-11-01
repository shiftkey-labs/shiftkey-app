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
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useRouter, useFocusEffect } from "expo-router";
import state from "@/state";
import { initializeAuth } from "@/state/userState";
import { useTheme } from "@/context/ThemeContext";
import { UpcomingEvent } from "@/types/event";
import { getUpcomingEvents } from "@/api/eventApi";
import { groupEventsByTime } from "@/utils/groupEventsByTime";
const Home: React.FC = () => {
  const router = useRouter();
  const events = state.event;
  const user = state.user.userState.get();
  const [eventsList, setEventsList] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const [loadingEventName, setLoadingEventName] = useState<string>("");
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

  // Group events by time period using reusable utility
  const groupedEvents = useCallback(() => {
    return groupEventsByTime(eventsList);
  }, [eventsList]);

  const handlePressEvent = useCallback(async (eventId: string, eventName: string) => {
    // Prevent multiple simultaneous presses
    if (loadingEventId) return;

    setLoadingEventId(eventId);
    setLoadingEventName(eventName);

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoadingEventId(null);
      setLoadingEventName("");
    }, 10000); // 10 second timeout

    try {
      await events.fetchEventDetails(eventId);
      clearTimeout(timeout);
      setLoadingEventId(null);
      setLoadingEventName("");
      router.push(`/event/${eventId}`);
    } catch (error) {
      clearTimeout(timeout);
      console.error("Failed to load event details:", error);
      // Alert is handled by axios interceptor
      // Clear loading state on error so user can retry
      setLoadingEventId(null);
      setLoadingEventName("");
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
        // Only load events if user is authenticated
        const currentUser = state.user.userState.get();
        if (currentUser) {
          await loadEvents();
        }
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
      setLoadingEventName("");
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
        <View style={tw`pt-5 mb-4`}>
          <Text style={{ color: colors.text, fontSize: 36, fontWeight: 'bold' }}>
            👋 {user.firstName}
          </Text>
          <Text style={{ color: colors.gray, fontSize: 16, marginTop: 4 }}>
            Upcoming Events
          </Text>
        </View>

        {(() => {
          const groups = groupedEvents();
          const hasEvents = eventsList.length > 0;

          if (!hasEvents) {
            return (
              <Text style={{ color: colors.gray, marginTop: 16 }}>
                No upcoming events found.
              </Text>
            );
          }

          return (
            <>
              {groups.today.length > 0 && (
                <>
                  <SectionHeader
                    title="Today"
                    onPressSeeAll={() => handlePressSeeAll("Today")}
                  />
                  {groups.today.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.eventName || "No Title"}
                      location={event.location || "No Location"}
                      date={event.startDate || ""}
                      imageUrl={event.image}
                      onPress={() => handlePressEvent(event.id, event.eventName || "Event")}
                      isLoading={loadingEventId === event.id}
                    />
                  ))}
                </>
              )}

              {groups.thisWeek.length > 0 && (
                <>
                  <SectionHeader
                    title="This Week"
                    onPressSeeAll={() => handlePressSeeAll("This Week")}
                  />
                  {groups.thisWeek.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.eventName || "No Title"}
                      location={event.location || "No Location"}
                      date={event.startDate || ""}
                      imageUrl={event.image}
                      onPress={() => handlePressEvent(event.id, event.eventName || "Event")}
                      isLoading={loadingEventId === event.id}
                    />
                  ))}
                </>
              )}

              {groups.nextWeek.length > 0 && (
                <>
                  <SectionHeader
                    title="Next Week"
                    onPressSeeAll={() => handlePressSeeAll("Next Week")}
                  />
                  {groups.nextWeek.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.eventName || "No Title"}
                      location={event.location || "No Location"}
                      date={event.startDate || ""}
                      imageUrl={event.image}
                      onPress={() => handlePressEvent(event.id, event.eventName || "Event")}
                      isLoading={loadingEventId === event.id}
                    />
                  ))}
                </>
              )}

              {groups.thisMonth.length > 0 && (
                <>
                  <SectionHeader
                    title="This Month"
                    onPressSeeAll={() => handlePressSeeAll("This Month")}
                  />
                  {groups.thisMonth.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.eventName || "No Title"}
                      location={event.location || "No Location"}
                      date={event.startDate || ""}
                      imageUrl={event.image}
                      onPress={() => handlePressEvent(event.id, event.eventName || "Event")}
                      isLoading={loadingEventId === event.id}
                    />
                  ))}
                </>
              )}

              {groups.later.length > 0 && (
                <>
                  <SectionHeader
                    title="Later"
                    onPressSeeAll={() => handlePressSeeAll("Later")}
                  />
                  {groups.later.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.eventName || "No Title"}
                      location={event.location || "No Location"}
                      date={event.startDate || ""}
                      imageUrl={event.image}
                      onPress={() => handlePressEvent(event.id, event.eventName || "Event")}
                      isLoading={loadingEventId === event.id}
                    />
                  ))}
                </>
              )}
            </>
          );
        })()}
      </RefreshableScrollView>
      <FullScreenLoader
        visible={!!loadingEventId}
        message={`Opening ${loadingEventName}`}
        subMessage="Please wait..."
      />
    </SafeAreaView>
  );
};

export default Home;
