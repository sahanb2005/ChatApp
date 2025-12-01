import { useWebSocket } from "./WebSocketProvider";

export function useSendChat() {
  const { sendMessage } = useWebSocket();

  const sendChat = (
    toUserId: number,
    message: string,
    fileUrl?: string,
    fileType?: string
  ) => {
    sendMessage({
      type: "send_message",
      toUserId,
      message,
      fileUrl: fileUrl || "",
      fileType: fileType || "",
    });
  };

  return sendChat;
}
  