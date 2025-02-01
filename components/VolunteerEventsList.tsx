import tw from "@/app/styles/tailwind";
import { Link, useRouter } from "expo-router";
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import EventCard from "./home/EventCard";
import BigBoyCard from "./home/BigBoyCard";
import { useTheme } from "@/context/ThemeContext";

interface VolunteerEvent {
  id: string;
  eventName?: string;
  startDate?: string;
  category?: string;
  images?: Array<{
    url: string;
    id?: string;
    filename?: string;
    size?: number;
    type?: string;
    thumbnails?: any;
  }>;
}

interface VolunteerEventsListProps {
  events: VolunteerEvent[];
}

const VolunteerEventsList: React.FC<VolunteerEventsListProps> = ({ events }) => {
  const router = useRouter();
  const { isDarkMode, colors } = useTheme();
  const dummyImageUrl = "https://example.com/dummy-image.png";

  const handlePressEvent = async (eventId: string) => {
    try {
      router.push(`/volunteer/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  };

  return (
    <ScrollView style={[tw`p-5`, { backgroundColor: isDarkMode ? colors.background : colors.background }]}>
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
              images={
                event.images?.length ? event.images : [{ url: dummyImageUrl }]
              }
              onPressShow={() => handlePressEvent(event.id)}
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
