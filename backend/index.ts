import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import http from "http";
// import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./utils/error";
import mysql from "mysql2";
import { initializeDatabase } from "./db/dal";

const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1); // Trust the first proxy

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 100,
//   standardHeaders: "draft-7",
//   legacyHeaders: false,
// });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(limiter);

import authRouter from "./app/auth/domain/route";
import searchRouter from "./app/user/domain/route";
import chatRouter from "./app/chat/domain/route";
import { APIVERSION } from "./utils/constants";
import { setupWebSocketServer } from "./app/chat/api/websocketServer";

setupWebSocketServer(server);

app.use(`/${APIVERSION}/auth`, authRouter);
app.use(`/${APIVERSION}/user`, searchRouter);
app.use(`/${APIVERSION}/chat`, chatRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Chat message server is running!");
});

app.use(errorHandler);

// process.on("unhandledRejection", (reason, p) => {
//   logger.error("Unhandled Rejection:", reason);
//   throw reason;
// });

// process.on("uncaughtException", (error) => {
//   logger.error("Uncaught Exception:", error);

//   if (!errorHandler.isTrustedError(error)) {
//     logger.error("Exiting due to untrusted error.");
//     process.exit(1);
//   }
// });

const port = process.env.PORT || 4192;

// Call the function to initialize database and tables
initializeDatabase();

server.listen(port, () => {
  console.log("Server started on port " + port);
});
