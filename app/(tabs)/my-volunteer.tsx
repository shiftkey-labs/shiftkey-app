import React, { useEffect, useState } from "react";
import { observer } from "@legendapp/state/react";

import { View, Text, SafeAreaView, Pressable, Alert, ActivityIndicator } from "react-native";
import tw from "../styles/tailwind";
import state from "../state";
import VolunteerEventsList from "@/components/VolunteerEventsList";
import server from "@/config/axios";
import { fetchUserVolunteeredEvents } from "../state/volunteerState";

const Volunteer = observer(() => {
  const user = state.user.userState.get();
  const volunteerEvents =
    state.volunteer.volunteerState.userVolunteeredEvents.get();

  const role = user.role;

  console.log("role", user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadVolunteerEvents = async () => {
      if (role === "VOLUNTEER" && user.email) {
        try {
          setIsLoading(true);
          await fetchUserVolunteeredEvents(user.email);
        } catch (error) {
          console.error("Failed to fetch volunteer events:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadVolunteerEvents();
  }, [role, user.email]);

  const handleSubmitVolunteerRequest = async () => {
    try {
      setIsSubmitting(true);
      const response = await server.post("/user/update-role-to-volunteer", {
        userId: user.id,
      });

      Alert.alert("Success", "You have been registered as a volunteer.");
      state.user.userState.role.set("VOLUNTEER");
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "Failed to update role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-background justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (role === "STAFF" || role === "VOLUNTEER") {
    return (
      <SafeAreaView style={tw`flex-1 bg-background`}>
        <VolunteerEventsList events={volunteerEvents} />
      </SafeAreaView>
    );
  } else if (role === "STUDENT") {
    return (
      <SafeAreaView style={tw`flex-1 bg-background`}>
        <View style={tw`p-5`}>
          <Text style={tw`text-3xl font-bold mb-5`}>Volunteer Dashboard</Text>
          <Text style={tw`text-lg mb-5`}>
            This is where you will be able to view your shifts when you are selected as a volunteer.
          </Text>
          {/* <Pressable
            style={tw`bg-primary p-4 rounded-lg`}
            onPress={handleSubmitVolunteerRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white text-center`}>Submit</Text>
            )}
          </Pressable> */}
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
