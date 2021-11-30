import { Server, Socket } from "socket.io";
import { messageType } from "../types";
import { connectedUsers } from "./user";

export const messages: messageType[] = [];

const messageEvents = (io: Server, socket: Socket) => {
  const newMessage = (message: messageType) => {
    messages.push(message);
    socket.broadcast.emit("message:new-message", message);
  };

  const typing = () => {
    const userIndex = connectedUsers.findIndex((user) => user.id === socket.id);
    if (userIndex === -1) return;
    connectedUsers[userIndex].typing = true;
    const typingUserNames = connectedUsers
      .filter((user) => user.typing)
      .map((user) => user.name);
    socket.broadcast.emit("message:typing", typingUserNames);
  };

  const endTyping = () => {
    const userIndex = connectedUsers.findIndex((user) => user.id === socket.id);
    if (userIndex === -1) return;
    connectedUsers[userIndex].typing = false;
    const typingUserNames = connectedUsers
      .filter((user) => user.typing)
      .map((user) => user.name);
    socket.broadcast.emit("message:endTyping", typingUserNames);
  };

  socket.on("message:new-message", newMessage);
  socket.on("message:typing", typing);
  socket.on("message:endTyping", endTyping);
  socket.on("disconnect", endTyping);
};

export default messageEvents;
