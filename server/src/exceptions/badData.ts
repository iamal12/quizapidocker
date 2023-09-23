import { HttpException, HttpStatus } from "@nestjs/common";

export class BadDataException extends HttpException {
    constructor(errorMessage) {
      super(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
  