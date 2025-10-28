import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "./styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import { submitFeedback } from "@/api/feedbackApi";
import { useRouter } from "expo-router";

const FeedbackScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();
  const [issue, setIssue] = useState("");
  const [reproduce, setReproduce] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!issue.trim() || !reproduce.trim()) {
      Alert.alert("Feedback Incomplete", "Please fill in both fields.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFeedback({
        issue: issue.trim(),
        reproduce: reproduce.trim(),
      });

      Alert.alert(
        "Feedback Received",
        "Thanks for letting us know. We will look into it.",
        [{ text: "OK", onPress: handleClose }]
      );
      setIssue("");
      setReproduce("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Unable to send feedback right now.";
      Alert.alert("Submission Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = [
    tw`w-full p-4 rounded-xl`,
    {
      color: colors.text,
      backgroundColor: isDarkMode ? colors.lightGray : colors.white,
      borderColor: colors.lightGray,
      borderWidth: 1,
    },
  ];

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            tw`flex-row items-center justify-between px-5 py-4`,
            { backgroundColor: colors.background },
          ]}
        >
          <TouchableOpacity onPress={handleClose}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              Close
            </Text>
          </TouchableOpacity>
          <Text
            style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}
          >
            Submit Feedback
          </Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView
          style={[tw`flex-1 px-5`]}
          contentContainerStyle={tw`pb-10`}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 16,
            }}
          >
            Tell us what happened
          </Text>
          <View style={tw`mb-5`}>
            <Text style={{ color: colors.gray, marginBottom: 8 }}>
              What went wrong?
            </Text>
            <TextInput
              style={inputStyles}
              placeholder="The app crashes when I try to..."
              placeholderTextColor={colors.gray}
              value={issue}
              onChangeText={setIssue}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={tw`mb-5`}>
            <Text style={{ color: colors.gray, marginBottom: 8 }}>
              How can we reproduce it?
            </Text>
            <TextInput
              style={[...inputStyles, { minHeight: 140 }]}
              placeholder="Steps: 1. Open app 2. Tap..."
              placeholderTextColor={colors.gray}
              value={reproduce}
              onChangeText={setReproduce}
              multiline
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity
            style={[
              tw`p-4 rounded-xl`,
              {
                backgroundColor: colors.primary,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text
              style={{
                color: colors.white,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {isSubmitting ? "Submitting..." : "Send Feedback"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
