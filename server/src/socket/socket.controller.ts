// src/websocket/websocket.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('websocket')
@ApiTags('Socket')
export class WebsocketController {
  @Get()
  root(): string {
    return 'WebSocket server is running!';
  }
}
