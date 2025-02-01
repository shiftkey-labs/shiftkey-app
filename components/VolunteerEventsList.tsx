import tw from "@/app/styles/tailwind";
import { Link, useRouter } from "expo-router";
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import EventCard from "./home/EventCard";
import BigBoyCard from "./home/BigBoyCard";

const VolunteerEventsList = ({ events }) => {
  console.log("events", events);
  const router = useRouter();
  const dummyImageUrl = "https://example.com/dummy-image.png";
  const handlePressEvent = async (eventId: string) => {
    try {
      router.push(`/volunteer/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  };
  return (
    <ScrollView style={tw`p-5`}>
      <Text style={tw`text-3xl font-bold mb-5`}>Volunteered Events</Text>
      {events.length > 0 ? (
        <View>
          {events.map((event) => (
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
        <Text style={tw`text-lg text-gray-600`}>No volunteered events</Text>
      )}
    </ScrollView>
  );
};

export default VolunteerEventsList;
