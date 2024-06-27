import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, SafeAreaView } from "react-native";
import tw from "../styles/tailwind";
import SearchBar from "@/components/home/SearchBar";
import EventCard from "@/components/home/EventCard";
import SectionHeader from "@/components/home/SectionHeader";
import eventsData from "@/constants/eventsData";
import BigBoyCard from "@/components/home/BigBoyCard";
import { useRouter } from "expo-router";
import state, { fetchEventById } from "../state";

const Home = () => {
  const router = useRouter();
  const events = state.events.get();
  const [eventsList, setEventsList] = useState([]);

  const handlePressEvent = async (eventId) => {
    try {
      router.push(`/event/${eventId}`);
    } catch (error) {
      console.error("Failed to load event details:", error);
    }
  };
  const handlePressSeeAll = (section: string) => {
    // Handle see all press
    console.log("See all pressed for section:", section);
  };

  useEffect(() => {
    if (events) {
      setEventsList(events);
    }
  }, [events]);

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <ScrollView style={tw`flex-1 bg-background p-5`}>
        {/* <SearchBar />
        <View style={tw`flex-row mt-3`}>
          <View style={tw`flex-1 bg-gray-200 p-3 rounded-full mr-2`}>
            <Text style={tw`text-center`}>Say Hello To</Text>
          </View>
          <View style={tw`flex-1 bg-gray-200 p-3 rounded-full ml-2`}>
            <Text style={tw`text-center`}>Hackathons</Text>
          </View>
        </View> */}

        <SectionHeader
          title="Popular Now"
          onPressSeeAll={() => handlePressSeeAll("Popular Now")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`-mx-5 px-5`}
        >
          {eventsList.slice(0, eventsList.length / 2).map((event) => (
            <BigBoyCard
              key={event.id}
              title={event.title}
              date={event.date}
              category="Crypto"
              image={event.image}
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
            title={event.title}
            location={event.location}
            date={event.date}
            image={event.image}
            onPress={() => handlePressEvent(event.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
