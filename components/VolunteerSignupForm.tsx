import tw from "@/app/styles/tailwind";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const VolunteerSignupForm = () => {
  return (
    <View style={tw`p-5`}>
      <Text style={tw`text-3xl font-bold mb-5`}>Volunteer Signup Form</Text>
      <Text style={tw`text-lg mb-5`}>
        By clicking submit you agree to the terms and conditions of volunteering
        with ShiftKey
      </Text>
      <TouchableOpacity style={tw`bg-primary p-4 rounded-lg`}>
        <Text style={tw`text-white text-center`}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VolunteerSignupForm;
