import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useChatList } from "../socket/UseChatList";
import { Chat } from "../socket/chat";
import Animated, { FadeInUp, Layout, BounceIn, FadeInDown } from "react-native-reanimated";
import { AuthContext } from "../components/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";

// Function to show **only time** in HH:MM AM/PM format
export function formatChatTimeOnly(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;
const { width } = Dimensions.get("window");
const fontScale = width / 390; // base iPhone 12 Pro width

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const navigation = useNavigation<HomeScreenProps>();
  const chatList = useChatList();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const auth = useContext(AuthContext);
  const { applied } = useTheme();

  // --- Theme Colors ---
  const bgColor = applied === "dark" ? "#0d0d2b" : applied === "light" ? "#f0f0f0" : "#0b0033"; // galaxy
  const textColor = applied === "dark" ? "#fff" : applied === "light" ? "#000" : "#fff"; // galaxy
  const placeholderColor = applied === "dark" ? "#aaa" : applied === "light" ? "#666" : "#ccc";
  const cardBg = applied === "dark" ? "rgba(255,255,255,0.05)" : applied === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)"; // galaxy
  const menuBg = applied === "dark" ? "#1a1a3d" : applied === "light" ? "#fff" : "#1a0033"; // galaxy
  const menuTextColor = applied === "dark" ? "#fff" : applied === "light" ? "#000" : "#fff"; // galaxy
  const fabColor = applied === "dark" ? "#9d8cff" : applied === "light" ? "#6c5ce7" : "#bb33ff"; // galaxy

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "🚀 Galaxy Chat",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 22 * fontScale,
        color: textColor,
      },
      headerStyle: { backgroundColor: bgColor },
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 16, marginRight: 12 }}>
          <TouchableOpacity>
            <Ionicons name="camera" size={26} color={fabColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(!isMenuVisible)}>
            <Ionicons name="ellipsis-vertical" size={24} color={fabColor} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isMenuVisible, applied]);

  const filterChats = chatList.filter(
    (chat) =>
      chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: Chat; index: number }) => {
    const lastMessageTime = formatChatTimeOnly(item.lastTimeStamp);

    return (
      <Animated.View entering={FadeInUp.delay(index * 50)} layout={Layout.springify()}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            marginVertical: 6,
            marginHorizontal: 12,
            backgroundColor: cardBg,
            borderRadius: 16,
          }}
          onPress={() => {
            navigation.navigate("SingheChatScreen", {
              chatId: item.friendId,
              friendName: item.friendName,
              lastSeenTime: lastMessageTime,
              profimeImage: item.profileImage,
            });
          }}
        >
          <View
            style={{
              height: 56,
              width: 56,
              borderRadius: 28,
              borderWidth: 2,
              borderColor: fabColor,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.profileImage ? (
              <Image
                source={{ uri: item.profileImage }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
              />
            ) : (
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${item.friendFirstName}&background=random`,
                }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
              />
            )}
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18 * fontScale,
                  color: textColor,
                  flexShrink: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.friendName}
              </Text>
              <Text style={{ fontSize: 12 * fontScale, color: placeholderColor, marginLeft: 8 }}>
                {lastMessageTime}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: placeholderColor,
                  fontSize: 14 * fontScale,
                  flexShrink: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.lastMessage}
              </Text>

              {item.unreadCount > 0 && (
                <View
                  style={{
                    backgroundColor: fabColor,
                    borderRadius: 12,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    marginLeft: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                    {item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={["top", "right", "bottom", "left"]}>
      <StatusBar style={applied === "dark" ? "light" : "dark"} translucent={false} />

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 12,
          borderRadius: 50,
          paddingHorizontal: 12,
          height: 48,
          marginTop: 12,
          backgroundColor: cardBg,
        }}
      >
        <Ionicons name="search" size={20} color={fabColor} />
        <TextInput
          style={{
            flex: 1,
            fontSize: 16 * fontScale,
            fontWeight: "600",
            color: textColor,
            marginLeft: 8,
          }}
          placeholder="Search the Galaxy..."
          placeholderTextColor={placeholderColor}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Chat List */}
      <View style={{ flex: 1, marginTop: 8 }}>
        <FlatList
          data={filterChats}
          renderItem={renderItem}
          keyExtractor={(item) => item.friendId.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      {/* Floating Action Button */}
      <Animated.View entering={BounceIn} style={{ position: "absolute", bottom: 16, right: 16 }}>
        <TouchableOpacity
          style={{
            height: 64,
            width: 64,
            borderRadius: 32,
            backgroundColor: fabColor,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <Ionicons name="chatbox-ellipses" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* 🔮 Popup Menu */}
      {isMenuVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={{
              position: "absolute",
              top: 50,
              right: 16,
              backgroundColor: menuBg,
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              minWidth: 160,
            }}
          >
            <TouchableOpacity
              style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("ProfileScreen");
              }}
            >
              <Ionicons name="person-circle-outline" size={20} color={fabColor} />
              <Text style={{ color: menuTextColor, fontSize: 16, marginLeft: 8 }}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("SettingScreen");
              }}
            >
              <Ionicons name="information-circle-outline" size={20} color={fabColor} />
              <Text style={{ color: menuTextColor, fontSize: 16, marginLeft: 8 }}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center" }}
              onPress={async () => {
                try {
                  if (auth) await auth.signOut();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "SignUpScreen" }],
                  });
                } catch (error) {
                  console.error("Logout failed:", error);
                }
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="tomato" />
              <Text style={{ color: "tomato", fontSize: 16, marginLeft: 8 }}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
