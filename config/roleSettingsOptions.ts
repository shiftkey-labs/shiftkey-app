import { router } from "expo-router";

export const roleSettingsOptions = {
  STUDENT: {
    accountSettings: [
      {
        label: "View Profile",
        action: () =>
          router.push({
            pathname: "/(tabs)/profile",
            params: { view: "edit" },
          }),
      },
    ],
    moreOptions: [
      {
        label: "Privacy Policy",
        action: () => console.log("Privacy Policy pressed"),
      },
      {
        label: "Terms of Service",
        action: () => console.log("Terms of Service pressed"),
      },
      {
        label: "Submit Feedback",
        action: () => router.push("/feedback"),
      },
    ],
  },
  VOLUNTEER: {
    accountSettings: [
      {
        label: "View Profile",
        action: () =>
          router.push({
            pathname: "/(tabs)/profile",
            params: { view: "edit" },
          }),
      },
    ],
    moreOptions: [
      {
        label: "Privacy Policy",
        action: () => console.log("Privacy Policy pressed"),
      },
      {
        label: "Terms of Service",
        action: () => console.log("Terms of Service pressed"),
      },
      {
        label: "Submit Feedback",
        action: () => router.push("/feedback"),
      },
    ],
  },
  ADMIN: {
    accountSettings: [
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
    moreOptions: [
      {
        label: "Privacy Policy",
        action: () => console.log("Privacy Policy pressed"),
      },
      {
        label: "Terms of Service",
        action: () => console.log("Terms of Service pressed"),
      },
      {
        label: "Submit Feedback",
        action: () => router.push("/feedback"),
      },
    ],
  },
};
