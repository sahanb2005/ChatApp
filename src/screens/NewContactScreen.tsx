import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState, useEffect } from "react";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";
import GalaxyBackground from "../components/GalaxyBackground";
import { useTheme } from "../theme/ThemeProvider";

type NewContactScreenProp = NativeStackNavigationProp<
  RootStack,
  "NewContactScreen"
>;

export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const { sendNewContact } = useSendNewContact();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const sendData = () => {
    sendNewContact({
      id: 0,
      firstName,
      lastName,
      countryCode: callingCode,
      contactNo: phoneNo,
      createdAt: "",
      updatedAt: "",
      status: "",
    });
    setFirstName("");
    setLastName("");
    setCallingCode("+94");
    setPhoneNo("");
  };

  const getThemeColors = () => {
    return {
      bg: applied === "light" ? "#fff" : applied === "dark" ? "#0d0d2b" : "#0b0022",
      text: applied === "light" ? "#000" : "#fff",
      secondaryText: applied === "light" ? "#555" : "#aaa",
      inputBg: applied === "light" ? "#f9f9ff" : "#151533",
      buttonBg: "#9d8cff",
      buttonActiveBg: "#7e6bf0",
      formCardBg: applied === "light" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.05)",
      borderColor: applied === "light" ? "#0ea5e9" : "#6b21a8",
      iconColor: applied === "light" ? "#0c4a6e" : "#93c5fd",
    };
  };

  const colors = getThemeColors();

  // 🧩 FIXED INPUT STYLES (No clipping letters)
  const inputStyle = {
    container: {
      borderBottomWidth: 1.5,
      borderColor: colors.borderColor,
      borderRadius: 10,
      backgroundColor: colors.inputBg,
      paddingHorizontal: 12,
      paddingVertical: 2,
      height: 52, // ensures enough space for text
      
    },
    label: {
      colorFocused: colors.borderColor,
      colorBlurred: colors.secondaryText,
      fontSizeFocused: 12,
      fontSizeBlurred: 14,
    },
    labelBg: {
      backgroundColor: colors.inputBg,
      paddingHorizontal: 6,
    },
    input: {
      color: colors.text,
      fontSize: 16,
      paddingVertical: 10, // ensures text fits properly
    },
  };

  return (
    <GalaxyBackground>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingVertical: 16,
            backgroundColor: colors.formCardBg,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="arrow-back-sharp" size={24} color={colors.iconColor} />
            <Text style={{ color: colors.iconColor, fontSize: 16, fontWeight: "600", marginLeft: 6 }}>
              Back
            </Text>
          </TouchableOpacity>

          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}>
            New Contact
          </Text>

          <View style={{ width: 40 }} />
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            flexGrow: 1,
          }}
        >
          <View
            style={{
              backgroundColor: colors.formCardBg,
              borderRadius: 24,
              padding: 20,
            }}
          >
            {/* First Name */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Feather name="user" size={22} color={colors.iconColor} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <FloatingLabelInput
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  containerStyles={inputStyle.container}
                  customLabelStyles={inputStyle.label}
                  labelStyles={inputStyle.labelBg}
                  inputStyles={inputStyle.input}
                  hintTextColor={colors.secondaryText}
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Feather name="user" size={22} color={colors.iconColor} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <FloatingLabelInput
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  containerStyles={inputStyle.container}
                  customLabelStyles={inputStyle.label}
                  labelStyles={inputStyle.labelBg}
                  inputStyles={inputStyle.input}
                  hintTextColor={colors.secondaryText}
                />
              </View>
            </View>

            {/* Country Picker */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.borderColor,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 16,
                backgroundColor: colors.inputBg,
              }}
            >
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCountryNameButton
                withCallingCode
                visible={show}
                onClose={() => setShow(false)}
                onSelect={(c) => {
                  setCountryCode(c.cca2);
                  setCountry(c);
                  setShow(false);
                }}
              />
              <AntDesign name="caret-down" size={16} color={colors.text} />
            </View>

            {/* Phone Input */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Feather name="phone" size={22} color={colors.iconColor} />
              <View style={{ width: 70, marginRight: 12 }}>
                <FloatingLabelInput
                  label=""
                  editable={false}
                  value={country ? `+${country.callingCode}` : callingCode}
                  containerStyles={inputStyle.container}
                  inputStyles={inputStyle.input}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FloatingLabelInput
                  label="Phone"
                  inputMode="tel"
                  value={phoneNo}
                  onChangeText={setPhoneNo}
                  containerStyles={inputStyle.container}
                  customLabelStyles={inputStyle.label}
                  labelStyles={inputStyle.labelBg}
                  inputStyles={inputStyle.input}
                  hintTextColor={colors.secondaryText}
                />
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              style={{
                backgroundColor: colors.buttonBg,
                height: 56,
                borderRadius: 28,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12,
              }}
              onPress={() => {
                const firstNameValid = validateFirstName(firstName);
                const lastNameValid = validateLastName(lastName);
                const countryCodeValid = validateCountryCode(callingCode);
                const phoneNoValid = validatePhoneNo(phoneNo);

                if (firstNameValid) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: firstNameValid,
                  });
                } else if (lastNameValid) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: lastNameValid,
                  });
                } else if (countryCodeValid) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: countryCodeValid,
                  });
                } else if (phoneNoValid) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: phoneNoValid,
                  });
                } else {
                  sendData();
                }
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Save Contact
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GalaxyBackground>
  );
}
