import { Server, Socket } from "socket.io";
import { userType } from "../types";
import { messages } from "./message";

export const connectedUsers: userType[] = [];

const userEvents = (io: Server, socket: Socket) => {
  const login = (name: string) => {
    const userExists = connectedUsers.find((connectedUser) => {
      return connectedUser.name === name;
    });
    if (userExists) return socket.emit("error:login");

    const user: userType = {
      name,
      id: socket.id,
      typing: false,
    };
    connectedUsers.push(user);
    socket.broadcast.emit("user:new-user", name);
    socket.emit("user:login", user);
    socket.emit("message:messages", messages);
  };

  const disconnect = () => {
    const userIndex = connectedUsers.findIndex((user) => user.id === socket.id);
    if (userIndex === -1) return;

    const userName = connectedUsers[userIndex].name;
    connectedUsers.splice(userIndex, 1);
    io.emit("user:disconnect", userName);
  };

  socket.on("user:login", login);
  socket.on("disconnect", disconnect);
};

export default userEvents;
