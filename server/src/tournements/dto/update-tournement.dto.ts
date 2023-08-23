import { PartialType } from '@nestjs/mapped-types';
import { CreateTournementDto } from './create-tournement.dto';

export class UpdateTournementDto extends PartialType(CreateTournementDto) {}
