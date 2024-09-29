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
import state from "../state";
import { fetchUserRegistrations } from "../state/registrationState";
import { fetchEventDetails } from "../state/eventState";

const MyEvents = observer(() => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = state.user.userState.get();
  const events = state.event.eventState.get();
  const userRegistrations =
    state.registration.registrationState.userRegistrations.get();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    if (user.id) {
      fetchLocalUserRegistrations(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (userRegistrations.length > 0) {
      console.log("userRegistrations", userRegistrations);

      const upcoming = userRegistrations[0].filter((event) => {
        return new Date(event.startDate) >= new Date();
      });

      const past = userRegistrations[0].filter((event) => {
        return new Date(event.startDate) < new Date();
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    }
  }, [userRegistrations]);

  const fetchLocalUserRegistrations = async (uid: string) => {
    await fetchUserRegistrations(uid);
  };

  const handlePressEvent = async (eventId: string) => {
    console.log("eventId", eventId);

    try {
      await fetchEventDetails(eventId);
      router.push(`/event/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

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
                title={event.eventName}
                location={event.location}
                date={event.startDate.split("T")[0]}
                images={event.images}
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
