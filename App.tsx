import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { SafeAreaView } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { useFonts } from "expo-font";

export default function App() {
  const isAuthenticated = true; // TODO: Manage this dynamically

  const [fontsLoaded] = useFonts({
    MontserratRegular: require("./assets/fonts/Montserrat-Regular.ttf"),
    Montserrat: require("./assets/fonts/Montserrat-Bold.ttf"),
    OpenSans: require("./assets/fonts/open-sans.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const theme = createTheme({
    lightColors: {
      primary: "#0455BF",
    },
    darkColors: {
      primary: "blue",
    },
    components: {
      Button: {
        raised: true,
        buttonStyle: {
          borderRadius: 8,
        },
        titleStyle: {
          fontWeight: "400",
          fontFamily: "OpenSans",
        },
        containerStyle: {
          width: "70%",
          marginLeft: "15%",
        },
      },
      Text: {
        h1Style: {
          textAlign: "center",
          fontSize: 24,
          fontWeight: "700",
          fontFamily: "Montserrat",
        },
        h2Style: {
          fontSize: 18,
          fontWeight: "700",
          fontFamily: "Montserrat",
        },
        h3Style: {
          fontWeight: "bold",
          fontSize: 14,
        },
        style: {
          fontWeight: "700",
        },
      },
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          {!isAuthenticated ? <AuthNavigator /> : <RootNavigator />}
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
}
