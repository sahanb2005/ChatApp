import { useEffect, useState } from "react"

import { WSResponse } from "./chat";
import { useWebSocket } from "./WebSocketProvider";

export function useWebSocketPing(intertvel:number){
const {socket,isConnected,sendMessage} = useWebSocket();

useEffect(()=>{
    if(!socket || !isConnected){
        return;
    }
    const pingTimer = setInterval (()=>{
        sendMessage({type:"PING"});
    },intertvel);
    const onMessage = (event:MessageEvent)=>{
        const response : WSResponse = JSON.parse(event.data);
        if (response.type === "PONG") {
            console.log("WebSocket: PONG");
        }
    };
    socket.addEventListener("message",onMessage);
    return()=>{
        clearInterval(pingTimer);
        socket.removeEventListener("message",onMessage);
    };
return()=>{
    clearInterval(pingTimer);
}

},[socket,isConnected,sendMessage,intertvel]);
}