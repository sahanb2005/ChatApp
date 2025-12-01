import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView, View, FlatList, TextInput, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStack } from "../../App";
import { Ionicons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useUserList } from "../socket/UseUserList";
import { useTheme } from "../theme/ThemeProvider";
import { User } from "../socket/chat";

const { width } = Dimensions.get("window");
const fontScale = width / 390;

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const [search, setSearch] = useState("");
  const users = useUserList();
  const { applied } = useTheme();

  const getThemeColors = () => {
    return {
      bg: applied === "light" ? "#fff" : applied === "dark" ? "#0d0d2b" : "#0b0022",
      text: applied === "light" ? "#000" : "#fff",
      secondaryText: applied === "light" ? "#555" : "#aaa",
      cardBg: applied === "light" ? "rgba(240,240,240,0.6)" : "rgba(50,50,100,0.5)",
      borderColor: applied === "light" ? "#ccc" : "#9d8cff",
      searchBg: applied === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
    };
  };

  const colors = getThemeColors();
  const textColor = colors.text;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "🚀 Galaxy Chat",
      headerStyle: { backgroundColor: colors.bg },
      headerTitleStyle: { fontWeight: "bold", fontSize: 22 * fontScale, color: textColor },
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", padding: 4 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-sharp" size={24} color={colors.borderColor} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 16 * fontScale, fontWeight: "bold", color: textColor }}>
              Select Contact
            </Text>
            <Text style={{ fontSize: 12 * fontScale, fontWeight: "bold", color: colors.secondaryText }}>
              {users.length} Contact{users.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => <View></View>,
    });
  }, [navigation, users, applied]);

  const renderItem = ({ item }: { item: User }) => {
    const firstName = item.firstName ?? "Unknown";
    const lastName = item.lastName ?? "";
    const profileImage = item.profileImage
      ? item.profileImage
      : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 12,
          backgroundColor: colors.cardBg,
          marginBottom: 8,
        }}
        onPress={() => {
          navigation.replace("SingheChatScreen", {
            chatId: item.id,
            friendName: `${firstName} ${lastName}`,
            lastSeenTime: item.updatedAt,
            profimeImage: profileImage,
          });
        }}
      >
        <Image
          source={{ uri: profileImage }}
          style={{ height: 56, width: 56, borderRadius: 28, borderWidth: 2, borderColor: colors.borderColor }}
        />
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={{ fontSize: 18 * fontScale, fontWeight: "bold", color: textColor }}>
            {firstName} {lastName}
          </Text>
          <Text style={{ fontSize: 14 * fontScale, fontStyle: "italic", color: colors.secondaryText }} numberOfLines={1}>
            {item.status === "ACTIVE"
              ? "✨ Already in Friend List"
              : "🌌 Hey there! I am using Galaxy Chat"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filterChats = [...users]
    .filter(user => {
      const firstName = (user.firstName ?? "").toLowerCase();
      const lastName = (user.lastName ?? "").toLowerCase();
      const contactNo = (user.contactNo ?? "").toLowerCase();
      const query = search.toLowerCase();
      return firstName.includes(query) || lastName.includes(query) || contactNo.includes(query);
    })
    .sort((a, b) => (a.firstName ?? "").localeCompare(b.firstName ?? ""));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={applied === "light" ? "dark" : "light"} />
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", borderRadius: 50, paddingHorizontal: 12, height: 48, marginTop: 12, backgroundColor: colors.searchBg }}>
          <Ionicons name="search" size={20} color={colors.borderColor} />
          <TextInput
            style={{ flex: 1, fontSize: 16 * fontScale, fontWeight: "600", color: textColor, marginLeft: 8 }}
            placeholder="Search the Galaxy..."
            placeholderTextColor={colors.secondaryText}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* New Contact Button */}
        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 8 }}
            onPress={() => navigation.navigate("NewContactScreen")}
          >
            <View style={{ backgroundColor: "#6b21a8", justifyContent: "center", alignItems: "center", width: 48, height: 48, borderRadius: 24 }}>
              <Feather name="user-plus" size={22} color="white" />
            </View>
            <Text style={{ fontSize: 16 * fontScale, fontWeight: "bold", color: textColor }}>Add New Astronaut</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filterChats}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}
