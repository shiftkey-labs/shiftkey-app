import tw from "@/app/styles/tailwind";
import React from "react";
import { View, Text, ScrollView } from "react-native";

const VolunteerEventsList = ({ events }) => {
  return (
    <ScrollView style={tw`p-5`}>
      <Text style={tw`text-3xl font-bold mb-5`}>Volunteered Events</Text>
      {events.length > 0 ? (
        events.map((event) => (
          <View key={event.id} style={tw`bg-white p-4 mb-4 rounded-lg shadow`}>
            <Text style={tw`text-xl font-montserratBold`}>
              {event.eventName}
            </Text>
            <Text>{event.startDate}</Text>
            <Text>{event.location}</Text>
          </View>
        ))
      ) : (
        <Text style={tw`text-lg text-gray-600`}>No volunteered events</Text>
      )}
    </ScrollView>
  );
};

export default VolunteerEventsList;
