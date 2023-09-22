// src/websocket/websocket.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    // This method is called when a client connects to the WebSocket server.
    console.log('Client connected');
  }

  handleDisconnect(client: any) {
    // This method is called when a client disconnects from the WebSocket server.
    console.log('Client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    // This method is called when a client sends a 'message' event.
    console.log(`Message received: ${payload}`);
    // You can send a response back to the client if needed.
    this.server.emit('response', 'Received your message: ' + payload);
  }
}