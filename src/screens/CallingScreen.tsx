import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CallScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0b0022] items-center justify-center">
      {/* Caller Image */}
      <Image
        source={{
          uri: "https://i.pravatar.cc/300",
        }}
        className="w-40 h-40 rounded-full mb-6"
      />

      {/* Caller Name */}
      <Text className="text-white text-3xl font-bold mb-2">Princess</Text>

      {/* Call Status */}
      <Text className="text-gray-400 text-lg mb-14">Incoming Call...</Text>

      {/* Control Buttons */}
      <View className="flex-row justify-between w-[90%] absolute bottom-16">
        {/* Accept Call */}
        <TouchableOpacity className="bg-green-500 w-16 h-16 rounded-full items-center justify-center">
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Mute */}
        <TouchableOpacity className="bg-gray-700 w-16 h-16 rounded-full items-center justify-center">
          <Ionicons name="mic-off" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Speaker */}
        <TouchableOpacity className="bg-gray-700 w-16 h-16 rounded-full items-center justify-center">
          <Ionicons name="volume-high" size={28} color="#fff" />
        </TouchableOpacity>

        {/* End Call */}
        <TouchableOpacity className="bg-red-600 w-16 h-16 rounded-full items-center justify-center">
          <Ionicons
            name="call"
            size={28}
            color="#fff"
            style={{ transform: [{ rotate: "135deg" }] }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
