// src/screen/SplashScreen.tsx
import React, { useEffect, useRef, useContext } from "react";
import { Text, View, Animated, Easing, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStack } from "../../App";
import { AuthContext } from "../components/AuthProvider";
import GalaxyBackground from "../components/GalaxyBackground";

type SplashNav = NativeStackNavigationProp<RootStack, "SplashScreen">;

const Loader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.circle,
        { transform: [{ rotate: rotateInterpolate }] },
      ]}
    />
  );
};

export default function SplashScreen() {
  const navigation = useNavigation<SplashNav>();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.userId) {
        navigation.replace("HomeScreen");
      } else {
        navigation.replace("SignUpScreen");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [auth?.userId, navigation]);

  return (
    <GalaxyBackground>
      <View style={styles.container}>
        <Loader />
        <Text style={styles.title}>GlobalChat</Text>
        <Text style={styles.subtitle}>Bridging conversations worldwide</Text>
      </View>
    </GalaxyBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: "#2196f3",
    borderTopColor: "#e91e63",
    backgroundColor: "#acbaca",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
  },
});
