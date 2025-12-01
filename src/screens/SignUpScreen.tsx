import React, { useContext } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { useUserRegistration } from "../components/UserContext";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { validateFirstName, validateLastName } from "../util/Validation";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import GalaxyBackground from "../components/GalaxyBackground";

type Props = NativeStackScreenProps<RootStack, "SignUpScreen">;

export default function SignUpScreen({ navigation }: Props) {
  const { applied } = useTheme();
  const logo =
    applied === "dark"
      ? require("../../assets/avatar/unnamed.png")
      : require("../../assets/avatar/unnamed.png");

  const { userData, setUserData } = useUserRegistration();

  const handleNext = () => {
    const validFirstName = validateFirstName(userData.firstName);
    const validLastName = validateLastName(userData.lastName);

    if (validFirstName) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validFirstName,
      });
      return;
    }
    if (validLastName) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validLastName,
      });
      return;
    }

    navigation.replace("ContactScreen");
  };

  return (
    <GalaxyBackground>

      <StatusBar hidden />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-6 py-10"
      >
        {/* Logo + Heading */}
        <View className="items-center mb-8">
          <Image source={logo} className="h-32 w-32 rounded-xl" />
          <Text className="mt-5 text-2xl font-bold text-slate-700 dark:text-slate-100">
            Create Account
          </Text>
          <Text className="text-slate-500 dark:text-slate-300 mt-1 text-center">
            Enter your details below to start chatting worldwide
          </Text>
        </View>

        {/* Galaxy Theme Card Form */}
        {/* Galaxy Theme Card Form */}
        <View
          className="rounded-3xl p-6 shadow-lg"
          style={{
            backgroundColor: "rgba(10, 10, 35, 0.95)", // galaxy deep blue
            borderWidth: 1,
            borderColor: "rgba(88, 101, 242, 0.6)",   // glowing bluish border
            shadowColor: "#5865F2",
            shadowOpacity: 0.4,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          {/* First Name */}
          <FloatingLabelInput
            label="First Name"
            value={userData.firstName}
            containerStyles={{
              borderWidth: 1,
              borderColor: "rgba(88, 101, 242, 0.6)",
              borderRadius: 14,
              paddingHorizontal: 12,
              marginBottom: 20,
              height: 60, // bigger input
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.05)", // faint space glow
            }}
            customLabelStyles={{
              colorFocused: "#9B87F5",
              colorBlurred: "#aaa",
              fontSizeFocused: 14,
              fontSizeBlurred: 16,
            }}
            inputStyles={{
              color: "white",
              fontSize: 18, // bigger text
              paddingTop: 8,
            }}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, firstName: text }))
            }
          />

          {/* Last Name */}
          <FloatingLabelInput
            label="Last Name"
            value={userData.lastName}
            containerStyles={{
              borderWidth: 1,
              borderColor: "rgba(88, 101, 242, 0.6)",
              borderRadius: 14,
              paddingHorizontal: 12,
              height: 60,
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
            customLabelStyles={{
              colorFocused: "#9B87F5",
              colorBlurred: "#aaa",
              fontSizeFocused: 14,
              fontSizeBlurred: 16,
            }}
            inputStyles={{
              color: "white",
              fontSize: 18,
              paddingTop: 8,
            }}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, lastName: text }))
            }
          />

          {/* Next Button */}
          <Pressable
            onPress={handleNext}
            style={{
              marginTop: 30,
              borderRadius: 30,
              paddingVertical: 16,
              shadowColor: "#6EE7B7",
              shadowOpacity: 0.6,
              shadowRadius: 20,
              backgroundColor: "rgba(147,51,234,0.9)", // purple glow
            }}
          >
            <Text className="text-white font-bold text-xl text-center tracking-wide">
              Next ✨
            </Text>
          </Pressable>
        </View>


        {/* Bottom text */}
        <View className="items-center mt-6">
          <Text className="text-slate-500 dark:text-slate-300">
            Already have an account?
          </Text>
          <Pressable>
            <Text className="text-blue-600 font-bold mt-1">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>

    </GalaxyBackground>
  );
}
