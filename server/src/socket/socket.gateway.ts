import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { decode } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

const LIST = {
  MAIN_ROOM: 'mainRoom',
  CHALLENGE: 'challenge'
}


enum MessageEnum {
  USER_LIST = 'user list',
  CHALLENGE = 'challenge'
}
interface IMessage {
  type: MessageEnum,
  payload: any
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
      client.join(LIST.MAIN_ROOM)
      const payload = decode(jwtToken)
      this.allUsers.set(socketId, payload)
      this.sendMessage(LIST.MAIN_ROOM, this.getTotalUsers())
    }
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    this.allUsers.delete(client.id)
    const payload = this.getTotalUsers()
    this.sendMessage(LIST.MAIN_ROOM, payload)
    console.log('Client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string) {
    const parsedValue = JSON.parse(payload) as IMessage
    switch (parsedValue.type) {
      case MessageEnum.USER_LIST: {
        const payload = this.getTotalUsers()
        this.sendMessage(client.id, payload)
        return;
      }
      case MessageEnum.CHALLENGE: {
        const { user, category } = parsedValue.payload
        const opponentUser = this.allUsers.get(client.id)
        const payload = JSON.stringify({ user: opponentUser, category })
        this.sendMessage(user, payload, LIST.CHALLENGE)
        return;
      }
    }
  }

  getTotalUsers() {
    const users = []
    for (const value of this.allUsers) {
      users.push({ ...value[1], socketId: value[0] })
    }
    return JSON.stringify(users)
  }

  sendMessage(to: string, payload: string, client = LIST.MAIN_ROOM) {
    this.server.to(to).emit(client, JSON.stringify(payload))
  }
  joinRoom(roomName: string, data: any) {

  }
}