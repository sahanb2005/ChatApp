import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import GalaxyBackground from "../components/GalaxyBackground";
import { CountryItem } from "react-native-country-codes-picker";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();

  // ✅ Renamed state variables to avoid conflicts
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>("LK");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryCode,setCountryCode] = useState<CountryItem|null>();
  const [show, setShow] = useState<boolean>(false);
  const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

  const handleNext = () => {
    const validCountryCode = validateCountryCode(callingCode);
    const validPhoneNo = validatePhoneNo(phoneNo);

    if (validCountryCode) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validCountryCode,
      });
    } else if (validPhoneNo) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validPhoneNo,
      });
    } else {
      setUserData((prev) => ({
        ...prev,
        countryCode: selectedCountry ? `+${selectedCountry.callingCode}` : callingCode,
        contactNo: phoneNo,
      }));
      navigation.replace("AvatarScreen");
    }
  };

  return (
    <GalaxyBackground>
      <StatusBar hidden={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        className="flex-1 items-center w-full px-6"
      >
        {/* Logo / Header */}
        <View className="mt-10 items-center">
          <Image
            source={require("../../assets/avatar/unnamed.png")}
            className="h-40 w-36 rounded-2xl shadow-lg"
          />
        </View>

        {/* Info Text */}
        <View className="mt-6 px-4">
          <Text className="text-white font-medium text-center text-base leading-6">
            We use your contacts to help you find friends already on the app.
            Your contacts stay private.
          </Text>
        </View>

        {/* Country Picker & Phone Input */}
        <View className="mt-10 w-full">
          {/* Country Picker */}
          <View
            className="flex-row h-14 items-center rounded-xl px-3 mb-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderWidth: 1,
              borderColor: "#A78BFA",
              shadowColor: "#9333EA",
              shadowOpacity: 0.6,
              shadowRadius: 8,
            }}
          >
            <CountryPicker
              countryCode={selectedCountryCode}
              withFilter
              withFlag
              withCountryNameButton
              withCallingCode
              visible={show}
              onClose={() => setShow(false)}
              onSelect={(c) => {
                setSelectedCountryCode(c.cca2);
                setSelectedCountry(c);
                setShow(false);
              }}
              theme={{
                backgroundColor: "#111827",
                onBackgroundTextColor: "#EDE9FE",
                fontSize: 16,
              }}
            />
            <AntDesign name="caret-down" size={20} color="#EDE9FE" />
          </View>

          {/* Phone Inputs */}
          <View
            className="flex-row w-full rounded-2xl overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: "#60A5FA",
              backgroundColor: "rgba(255,255,255,0.06)",
              paddingVertical: 2,
            }}
          >
            <TextInput
              inputMode="tel"
              className="h-16 w-1/5 text-center font-bold text-lg"
              style={{ color: "white" }}
              placeholder="+94"
              placeholderTextColor="#9CA3AF"
              editable={false}
              value={selectedCountry ? `+${selectedCountry.callingCode}` : callingCode}
              onChangeText={(text) => setCallingCode(text)}
            />
            <TextInput
              inputMode="tel"
              className="h-16 w-4/5 px-4 font-bold text-lg"
              style={{ color: "white" }}
              placeholder="Enter your cosmic number"
              placeholderTextColor="#9CA3AF"
              value={phoneNo}
              onChangeText={(text) => setPhoneNo(text)}
            />
          </View>
        </View>

        {/* Next Button */}
        <View className="mt-10 w-full">
          <Pressable
            className="justify-center items-center rounded-full"
            style={{
              backgroundColor: "#7C3AED",
              height: 56,
              shadowColor: "#8B5CF6",
              shadowOpacity: 0.8,
              shadowRadius: 10,
            }}
            onPress={handleNext}
          >
            <Text className="text-xl font-bold text-white">Next</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </GalaxyBackground>
  );
}
