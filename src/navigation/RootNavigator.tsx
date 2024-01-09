import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { routes } from "../data/routes";

const RootBottomStack = createBottomTabNavigator();

const RootStack = () => {
  return (
    <RootBottomStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          width: "100%",
          paddingTop: 10,
          height: 70,
          shadowColor: "#eeeeee",
          shadowOpacity: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "MontserratRegular",
          paddingTop: 0,
          color: "#666666",
        },
      }}
    >
      {routes
        .filter((route) => route.isBottom === true)
        .map((route) => (
          <RootBottomStack.Screen
            key={route.name}
            name={route.name}
            options={route.options}
            component={route.component}
          />
        ))}
    </RootBottomStack.Navigator>
  );
};

export default RootStack;
