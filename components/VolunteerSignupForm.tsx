import tw from "@/app/styles/tailwind";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const VolunteerSignupForm = () => {
  return (
    <View style={tw`p-5`}>
      <Text style={tw`text-3xl font-bold mb-5`}>Volunteer Signup Form</Text>
      <TextInput style={tw`bg-white p-3 mb-5 rounded`} placeholder="Name" />
      <TextInput style={tw`bg-white p-3 mb-5 rounded`} placeholder="Email" />
      <TextInput style={tw`bg-white p-3 mb-5 rounded`} placeholder="Phone" />
      <TouchableOpacity style={tw`bg-primary p-4 rounded-lg`}>
        <Text style={tw`text-white text-center`}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VolunteerSignupForm;
