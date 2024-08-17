import React, { useEffect } from "react";
import { observer } from "@legendapp/state/react";

import { View, Text, SafeAreaView, Pressable, Alert } from "react-native";
import tw from "../styles/tailwind";
import state from "../state";
import VolunteerEventsList from "@/components/VolunteerEventsList";
import server from "@/config/axios";
import { fetchUserVolunteeredEvents } from "../state/volunteerState";

const Volunteer = observer(() => {
  const user = state.user.userState.get();
  console.log("user", user);

  const role = user.role;
  console.log("role", role);

  useEffect(() => {
    if (role === "VOLUNTEER" && user.id) {
      fetchUserVolunteeredEvents(user.uid);
    }
  }, [role, user.id]);

  const handleSubmitVolunteerRequest = async () => {
    try {
      const response = await server.post("/user/update-role-to-volunteer", {
        userId: user.id,
      });

      Alert.alert("Success", "You have been registered as a volunteer.");
      state.user.userState.role.set("VOLUNTEER");
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "Failed to update role. Please try again.");
    }
  };

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
        <View style={tw`p-5`}>
          <Text style={tw`text-3xl font-bold mb-5`}>Volunteer Signup Form</Text>
          <Text style={tw`text-lg mb-5`}>
            By clicking submit you agree to the terms and conditions of
            volunteering with ShiftKey
          </Text>
          <Pressable
            style={tw`bg-primary p-4 rounded-lg`}
            onPress={handleSubmitVolunteerRequest}
          >
            <Text style={tw`text-white text-center`}>Submit</Text>
          </Pressable>
        </View>
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
