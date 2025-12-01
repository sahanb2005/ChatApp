import React, { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const auth = useContext(AuthContext);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dynamic theme colors
  const colors = {
    bg: applied === "light" ? "#f2f2f2" : "#0d0d2b",
    cardBg: applied === "light" ? "#fff" : "rgba(255,255,255,0.1)",
    textPrimary: applied === "light" ? "#000" : "#fff",
    textSecondary: applied === "light" ? "#555" : "#aaa",
    buttonBg: "#9d8cff",
    buttonShadow: "#7e6bf0",
    icon: "#a78bfa",
    border: applied === "light" ? "#ccc" : "#444",
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadProfileImage(String(auth ? auth.userId : 0), result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🌌 Header */}
        <View
          style={{
            alignItems: "center",
            backgroundColor: applied === "light" ? "#8b5cf6" : "#1a0033",
            paddingBottom: 40,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          {/* 🔙 Animated Back Button */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(700)}
            style={{ position: "absolute", top: 12, left: 12 }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: colors.buttonBg,
                padding: 8,
                borderRadius: 50,
                shadowColor: colors.buttonShadow,
                shadowOpacity: 0.7,
                shadowRadius: 5,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* 🪞 Profile Image */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(900)}
            style={{ marginTop: 60 }}
          >
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{
                  uri: image
                    ? image
                    : `https://ui-avatars.com/api/?name=${userProfile?.firstName}&background=random`,
                }}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  borderWidth: 2,
                  borderColor: colors.border,
                }}
              />
            </TouchableOpacity>
          </Animated.View>

          <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: "bold", marginTop: 12 }}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            {userProfile?.countryCode} : {userProfile?.contactNo}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickImage}
            disabled={loading}
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.buttonBg,
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 50,
              shadowColor: colors.buttonShadow,
              shadowOpacity: 0.7,
              shadowRadius: 5,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="pencil" size={18} color="white" />
                <Text style={{ marginLeft: 8, color: "white", fontWeight: "600" }}>
                  Edit Profile
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ℹ️ Info Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 24, marginBottom: 20 }}>
          {/* Name */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              paddingVertical: 12,
            }}
          >
            <View>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Name</Text>
              <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "600" }}>
                {userProfile?.firstName} {userProfile?.lastName}
              </Text>
            </View>
            <Ionicons name="person" size={22} color={colors.icon} />
          </View>

          {/* Contact */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              paddingVertical: 12,
              marginTop: 16,
            }}
          >
            <View>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Phone</Text>
              <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "600" }}>
                {userProfile?.countryCode} {userProfile?.contactNo}
              </Text>
            </View>
            <Ionicons name="call" size={22} color={colors.icon} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
