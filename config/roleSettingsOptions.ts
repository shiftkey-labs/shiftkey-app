import { router } from "expo-router";

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
        action: () => console.log("Privacy Policy pressed"),
      },
      {
        label: "Terms of Service",
        action: () => console.log("Terms of Service pressed"),
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
        action: () => console.log("Privacy Policy pressed"),
      },
      {
        label: "Terms of Service",
        action: () => console.log("Terms of Service pressed"),
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
        action: () => console.log("Privacy Policy pressed"),
      },
      {
        label: "Terms of Service",
        action: () => console.log("Terms of Service pressed"),
      },
    ],
  },
};
