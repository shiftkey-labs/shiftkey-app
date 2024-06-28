export const roleSettingsOptions = {
  STUDENT: {
    accountSettings: [
      {
        label: "Edit Profile",
        action: () => console.log("Edit Profile pressed"),
      },
      {
        label: "Change Password",
        action: () => console.log("Change Password pressed"),
      },
      {
        label: "Notifications",
        action: () => console.log("Notifications pressed"),
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
        action: () => console.log("Edit Profile pressed"),
      },
      {
        label: "Change Password",
        action: () => console.log("Change Password pressed"),
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
        action: () => console.log("Edit Profile pressed"),
      },
      {
        label: "Change Password",
        action: () => console.log("Change Password pressed"),
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
