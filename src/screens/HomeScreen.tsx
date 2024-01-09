// Created by: Vansh Sood
// Purpose: This is the home screen component of the ShiftKey app.

import React from "react";
import { View } from "react-native";
import { Button, Text } from "@rneui/themed";
import { useStyles } from "../util/theme";

const HomeScreen = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Text h1>Welcome to ShiftKey!</Text>
      <Button>Click me!</Button>
    </View>
  );
};

export default HomeScreen;
