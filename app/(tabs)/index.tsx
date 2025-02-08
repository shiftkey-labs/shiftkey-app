import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "../styles/tailwind";
import BigBoyCard from "@/components/home/BigBoyCard";
import EventCard from "@/components/home/EventCard";
import SectionHeader from "@/components/home/SectionHeader";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import state from "../state";
import { initializeAuth, userState } from "../state/userState";
import { useTheme } from "@/context/ThemeContext";
import { Event } from "@/types/event";

const Home: React.FC = () => {
  const router = useRouter();
  const events = state.event;
  const user = state.user.userState.get();
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, colors, toggleTheme } = useTheme();

  const dummyImageUrl = "https://shiftkeylabs.ca/wp-content/uploads/2022/12/Shiftkey-Labs-Logo-01-e1487284025704-1200x515-1.png";

  const handlePressEvent = async (eventId: string) => {
    try {
      await events.fetchEventDetails(eventId);
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
      try {
        setIsLoading(true);
        await events.initializeEvents();
        setEventsList(events.eventState.events.get());
        await initializeAuth();
        // user = state.user.userState.get();
        // console.log("final user data: ", user);
      } catch (error) {
        console.error("Failed to initialize:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDarkMode ? colors.text : colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView style={[tw`flex-1 p-5`, { backgroundColor: colors.background }]}>
        <View style={tw`flex-row pt-5 justify-between items-center`}>
          <Text style={{ color: colors.text, fontSize: 36, fontWeight: 'bold' }}>
            Hi {user.firstName}
          </Text>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              tw`p-2 rounded-full`,
              { backgroundColor: isDarkMode ? colors.lightGray : colors.lightGray }
            ]}
          >
            <FontAwesome5
              name={isDarkMode ? "sun" : "moon"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
        <Text style={{ color: colors.gray, fontSize: 18, marginTop: 4 }}>
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
              title={event.fields.eventName || "No Title"}
              date={event.fields.startDate || "No Date"}
              category={
                event.fields.category1
                  ? event.fields.category1[0]
                  : "No Category"
              }
              images={
                event.fields.images?.length
                  ? event.fields.images
                  : [{ url: dummyImageUrl }]
              }
              onPressShow={() => handlePressEvent(event.id)}
            />
          ))}
        </ScrollView>

        <SectionHeader
          title="Some events you might like"
          onPressSeeAll={() => handlePressSeeAll("Recommendations for you")}
        />
        {eventsList.slice(eventsList.length / 2).map((event) => (
          <EventCard
            key={event.id}
            title={event.fields.eventName || "No Title"}
            location={event.fields.location || "No Location"}
            date={event.fields.startDate || "No Date"}
            images={
              event.fields.images?.length
                ? event.fields.images
                : [{ url: dummyImageUrl }]
            }
            onPress={() => handlePressEvent(event.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
