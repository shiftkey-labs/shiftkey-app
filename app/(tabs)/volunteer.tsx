import React from "react";
import { observer } from "@legendapp/state/react";

import { View, Text, SafeAreaView } from "react-native";
import tw from "../styles/tailwind";
import state from "../state";
import VolunteerEventsList from "@/components/VolunteerEventsList";
import VolunteerSignupForm from "@/components/VolunteerSignupForm";

const Volunteer = observer(() => {
  const user = state.user.userState.get();
  const role = user.role;

  if (role === "VOLUNTEER") {
    const volunteerEvents = [
      {
        id: "1",
        title: "Event 1",
        date: "2024-07-15",
        location: "Location 1",
      },
      {
        id: "2",
        title: "Event 2",
        date: "2024-08-22",
        location: "Location 2",
      },
    ];
    return (
      <SafeAreaView style={tw`flex-1`}>
        <VolunteerEventsList events={volunteerEvents} />
      </SafeAreaView>
    );
  } else if (role === "STUDENT") {
    return (
      <SafeAreaView style={tw`flex-1`}>
        <VolunteerSignupForm />
      </SafeAreaView>
    );
  } else {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-xl`}>Invalid role</Text>
      </View>
    );
  }
});

export default Volunteer;
