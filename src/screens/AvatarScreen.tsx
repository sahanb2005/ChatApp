import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserRegistration } from "../components/UserContext";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";
import GalaxyBackground from "../components/GalaxyBackground";
import { LinearGradient } from "expo-linear-gradient";

type AvatarScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenProps>();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { userData, setUserData } = useUserRegistration();
  const auth = useContext(AuthContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUserData((previous) => ({
        ...previous,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const avatar = [
    require("../../assets/avatar/avatar_4.png"),
    require("../../assets/avatar/avatar_2.png"),
    require("../../assets/avatar/avatar_3.png"),
    require("../../assets/avatar/avatar_5.png"),
    require("../../assets/avatar/avatar_6.png"),
  ];

  return (
    <GalaxyBackground>
      <SafeAreaView className="flex-1">
        <StatusBar hidden />

        {/* Heading Section */}
        <View className="items-center mt-8">
          <Text className="text-3xl font-extrabold text-white tracking-widest drop-shadow-md">
            🌠 Create Your Look
          </Text>
          <Text className="text-slate-300 text-sm mt-1">
            Choose an image that defines your galaxy vibe
          </Text>
        </View>

        {/* Image Picker Card */}
        <LinearGradient
          colors={["#1a1b3a", "#060616"]}
          className="mx-8 mt-8 p-6 rounded-3xl border border-purple-600/40 shadow-lg shadow-purple-800/50"
        >
          <View className="items-center">
            <Pressable
              className="h-[140] w-[140] rounded-full bg-slate-800 justify-center items-center border-2 border-dashed border-purple-400"
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-[140] h-[140] rounded-full"
                />
              ) : (
                <View className="items-center justify-center">
                  <Text className="text-purple-400 text-3xl">+</Text>
                  <Text className="text-slate-400 text-xs">Upload Image</Text>
                </View>
              )}
            </Pressable>

            <Text className="text-lg mt-5 mb-2 text-white font-semibold">
              Or Select an Avatar
            </Text>

            <FlatList
              data={avatar}
              horizontal
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    const uri = Image.resolveAssetSource(item).uri;
                    setImage(uri);
                    setUserData((previous) => ({
                      ...previous,
                      profileImage: uri,
                    }));
                  }}
                >
                  <Image
                    source={item}
                    className="h-20 w-20 rounded-full mx-2 border-2 border-purple-500 shadow-md shadow-purple-700/50"
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </LinearGradient>

        {/* Create Account Button */}
        <View className="mt-10 w-full px-8">
          <LinearGradient
            colors={["#6b21a8", "#7e22ce", "#9333ea"]}
            start={[0, 0]}
            end={[1, 1]}
            className="rounded-full"
          >
            <Pressable
              disabled={loading}
              className="justify-center items-center w-full h-14 rounded-full"
              onPress={async () => {
                if (!userData.profileImage) {
                  Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: "Select your profile image or avatar",
                  });
                  return;
                }

                try {
  setLoading(true);
  const res = await createNewAccount(userData);


  const response = typeof res === "string" ? JSON.parse(res) : res;

  if (response && response.status === true) {
    const id = response.userId;
    if (auth) await auth.signUp(String(id));

    navigation.reset({
      index: 0,
      routes: [{ name: "HomeScreen" }],
    });
  } else {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: "Warning",
      textBody: response?.message || "Account creation failed!",
    });
  }
} catch (error) {
  console.error("Create account error:", error);
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: "Error",
    textBody: "Something went wrong. Please try again.",
  });
} finally {
  setLoading(false);
}
              }}

            >
              {loading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <Text className="text-white font-extrabold text-lg tracking-wider">
                  CREATE ACCOUNT 🚀
                </Text>
              )}
            </Pressable>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </GalaxyBackground>
  );
}
