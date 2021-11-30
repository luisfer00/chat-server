import { Server } from "socket.io";
import { PORT } from "./config/constants";
import messageEvents from "./events/message";
import userEvents from "./events/user";

const io = new Server(PORT, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`New client: ${socket.id}`);
  messageEvents(io, socket);
  userEvents(io, socket);
});

console.log("Server at port", PORT);
