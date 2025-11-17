import { prismaClient } from './../../../packages/db/src/index';
import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv";
import { JWT_SECRET } from "@repo/backend-common/config";
// import { prismaClient } from "@repo/db/client";


const wss = new WebSocketServer({ port: 8080 });
dotenv.config();

interface User {
    userId: string;
    socket: WebSocket;
    room: string[];
}
const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded == "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (error) {
        return null;
    }
}


wss.on("connection", (socket, request) => {
    const url = request.url;

    if (!url) {
        return console.log("URL not recived yet!");
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (userId == null) {
        socket.close()
        return null;
    }

    users.push({
        userId,
        socket,
        room: []
    })


    socket.on("message", async function (msg) {
        const parsedData = JSON.parse(msg as unknown as string);

        if (parsedData.type == "join_room") {
            const user = users.find(x => x.socket === socket);
            user?.room.push(String(parsedData.roomId));
        }

        if (parsedData.type == "leave_room") {
            const user = users.find(user => user.socket === socket);
            if (!user) {
                return;
            }

            user.room = user?.room.filter(user => user !== parsedData.room);
        }

        if (parsedData.type === "chat") {
            const roomId = String(parsedData.roomId);
            const message = parsedData.msg;
            await prismaClient.Chat.create({
                data: {
                    roomId: Number(roomId),
                    message,
                    userId
                }
            })

            //broadcasting the msg
            users.forEach(user => {
                if (user.room.includes(roomId)) {
                    user.socket.send(JSON.stringify({
                        type: "chat",
                        roomId,
                        message: message,
                        sender: userId
                    }))
                }
            });
        }
    })
})
