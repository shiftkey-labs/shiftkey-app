// Created by: Vansh Sood
// Purpose: Drawer Navigation for the ShiftKey app.

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./RootNavigator"; // This is your bottom tabs navigator

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Explore" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
