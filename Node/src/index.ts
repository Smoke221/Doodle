import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import keycloak from "../configs/keycloak";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.set("trust proxy", true);
app.use(keycloak.middleware());

const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin:"http://localhost:5173"
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} is connected`);

  socket.on("drawing", (data) => {
    // Broadcasting the drawing data to all clients except the sender
    socket.broadcast.emit("drawing", data)
    
    console.log(data);
    
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// app.get("/protected", keycloak.protect(), (req: Request, res: Response) => {
//   res.send("entered the secure zone");
// });

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
