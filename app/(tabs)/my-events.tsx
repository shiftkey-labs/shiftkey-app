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

import { observer } from "@legendapp/state/react";
import state, { fetchUserBookings } from "../state";

const MyEvents = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = state.user.userState.get();
  const events = state.events.get();
  const userBookings = state.userBookings.get();

  useEffect(() => {
    if (user.uid) {
      fetchLocalUserBookings(user.uid);
    }
  }, [user]);

  const fetchLocalUserBookings = async (uid) => {
    await fetchUserBookings(uid);
  };

  const formatBookings = (events, bookings) => {
    const formattedEvents = bookings
      .map((booking) => {
        const event = events.find((e) => e.id.toString() === booking.eventId);
        if (event) {
          return {
            ...event,
            bookingDate: booking.bookingDate,
            attendance: booking.attendance,
          };
        }
        return null;
      })
      .filter((event) => event !== null);
    return formattedEvents;
  };

  const bookedEvents = formatBookings(events, userBookings);

  const handlePressEvent = (eventId: string) => {
    router.push({ pathname: `/event/${eventId}` });
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISOString = yesterday.toISOString().split("T")[0];

  const upcomingEvents = bookedEvents.filter(
    (event) => event.date >= yesterdayISOString
  );
  const pastEvents = bookedEvents.filter(
    (event) => event.date < yesterdayISOString
  );

  const eventsToDisplay =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <SafeAreaView style={tw`flex-1 bg-background p-5`}>
      <View style={tw`flex-1 bg-background p-5`}>
        <Text style={tw`text-3xl font-bold mb-5`}>My Events</Text>
        <View style={tw`flex-row mb-5`}>
          <TouchableOpacity
            style={[
              tw`flex-1 p-3 rounded-full mr-2`,
              activeTab === "upcoming" ? tw`bg-primary` : tw`bg-transparent`,
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
              activeTab === "past" ? tw`bg-primary` : tw`bg-transparent`,
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
});

export default MyEvents;
