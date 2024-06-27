// app/tabs/myEvents.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import EventCard from "@/components/home/EventCard";
import eventsData from "@/constants/eventsData"; // Replace with the actual data source for booked events

const MyEvents = () => {
  const router = useRouter();

  const handlePressEvent = (eventId: string) => {
    router.push({ pathname: `/event/${eventId}` });
  };

  const bookedEvents = eventsData.filter((event) => event.booked);

  return (
    <SafeAreaView style={tw`flex-1 bg-background p-5`}>
      <View style={tw`flex-1 bg-background p-5`}>
        <Text style={tw`text-2xl font-montserratBold mb-5`}>Events</Text>
        <View style={tw`flex-row mb-5`}>
          <TouchableOpacity style={tw`flex-1 bg-primary p-3 rounded-full mr-2`}>
            <Text style={tw`text-center text-white`}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 bg-gray-200 p-3 rounded-full ml-2`}
          >
            <Text style={tw`text-center text-gray-600`}>Past Events</Text>
          </TouchableOpacity>
        </View>
        {bookedEvents.length > 0 ? (
          <ScrollView>
            {bookedEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                location={event.location}
                date={event.date}
                image={event.image}
                onPress={() => handlePressEvent(event.id)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={tw`flex-1 items-center justify-center`}>
            <Text style={tw`text-xl font-montserratBold mb-2`}>
              No Upcoming Event
            </Text>
            <Text style={tw`text-gray-600 mb-5`}>No Result Show</Text>
            <TouchableOpacity
              style={tw`bg-primary p-4 rounded-lg`}
              onPress={() => router.push("/")}
            >
              <Text style={tw`text-white text-center`}>Explore Events</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyEvents;
