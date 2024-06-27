// app/tabs/myEvents.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "../styles/tailwind";
import EventCard from "@/components/home/EventCard";
import state from "../state";
import { getUserBookings } from "@/helpers/userHelpers";

const MyEvents = () => {
  const router = useRouter();
  const [bookedEvents, setBookedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = state.user.get();
  const events = state.events.get();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user.uid) {
        const bookings = await getUserBookings(user.uid);
        const formattedEvents = formatBookings(events, bookings);
        setBookedEvents(formattedEvents);
      }
    };
    fetchBookings();
  }, [user, events]);

  const formatBookings = (events, bookings) => {
    return events
      .filter((event) => bookings[event.id])
      .map((event) => ({
        ...event,
        bookingDate: bookings[event.id].bookingDate,
        attendance: bookings[event.id].attendance,
      }));
  };

  const handlePressEvent = (eventId: string) => {
    router.push({ pathname: `/event/${eventId}` });
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = bookedEvents.filter((event) => event.date >= today);
  const pastEvents = bookedEvents.filter((event) => event.date < today);

  const eventsToDisplay =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <SafeAreaView style={tw`flex-1 bg-background p-5`}>
      <View style={tw`flex-1 bg-background p-5`}>
        <Text style={tw`text-2xl font-montserratBold mb-5`}>Events</Text>
        <View style={tw`flex-row mb-5`}>
          <TouchableOpacity
            style={[
              tw`flex-1 p-3 rounded-full mr-2`,
              activeTab === "upcoming" ? tw`bg-primary` : tw`bg-gray-200`,
            ]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={[
                tw`text-center`,
                activeTab === "upcoming" ? tw`text-white` : tw`text-gray-600`,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              tw`flex-1 p-3 rounded-full ml-2`,
              activeTab === "past" ? tw`bg-primary` : tw`bg-gray-200`,
            ]}
            onPress={() => setActiveTab("past")}
          >
            <Text
              style={[
                tw`text-center`,
                activeTab === "past" ? tw`text-white` : tw`text-gray-600`,
              ]}
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
              No {activeTab === "upcoming" ? "Upcoming" : "Past"} Event
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
