import { router } from "expo-router";
import { Linking } from "react-native";

export const roleSettingsOptions = {
  STUDENT: {
    supportOptions: [
      {
        label: "Invite Support Staff",
        action: () => router.push("/(settings)/invite-volunteer"),
      },
      {
        label: "Share Feedback",
        action: () => router.push("/feedback"),
      },
    ],
    accountOptions: [
      {
        label: "View Profile",
        action: () => router.push("/(settings)/edit-profile"),
      },
    ],
    legalOptions: [
      {
        label: "Privacy Policy",
        action: () => Linking.openURL("https://shiftkeylabs.ca/privacy-policy"),
      },
    ],
  },
  VOLUNTEER: {
    supportOptions: [
      {
        label: "Invite Support Staff",
        action: () => router.push("/(settings)/invite-volunteer"),
      },
      {
        label: "Share Feedback",
        action: () => router.push("/feedback"),
      },
    ],
    accountOptions: [
      {
        label: "View Profile",
        action: () => router.push("/(settings)/edit-profile"),
      },
    ],
    legalOptions: [
      {
        label: "Privacy Policy",
        action: () => Linking.openURL("https://shiftkeylabs.ca/privacy-policy"),
      },
    ],
  },
  ADMIN: {
    supportOptions: [
      {
        label: "Invite Support Staff",
        action: () => router.push("/(settings)/invite-volunteer"),
      },
      {
        label: "Share Feedback",
        action: () => router.push("/feedback"),
      },
    ],
    accountOptions: [
      {
        label: "View Profile",
        action: () =>
          router.push({
            pathname: "/(tabs)/profile",
            params: { view: "edit" },
          }),
      },
      {
        label: "User Management",
        action: () => console.log("User Management pressed"),
      },
    ],
    legalOptions: [
      {
        label: "Privacy Policy",
        action: () => Linking.openURL("https://shiftkeylabs.ca/privacy-policy"),
      },
    ],
  },
};
