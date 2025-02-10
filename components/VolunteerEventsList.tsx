import tw from "@/app/styles/tailwind";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, Alert } from "react-native";
import EventCard from "./home/EventCard";
import BigBoyCard from "./home/BigBoyCard";
import { useTheme } from "@/context/ThemeContext";
import { Image as ImageType } from "@/types/event";

interface VolunteerEvent {
  id: string;
  eventName?: string;
  startDate?: string;
  category?: string;
  images?: ImageType[];
  registration?: boolean;
}

interface VolunteerEventsListProps {
  events: VolunteerEvent[];
  onRefresh?: () => Promise<void>;
}

const VolunteerEventsList: React.FC<VolunteerEventsListProps> = ({ events, onRefresh }) => {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const dummyImage: ImageType = {
    id: "dummy",
    url: "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png",
    filename: "dummy.png",
    size: 0,
    type: "image/png",
    thumbnails: {
      small: { url: "https://example.com/dummy-image.png", width: 100, height: 100 },
      large: { url: "https://example.com/dummy-image.png", width: 300, height: 300 },
      full: { url: "https://example.com/dummy-image.png", width: 500, height: 500 }
    }
  };
  const [refreshing, setRefreshing] = useState(false);

  const handlePressEvent = async (eventId: string) => {
    try {
      router.push(`/volunteer/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  return (
    <ScrollView
      style={[tw`p-5`, { backgroundColor: isDarkMode ? colors.background : colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={isDarkMode ? colors.text : colors.primary}
        />
      }
    >
      <Text style={{
        color: isDarkMode ? colors.text : colors.text,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20
      }}>
        Volunteered Events
      </Text>
      {events.length > 0 ? (
        <View>
          {events.map((event: VolunteerEvent) => (
            <BigBoyCard
              key={event.id}
              title={event.eventName || "No Title"}
              date={event.startDate || "No Date"}
              style={"w-full my-2"}
              images={event.images?.length ? event.images : [dummyImage]}
              onPressShow={() => event.registration ? handlePressEvent(event.id) : Alert.alert("Event is not active")}
              category={event.category || "Event"}
            />
          ))}
        </View>
      ) : (
        <Text style={{ color: isDarkMode ? colors.gray : colors.gray, fontSize: 16 }}>
          No volunteered events
        </Text>
      )}
    </ScrollView>
  );
};

export default VolunteerEventsList;
