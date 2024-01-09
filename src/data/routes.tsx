import React from "react";
import HomeScreen from "../screens/HomeScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

export const routes = [
  {
    name: "Home",
    component: HomeScreen,
    isBottom: true,
    options: {
      tabBarIcon: ({}) => (
        <Ionicons name="home-outline" size={25} color="#666" />
      ),
    },
  },
  {
    name: "Events",
    component: HomeScreen,
    isBottom: true,
    options: {
      tabBarIcon: ({}) => (
        <Ionicons name="calendar-outline" size={25} color="#666" />
      ),
    },
  },
  {
    name: "Bookings",
    component: HomeScreen,
    isBottom: true,
    options: {
      tabBarIcon: ({}) => (
        <Ionicons name="bookmarks-outline" size={25} color="#666" />
      ),
    },
  },
  {
    name: "Profile",
    component: HomeScreen,
    isBottom: true,
    options: {
      tabBarIcon: ({}) => (
        <Ionicons name="person-outline" size={25} color="#666" />
      ),
    },
  },
];
