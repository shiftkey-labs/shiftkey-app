import { router } from "expo-router";

export const roleSettingsOptions = {
  STUDENT: {
    accountSettings: [
      {
        label: "Edit Profile",
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
        label: "Help & Support",
        action: () => console.log("Help & Support pressed"),
      },
    ],
  },
  VOLUNTEER: {
    accountSettings: [
      {
        label: "Edit Profile",
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
        label: "Help & Support",
        action: () => console.log("Help & Support pressed"),
      },
    ],
  },
  ADMIN: {
    accountSettings: [
      {
        label: "Edit Profile",
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
        label: "Help & Support",
        action: () => console.log("Help & Support pressed"),
      },
    ],
  },
};
