import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { decode } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

const LIST = {
  MAIN_ROOM: 'mainRoom',
  CHALLENGE: 'challenge',
  CHALLENGE_ACCEPTED: 'challenge_accepted'
}


enum MessageEnum {
  USER_LIST = 'user list',
  CHALLENGE = 'challenge',
  ACCEPT_CHALLENGE = 'accept_challenge'
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
    console.log('PAYLOAD', payload)
    const parsedValue = JSON.parse(payload) as IMessage
    switch (parsedValue.type) {
      case MessageEnum.USER_LIST: {
        const payload = this.getTotalUsers()
        this.sendMessage(client.id, payload)
        return;
      }
      case MessageEnum.CHALLENGE: {
        const { user, category } = parsedValue.payload
        console.log('IN CHALLENGE', user, category)
        const opponentUser = this.allUsers.get(client.id)
        opponentUser.clientId = client.id
        const payload = JSON.stringify({ user: opponentUser, category })
        console.log('SENDING PAYLOAD', payload, 'TO', user)
        this.sendMessage(user, payload, LIST.CHALLENGE)
        return;
      }
      case MessageEnum.ACCEPT_CHALLENGE: {
        const { clientId, opponentEmail } = parsedValue.payload
        const acceptedMessage = { accepted: true, opponentEmail }
        console.log('SENDING MESSAGE TO OPPONENT')
        this.sendMessage(clientId, JSON.stringify(acceptedMessage), LIST.CHALLENGE_ACCEPTED)
        const users = [client.id, clientId]
        console.log('JOINING ROOM')
        this.joinRoom(clientId, users)
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
  joinRoom(roomName: string, users: string[]) {
    users.forEach(user => {
      const socket = this.server.sockets.sockets.get(user)
      if (socket) {
        console.log(user, 'JOINED ROOM')
        socket.join(roomName)
      } else {
        console.log('NO SOCKET FOUND')
      }
    })
  }
}