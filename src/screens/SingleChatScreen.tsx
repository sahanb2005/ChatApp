import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { RootStack } from "../../App";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";
import { useTheme } from "../theme/ThemeProvider";

type SingleChatScreenProps = NativeStackScreenProps<RootStack, "SingheChatScreen">;

// ✅ Type-safe message content
type ChatContent =
  | { type: "text"; text: string }
  | { type: "image"; uri: string }
  | { type: "file"; uri: string };

export default function SingleChatScreen({ route, navigation }: SingleChatScreenProps) {
  const { chatId, friendName, profimeImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const [input, setInput] = useState("");

  const { applied } = useTheme();

  const getThemeColors = () => ({
    bg: applied === "light" ? "#fff" : applied === "dark" ? "#0d0d2b" : "#0b0022",
    text: applied === "light" ? "#000" : "#fff",
    secondaryText: applied === "light" ? "#555" : "#aaa",
    inputBg: applied === "light" ? "#f2f2f2" : "#1a1a2e",
    sendBtn: "#9d8cff",
    chatMeBg: applied === "light" ? "#6b21a8" : "#6b21a8",
    chatFriendBg: applied === "light" ? "#e0e0ff" : "#1a1a2e",
  });

  const colors = getThemeColors();

  const handleSendChat = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input.trim());
    setInput("");
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imgUri = result.assets[0].uri;
      sendMessage(chatId, `[IMAGE]:${imgUri}`);
    }
  };

  // ✅ Fixed version — no red lines
  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri; // ✅ Correct
      sendMessage(chatId, `[FILE]:${fileUri}`);
    }
  };

  const renderItem = ({ item }: { item: Chat }) => {
    const isMe = item.from.id !== chatId;
    const isImage = item.message.startsWith("[IMAGE]:");
    const isFile = item.message.startsWith("[FILE]:");

    const content: ChatContent = isImage
      ? { type: "image", uri: item.message.replace("[IMAGE]:", "") }
      : isFile
      ? { type: "file", uri: item.message.replace("[FILE]:", "") }
      : { type: "text", text: item.message };

    return (
      <View
        style={{
          alignSelf: isMe ? "flex-end" : "flex-start",
          backgroundColor: isMe ? colors.chatMeBg : colors.chatFriendBg,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
          marginVertical: 4,
          maxWidth: "75%",
        }}
      >
        {content.type === "text" && (
          <Text style={{ color: colors.text, fontSize: 16 }}>{content.text}</Text>
        )}

        {content.type === "image" && (
          <Image
            source={{ uri: content.uri }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              marginVertical: 4,
              alignSelf: "center",
            }}
            resizeMode="cover"
          />
        )}

        {content.type === "file" && (
          <TouchableOpacity onPress={() => Linking.openURL(content.uri)}>
            <Text style={{ color: "#00f", textDecorationLine: "underline" }}>📎 Open File</Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.secondaryText, fontSize: 12, fontStyle: "italic" }}>
            {formatChatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Ionicons
              name={
                item.status === "READ"
                  ? "checkmark-done"
                  : item.status === "DELIVERED"
                  ? "checkmark-done-sharp"
                  : "checkmark"
              }
              size={16}
              color={item.status === "READ" ? colors.text : colors.secondaryText}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* ------------------- Header ------------------- */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: colors.bg,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={28} color={colors.sendBtn} />
        </TouchableOpacity>

        {profimeImage ? (
          <Image
            source={{ uri: profimeImage }}
            style={{ width: 56, height: 56, borderRadius: 28, marginLeft: 12 }}
          />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#444",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
              {friendName?.trim()?.charAt(0).toUpperCase() || ""}
            </Text>
          </View>
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{ color: colors.text, fontWeight: "bold", fontSize: 18 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {friend ? `${friend.firstName} ${friend.lastName}` : friendName}
          </Text>
          <Text
            style={{ color: colors.secondaryText, fontSize: 14, fontStyle: "italic" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {friend
              ? friend.status === "ONLINE"
                ? "Online"
                : `Last seen ${formatChatTime(friend.updatedAt?.toString() ?? "")}`
              : ""}
          </Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical-sharp" size={28} color={colors.sendBtn} />
        </TouchableOpacity>
      </View>

      {/* ------------------- Chat Area ------------------- */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={singleChat.message}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        />

        {/* ------------------- Input Bar ------------------- */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: colors.inputBg,
          }}
        >
          <TouchableOpacity onPress={handlePickFile} style={{ padding: 8 }}>
            <Ionicons name="attach" size={24} color={colors.sendBtn} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePickImage} style={{ padding: 8 }}>
            <Ionicons name="image-outline" size={24} color={colors.sendBtn} />
          </TouchableOpacity>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.secondaryText}
            multiline
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: colors.bg,
              borderRadius: 24,
              color: colors.text,
              fontSize: 16,
              maxHeight: 120,
              marginHorizontal: 8,
            }}
          />

          <TouchableOpacity
            onPress={handleSendChat}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.sendBtn,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
