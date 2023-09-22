import { Module } from "@nestjs/common";
import { WebsocketGateway } from './socket.gateway';
import { WebsocketController } from "./socket.controller";

@Module({
    controllers: [WebsocketController],
    providers: [WebsocketGateway],
  })
  export class WebsocketModule {}