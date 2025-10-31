import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="edit-profile"
                options={{
                    headerShown: false,
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