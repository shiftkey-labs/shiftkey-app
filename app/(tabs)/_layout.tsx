import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Ionicons from "@expo/vector-icons/Ionicons";

import state from "../state";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={23} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = state.user.userState.get();
  const role = user.role;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].primary,
        tabBarInactiveTintColor: Colors["light"].text,
        headerShown: false,
        tabBarStyle: {
          height: 90,
          paddingVertical: 10,
          backgroundColor: "#fff",
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <Ionicons
          //           name="home-outline"
          //           size={24}
          //           color={Colors["light"].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="my-events"
        options={{
          title: "My Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-volunteer"
        options={{
          title: "Volunteer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
