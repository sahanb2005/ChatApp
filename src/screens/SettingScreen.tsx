import React from "react";
import { View, Text, TouchableOpacity,  ScrollView } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type SettingScreenProps = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const { applied, setTheme } = useTheme();
  const navigation = useNavigation<SettingScreenProps>();

  // Background and text colors based on selected theme
  const backgroundColor =
    applied === "dark"
      ? "#0d0d2b"
      : applied === "light"
      ? "#fff"
      : "#0b0b1a"; // Galaxy background

  const textColor =
    applied === "dark"
      ? "text-white"
      : applied === "light"
      ? "text-black"
      : "text-purple-200"; // Galaxy text

  const accentColor =
    applied === "dark"
      ? "#9d8cff"
      : applied === "light"
      ? "#4f46e5"
      : "#7C3AED"; // Galaxy accent

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={["top", "right", "bottom", "left"]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={applied === "light" ? "#000" : "#fff"} />
          </TouchableOpacity>
          <Text
            className={`text-2xl font-bold ml-4 ${textColor}`}
            style={{ fontSize: 24 }}
          >
            Settings
          </Text>
        </View>

        {/* Theme Section */}
        <View style={{ marginBottom: 32 }}>
          <Text className={`${textColor} text-xl font-semibold mb-4`}>Theme</Text>

          <TouchableOpacity
            className="py-3 px-4 mb-2 rounded-lg"
            style={{
              backgroundColor: applied === "dark" ? accentColor : "rgba(255,255,255,0.05)",
            }}
            onPress={() => setTheme("dark")}
          >
            <Text className={`${applied === "dark" ? "text-white" : textColor} text-lg`}>
              Dark Theme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 px-4 mb-2 rounded-lg"
            style={{
              backgroundColor: applied === "light" ? accentColor : "rgba(0,0,0,0.05)",
            }}
            onPress={() => setTheme("light")}
          >
            <Text className={`${applied === "light" ? "text-white" : textColor} text-lg`}>
              Light Theme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 px-4 mb-2 rounded-lg"
            style={{
              backgroundColor: applied === "galaxy" ? accentColor : "rgba(255,255,255,0.05)",
            }}
            onPress={() => setTheme("galaxy")}
          >
            <Text className={`${applied === "galaxy" ? "text-white" : "text-purple-200"} text-lg`}>
              Galaxy Theme
            </Text>
          </TouchableOpacity>
        </View>

        {/* Other Settings Example */}
        <View style={{ marginBottom: 16 }}>
          <Text className={`${textColor} text-xl font-semibold mb-4`}>Account</Text>
          <TouchableOpacity
            className="py-3 px-4 mb-2 rounded-lg"
            style={{
              backgroundColor: applied === "galaxy" ? "rgba(124,58,237,0.2)" : "rgba(0,0,0,0.05)",
            }}
            onPress={() => alert("Change password pressed")}
          >
            <Text className={`${textColor} text-lg`}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
