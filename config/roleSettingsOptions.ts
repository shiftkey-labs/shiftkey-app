import { router } from "expo-router";

export const roleSettingsOptions = {
  STUDENT: {
    accountSettings: [
      {
        label: "Edit Profile",
        action: () => router.push("/(settings)/edit-profile"),
      },
      {
        label: "Change Password",
        action: () => {
          // TODO: Implement password change functionality
          console.log("Change Password - To be implemented");
        },
      },
      {
        label: "Notifications",
        action: () => {
          // TODO: Implement notifications settings
          console.log("Notifications - To be implemented");
        },
      },
    ],
    moreOptions: [
      {
        label: "Privacy Policy",
        action: () => {
          // TODO: Navigate to privacy policy
          console.log("Privacy Policy - To be implemented");
        },
      },
      {
        label: "Terms of Service",
        action: () => {
          // TODO: Navigate to terms of service
          console.log("Terms of Service - To be implemented");
        },
      },
      {
        label: "Help & Support",
        action: () => {
          // TODO: Navigate to help & support
          console.log("Help & Support - To be implemented");
        },
      },
    ],
  },
  VOLUNTEER: {
    accountSettings: [
      {
        label: "Edit Profile",
        action: () => router.push("/(settings)/edit-profile"),
      },
      {
        label: "Change Password",
        action: () => {
          // TODO: Implement password change functionality
          console.log("Change Password - To be implemented");
        },
      },
    ],
    moreOptions: [
      {
        label: "Privacy Policy",
        action: () => {
          // TODO: Navigate to privacy policy
          console.log("Privacy Policy - To be implemented");
        },
      },
      {
        label: "Terms of Service",
        action: () => {
          // TODO: Navigate to terms of service
          console.log("Terms of Service - To be implemented");
        },
      },
      {
        label: "Help & Support",
        action: () => {
          // TODO: Navigate to help & support
          console.log("Help & Support - To be implemented");
        },
      },
    ],
  },
  ADMIN: {
    accountSettings: [
      {
        label: "Edit Profile",
        action: () => router.push("/(settings)/edit-profile"),
      },
      {
        label: "Change Password",
        action: () => {
          // TODO: Implement password change functionality
          console.log("Change Password - To be implemented");
        },
      },
      {
        label: "User Management",
        action: () => {
          // TODO: Navigate to user management
          console.log("User Management - To be implemented");
        },
      },
    ],
    moreOptions: [
      {
        label: "Privacy Policy",
        action: () => {
          // TODO: Navigate to privacy policy
          console.log("Privacy Policy - To be implemented");
        },
      },
      {
        label: "Terms of Service",
        action: () => {
          // TODO: Navigate to terms of service
          console.log("Terms of Service - To be implemented");
        },
      },
      {
        label: "Help & Support",
        action: () => {
          // TODO: Navigate to help & support
          console.log("Help & Support - To be implemented");
        },
      },
    ],
  },
};
