import React, { useEffect, useState } from "react";
import { observer } from "@legendapp/state/react";

import { View, Text, SafeAreaView, Pressable, Alert, ActivityIndicator } from "react-native";
import tw from "../styles/tailwind";
import state from "../state";
import VolunteerEventsList from "@/components/VolunteerEventsList";
import server from "@/config/axios";
import { fetchUserVolunteeredEvents } from "../state/volunteerState";
import { useTheme } from "@/context/ThemeContext";

const Volunteer = observer(() => {
  const user = state.user.userState.get();
  const volunteerEvents =
    state.volunteer.volunteerState.userVolunteeredEvents.get();

  const role = user.role;

  console.log("role", user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isDarkMode, colors } = useTheme();

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
      <SafeAreaView style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={isDarkMode ? colors.text : colors.primary} />
      </SafeAreaView>
    );
  }

  if (role === "STAFF" || role === "VOLUNTEER") {
    return (
      <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
        <VolunteerEventsList events={volunteerEvents} />
      </SafeAreaView>
    );
  } else if (role === "STUDENT") {
    return (
      <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
        <View style={tw`p-5`}>
          <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>
            Volunteer Dashboard
          </Text>
          <Text style={{ color: colors.text, fontSize: 18, marginBottom: 20 }}>
            This is where you will be able to view your shifts when you are selected as a volunteer.
          </Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, fontSize: 20 }}>Invalid role</Text>
      </View>
    );
  }
});

export default Volunteer;
