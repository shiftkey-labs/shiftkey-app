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

// Type definitions
type EventFields = {
  category1?: string[];
  category2?: string[];
  endDate?: string | null;
  eventDetails?: string | null;
  eventName?: string | null;
  location?: string | null;
  manualTotalAttendees?: number | null;
  manualTotalInternationalStudents?: number | null;
  manualTotalNonDalFCSStudents?: number | null;
  manualTotalNonStudentsCommunity?: number | null;
  manualTotalNonStudentsFacultyStaff?: number | null;
  manualTotalNonStudentsFederalGov?: number | null;
  manualTotalNonStudentsMunicipalGov?: number | null;
  manualTotalNonStudentsNonProfit?: number | null;
  manualTotalNonStudentsPrivateSector?: number | null;
  manualTotalNonStudentsProvincialGov?: number | null;
  manualTotalNovaScotianStudents?: number | null;
  manualTotalOutOfProvinceStudents?: number | null;
  manualTotalPOC?: number | null;
  manualTotalWomenNonBinary?: number | null;
  manualTotalYouthP12?: number | null;
  notes?: string | null;
  startDate?: string | null;
  totalAttendees?: number | null;
  totalInternationalStudents?: number | null;
  totalNonDalFCSStudents?: number | null;
  totalNonStudentsCommunity?: number | null;
  totalNonStudentsFacultyStaff?: number | null;
  totalNonStudentsFederalGov?: number | null;
  totalNonStudentsMunicipalGov?: number | null;
  totalNonStudentsNonProfit?: number | null;
  totalNonStudentsPrivateSector?: number | null;
  totalNonStudentsProvincialGov?: number | null;
  totalNovaScotianStudents?: number | null;
  totalOutOfProvinceStudents?: number | null;
  totalPOC?: number | null;
  totalWomenNonBinary?: number | null;
  totalYouthP12?: number | null;
  volunteer?: any[] | null;
  volunteerShifts?: any[] | null;
  images?: any[] | null;
  uid: number | null;
};

type Event = {
  id: string;
  fields: EventFields;
};

const Home: React.FC = () => {
  const router = useRouter();
  const events = state.event;
  const user = state.user.userState.get();
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dummyImageUrl = "https://example.com/dummy-image.png";

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
      <SafeAreaView style={tw`flex-1 bg-background justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <ScrollView style={tw`flex-1 bg-background p-5`}>
        <View style={tw`flex-row pt-5 justify-between items-center`}>
          <Text style={tw`text-4xl font-bold`}>Hi {user.firstName ?? "there!"}</Text>
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
