import React from "react";
import { ScrollView, View, Text, SafeAreaView } from "react-native";
import tw from "../styles/tailwind";
import SearchBar from "@/components/home/SearchBar";
import EventCard from "@/components/home/EventCard";
import SectionHeader from "@/components/home/SectionHeader";
import eventsData from "@/constants/eventsData";
import BigBoyCard from "@/components/home/BigBoyCard";
import { useRouter } from "expo-router";
import state from "../state";

const Home = () => {
  const router = useRouter();
  const events = state.events.get();

  const handlePressEvent = (eventId: string) => {
    router.push({ pathname: `/event/${eventId}` });
  };
  const handlePressSeeAll = (section: string) => {
    // Handle see all press
    console.log("See all pressed for section:", section);
  };

  const upcomingEvents = events.slice(0, 2);
  const popularEvents = events.slice(2, 4);
  const recommendedEvents = events.slice(3);

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <ScrollView style={tw`flex-1 bg-background p-5`}>
        <SearchBar />
        <View style={tw`flex-row mt-3`}>
          <View style={tw`flex-1 bg-gray-200 p-3 rounded-full mr-2`}>
            <Text style={tw`text-center`}>Say Hello To</Text>
          </View>
          <View style={tw`flex-1 bg-gray-200 p-3 rounded-full ml-2`}>
            <Text style={tw`text-center`}>Hackathons</Text>
          </View>
        </View>

        <SectionHeader
          title="Upcoming Events"
          onPressSeeAll={() => handlePressSeeAll("Upcoming Events")}
        />
        {upcomingEvents.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            location={event.location}
            date={event.date}
            image={event.image}
            onPress={() => handlePressEvent(event.id)}
          />
        ))}

        <SectionHeader
          title="Popular Now"
          onPressSeeAll={() => handlePressSeeAll("Popular Now")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`-mx-5 px-5`}
        >
          {popularEvents.map((event) => (
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
        {recommendedEvents.map((event) => (
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
