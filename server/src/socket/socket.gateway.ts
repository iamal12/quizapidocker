// src/websocket/websocket.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { decode } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

const MAIN_ROOM = 'mainRoom'
enum MessageEnum {
  USER_LIST = 'user list'
}

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private allUsers: Map<string, any> = new Map()

  handleConnection(client: Socket, ...args: any[]) {
    const jwtToken = client.handshake.query.token as string
    const socketId = client.id
    if (jwtToken && socketId) {
      client.join(MAIN_ROOM)
      const payload = decode(jwtToken)
      this.allUsers.set(socketId, payload)
      this.sendMessage(MAIN_ROOM, this.getTotalUsers())
    }
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    this.allUsers.delete(client.id)
    const payload = this.getTotalUsers()
    this.sendMessage(MAIN_ROOM, payload)
    console.log('Client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: MessageEnum) {
    switch (payload) {
      case MessageEnum.USER_LIST:
        const payload = this.getTotalUsers()
        this.sendMessage(client.id, payload)
    }
  }

  getTotalUsers() {
    const users = []
    for (const value of this.allUsers) {
      users.push({ ...value[1], socketId: value[0] })
    }
    return JSON.stringify(users).replace(/\\/g, "")
  }

  sendMessage(to: string, payload: string) {
    this.server.to(to).emit(MAIN_ROOM, JSON.stringify(payload))

  }
  joinRoom(roomName: string, data: any) {

  }
}