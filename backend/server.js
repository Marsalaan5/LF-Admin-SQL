import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import authRoutes from "./routes/auth.js";
import path from "path";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const PORT = 5001;

app.use("/auth", authRoutes);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
});

let pool;
const connectDB = async () => {
  try {
    pool = await mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "admin",
    });
    console.log("Mysql connected successfully");
  } catch (error) {
    console.error("MYSQL pool error", error);
    process.exit(1);
  }
};

connectDB();

server.listen(PORT, () => console.log(`Server started on : ${PORT}`));

export { pool, io };
