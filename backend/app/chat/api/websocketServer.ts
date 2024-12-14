// import { Server } from "http";
// import WebSocket from "ws";
// import pool from "../../../db/dal";

// const userConnections = new Map<number, WebSocket>();

// export { setupWebSocketServer };

// function setupWebSocketServer(server: Server) {
//   const wss = new WebSocket.Server({ server });

//   wss.on("connection", function connection(ws: WebSocket) {
//     ws.on("message", function incoming(message) {
//       try {
//         const data = JSON.parse(message.toString());

//         if (data.type === "CONNECT") {
//           const { userId } = data;
//           if (userId) {
//             userConnections.set(userId, ws);
//             console.log(`User with ID ${userId} connected`);
//           }
//           return;
//         }

//         // Process regular messages
//         const { senderId, recipientId, message: content } = data;
//         userConnections.set(senderId, ws); // Update map on every message
//         saveMessageToDatabase(senderId, recipientId, content);
//         sendMessageToRecipient(senderId, recipientId, content);
//       } catch (error) {
//         console.error("Invalid message format:", error.message);
//         ws.send(
//           JSON.stringify({
//             error: "Invalid message format",
//             details: error.message,
//           })
//         );
//       }
//     });

//     ws.on("close", () => {
//       userConnections.forEach((value, key) => {
//         if (value === ws) {
//           userConnections.delete(key);
//         }
//       });
//     });
//   });
// }

// function saveMessageToDatabase(
//   senderId: number,
//   recipientId: number,
//   message: string
// ) {
//   const query =
//     "INSERT INTO chat (fk_sender_id, recipient_id, message) VALUES (?, ?, ?)";
//   pool.execute(query, [senderId, recipientId, message], function (error) {
//     if (error) throw error;
//     console.log("Message saved to database");
//   });
// }

// function sendMessageToRecipient(
//   senderId: number,
//   recipientId: number,
//   message: string
// ) {
//   console.log({ send: { senderId, recipientId, message } });

//   const recipientWs = userConnections.get(recipientId);
//   const senderWs = userConnections.get(senderId);

//   if (recipientWs) {
//     recipientWs.send(JSON.stringify({ senderId, recipientId, message }));
//   } else {
//     console.log(`Recipient with ID ${recipientId} is not connected`);
//   }

//   if (senderWs) {
//     senderWs.send(
//       JSON.stringify({
//         senderId,
//         recipientId,
//         message,
//         status: recipientWs ? "delivered" : "saved",
//       })
//     );
//   }
// }

// // server.js
// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// Store active connections with user identifiers
import { Server } from "http";

export { setupWebSocketServer };
// Install dependencies: express, ws
const express = require("express");
const { WebSocketServer } = require("ws");

function setupWebSocketServer(server: Server) {
  // WebSocket server
  const wss = new WebSocketServer({ server });

  // Store active WebSocket clients
  const clients = new Map(); // Map of userId -> WebSocket instance

  // Handle WebSocket connections
  wss.on("connection", (ws, req) => {
    console.log("A user connected");

    // On connection, expect the client to send a userId to identify themselves
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);

        if (data.type === "identify") {
          const { userId } = data;
          clients.set(userId, ws);
          ws.userId = userId;
          ws.send(
            JSON.stringify({
              type: "info",
              message: "You are now identified as " + userId,
            })
          );
        }

        if (data.type === "message") {
          const { toUserId, content } = data;

          if (clients.has(toUserId)) {
            // Send the message to the intended recipient
            const recipientWs = clients.get(toUserId);
            recipientWs.send(
              JSON.stringify({ type: "message", from: ws.userId, content })
            );

            // Echo back to sender for confirmation
            ws.send(
              JSON.stringify({
                type: "info",
                message: "Message sent to " + toUserId,
              })
            );
          } else {
            // Notify sender if the recipient is not connected
            ws.send(
              JSON.stringify({ type: "error", message: "User not connected" })
            );
          }
        }
      } catch (error) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid message format" })
        );
      }
    });

    ws.on("close", () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected`);
      }
    });
  });
}
