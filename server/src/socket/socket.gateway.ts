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

enum RoomMessageEnum {
  OPTION_SELECTED = 'option selected',
  ROOM_OPTION_SELECTED = 'room option selected',
  QUIZ_COMPLETED = 'quiz completed',
  CREATE_ROOM = 'create room',
  JOIN_ROOM = 'join room',
  ROOM_LIST = 'room list',
  START_QUIZ_ROOM = 'start quizroom'
}
interface IMessage {
  type: MessageEnum,
  payload: any
}

interface IRoomMessage {
  type: RoomMessageEnum
  payload: any
}
interface IScore {
  [key: string]: number
}

interface IRoomScore {
  name: string
  score: number,
  socketId: string
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


  private challengeScores: Map<string, IScore> = new Map()

  private roomScores: Map<string, IRoomScore[]> = new Map()

  private rooms: Map<string, string> = new Map()


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
    this.challengeScores.delete(client.id)
    this.roomScores.delete(this.rooms.get(client.id))
    this.rooms.delete(client.id)
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
        console.log('IN CHALLENGE', user, category, client.id)
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
        console.log('SENDING MESSAGE TO OPPONENT', clientId, client.id)
        this.sendMessage(clientId, JSON.stringify(acceptedMessage), LIST.CHALLENGE_ACCEPTED)
        const users = [client.id, clientId]
        this.challengeScores.set(clientId, { [clientId]: 0, [client.id]: 0 })
        console.log('JOINING ROOM')
        this.joinRoom(clientId, users)
      }
    }
  }

  @SubscribeMessage('room')
  handleRoomMessage(client: Socket, payload: string) {
    console.log('PAYLOAD -- room', payload)
    const parsedValue = JSON.parse(payload) as IRoomMessage
    switch (parsedValue.type) {
      case RoomMessageEnum.OPTION_SELECTED:
        const { roomId, score } = parsedValue.payload
        const currentScore = { ...this.challengeScores.get(roomId) }
        console.log('ROOM ID', roomId)
        console.log('CURRENT SCORE', currentScore, 'CURRENT SOCKET', client.id)
        currentScore[client.id] = currentScore[client.id] + score
        this.challengeScores.set(roomId, currentScore)
        console.log('>>>>> SENDING score', currentScore)
        this.server.to(roomId).emit('room', JSON.stringify(currentScore))
        return
      case RoomMessageEnum.QUIZ_COMPLETED:
        this.challengeScores.delete(client.id)
        console.log('REMOVED ROOMS', this.challengeScores)
        return
      case RoomMessageEnum.CREATE_ROOM: {
        const { roomCode, name } = parsedValue.payload
        this.joinRoom(roomCode, [client.id])
        const response = { type: 'USER_LIST', users: [] }
        const usersArray = []
        usersArray.push({
          name,
          socketId: client.id,
          score: 0
        })
        this.rooms.set(client.id, roomCode)
        this.roomScores.set(roomCode, usersArray)
        response.users = usersArray
        this.server.to(roomCode).emit('room', JSON.stringify(response))
        console.log('CREATED ROOM', this.roomScores)
        return
      }
      case RoomMessageEnum.JOIN_ROOM: {
        const { roomCode, name } = parsedValue.payload
        this.joinRoom(roomCode, [client.id])
        const usersArray = this.roomScores.get(roomCode) ?? []
        if (usersArray.findIndex(value => value.socketId === client.id) >= 0) {
          return
        }
        const response = { type: 'USER_LIST', users: [] }
        usersArray.push({
          name,
          socketId: client.id,
          score: 0
        })
        this.roomScores.set(roomCode, usersArray)
        response.users = usersArray
        this.server.to(roomCode).emit('room', JSON.stringify(response))
        console.log('JOINED ROOM', this.roomScores)

        return
      }

      case RoomMessageEnum.ROOM_LIST: {
        const { roomCode } = parsedValue.payload
        const response = { type: 'USER_LIST', users: [] }
        const usersArray = this.roomScores.get(roomCode) ?? []
        response.users = usersArray
        console.log('ROOM CODE', roomCode, 'VALUE', usersArray)
        this.server.to(roomCode).emit('room', JSON.stringify(response))
        return
      }

      case RoomMessageEnum.START_QUIZ_ROOM: {
        const { roomCode } = parsedValue.payload
        const response = { type: 'QUIZ_STARTED' }
        this.server.to(roomCode).emit('room', JSON.stringify(response))
        return
      }

      case RoomMessageEnum.ROOM_OPTION_SELECTED: {
        const { payload: { roomCode, score } } = parsedValue.payload
        const roomScore = this.roomScores.get(roomCode)
        if (!roomScore) {
          console.log('NO ROOM FOUND')
          return
        }
        const usersArray = roomCode.map(value => {
          if (value.socketId) {
            value.score += score
          }
          return value
        })
        console.log('NEW SCORE >>>>>', client.id, usersArray)
        this.roomScores.set(roomCode, usersArray)
        this.server.to(roomCode).emit('room', JSON.stringify(usersArray))
        return
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