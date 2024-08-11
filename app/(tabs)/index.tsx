import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import tw from "../styles/tailwind";
import BigBoyCard from "@/components/home/BigBoyCard";
import EventCard from "@/components/home/EventCard";
import SectionHeader from "@/components/home/SectionHeader";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import state from "../state";

const Home = () => {
  const router = useRouter();
  const events = state.event;
  const [eventsList, setEventsList] = useState([]);

  const handlePressEvent = async (eventId) => {
    try {
      await events.fetchEventDetails(eventId); // Fetch event details before navigating
      router.push(`/event/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  };

  const handlePressSeeAll = (section: string) => {
    console.log("See all pressed for section:", section);
  };

  useEffect(() => {
    const initialize = async () => {
      await events.initializeEvents();
    };

    initialize();
  }, []);

  useEffect(() => {
    if (events) {
      setEventsList(events.eventState.events.get());
    }
  }, [events]);

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <ScrollView style={tw`flex-1 bg-background p-5`}>
        <View style={tw`flex-row pt-5 justify-between items-center`}>
          <Text style={tw`text-4xl font-bold`}>Hi Vansh</Text>
          <TouchableOpacity onPress={() => console.log("Profile pressed")}>
            <FontAwesome5 name="moon" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={tw`text-lg text-gray-500`}>
          Let's find you something to do
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`-mx-5 px-5 mt-7`}
        >
          {eventsList.slice(0, eventsList.length / 2).map((event) => (
            <BigBoyCard
              key={event.id}
              title={event.fields.title}
              date={event.fields.date}
              category="Crypto"
              image={event.fields.image}
              onPressShow={() => handlePressEvent(event.id)}
              onPressFavorite={() =>
                console.log("Favorite pressed for event:", event.id)
              }
            />
          ))}
        </ScrollView>

        <SectionHeader
          title="Recommendations for you"
          onPressSeeAll={() => handlePressSeeAll("Recommendations for you")}
        />
        {eventsList.slice(eventsList.length / 2).map((event) => (
          <EventCard
            key={event.id}
            title={event.fields.title}
            location={event.fields.location}
            date={event.fields.date}
            image={event.fields.image}
            onPress={() => handlePressEvent(event.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
