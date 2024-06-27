// app/tabs/myEvents.tsx
import React, { useState, useEffect } from "react";
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
import { observer } from "@legendapp/state/react";
import axios from "axios";
import state from "../state";
import { getUserBookings } from "@/helpers/userHelpers";

const MyEvents = () => {
  const router = useRouter();
  const [bookedEvents, setBookedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = state.user.get();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user.uid) {
        const bookings = await getUserBookings(user.uid);
        const events = await fetchEventsData(Object.keys(bookings));
        const formattedEvents = formatBookings(events, bookings);
        setBookedEvents(formattedEvents);
      }
    };
    fetchBookings();
  }, [user]);

  const fetchEventsData = async (eventIds) => {
    const events = await Promise.all(
      eventIds.map(async (id) => {
        const response = await axios.get(
          `https://shiftkeylabs.ca/wp-json/tribe/events/v1/events/${id}`
        );
        return response.data;
      })
    );
    return events;
  };

  const formatBookings = (events, bookings) => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      location: event.venue ? event.venue.venue : "No location provided",
      date: event.start_date,
      image: event.image ? event.image.url : null,
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
