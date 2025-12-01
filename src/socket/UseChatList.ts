import { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Chat, WSResponse } from "./chat";

export function useChatList(): Chat[] {
  const { socket, sendMessage } = useWebSocket();
  const [chatList, setChatList] = useState<Chat[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Ask server for friend chat list
    sendMessage({ type: "get_chat_list" });

    const onMessage = (event: MessageEvent) => {
      try {
        const response: WSResponse = JSON.parse(event.data);

        if (response.type === "friend_list") {
         
          const chats: Chat[] = response.payload.map((item: any) => ({
            friendId: item.friendId,
            friendName: item.friendName,
            friendFirstName: item.friendName.split(" ")[0],
            lastMessage: item.lastMessage || "🌌 Hey there! I am using Galaxy Chat",
            lastTimeStamp: item.lastTimeStamp,
            profileImage: item.profileImage,
            unreadCount: item.unreadCount || 0,
          }));

          setChatList(chats);
        }
      } catch (err) {
        console.error("Error parsing WS message", err);
      }
    };

    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);

  return chatList;
}
