import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="edit-profile"
                options={{
                    title: "View Profile",
                }}
            />
            <Stack.Screen
                name="invite-volunteer"
                options={{
                    title: "Invite Support Staff",
                }}
            />
        </Stack>
    );
} 