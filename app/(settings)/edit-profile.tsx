import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
} from "react-native";
import tw from "../styles/tailwind";
import { useRouter } from "expo-router";
import state from "../state";
import { Picker } from "@react-native-picker/picker";

const EditProfile = () => {
    const user = state.user.userState.get();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        pronouns: user.pronouns || "",
        currentDegree: user.currentDegree || "",
        faculty: user.faculty || "",
        school: user.school || "",
        university: user.university || "",
        program: user.program || "",
        year: user.year || "",
        isInternational: user.isInternational || false,
    });

    const handleSave = async () => {
        try {
            // Update user state
            state.user.userState.set({
                ...user,
                ...formData,
            });

            // Here you would typically also update the user data in your backend

            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Error", "An unknown error occurred");
            }
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-background`}>
            <ScrollView style={tw`flex-1 p-5`}>
                <Text style={tw`text-3xl font-bold mb-5`}>Edit Profile</Text>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-medium mb-1`}>First Name</Text>
                    <TextInput
                        style={tw`bg-white p-3 rounded-lg`}
                        value={formData.firstName}
                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-medium mb-1`}>Last Name</Text>
                    <TextInput
                        style={tw`bg-white p-3 rounded-lg`}
                        value={formData.lastName}
                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-medium mb-1`}>Email</Text>
                    <TextInput
                        style={tw`bg-white p-3 rounded-lg`}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                        editable={false}
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-medium mb-1`}>Pronouns</Text>
                    <TextInput
                        style={tw`bg-white p-3 rounded-lg`}
                        value={formData.pronouns}
                        onChangeText={(text) => setFormData({ ...formData, pronouns: text })}
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-medium mb-1`}>Current Degree</Text>
                    <TextInput
                        style={tw`bg-white p-3 rounded-lg`}
                        value={formData.currentDegree}
                        onChangeText={(text) => setFormData({ ...formData, currentDegree: text })}
                    />
                </View>

                <TouchableOpacity
                    style={tw`bg-primary p-4 rounded-lg mt-4`}
                    onPress={handleSave}
                >
                    <Text style={tw`text-white text-center font-bold`}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile; 