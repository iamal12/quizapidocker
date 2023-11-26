import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Tournament')
@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/join/:id')
  join(@Param('id') id: string,@Req() req:any) {
    return this.tournamentService.joinTournament(+id,req.user);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentService.findOne(+id);
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTournamentDto: UpdateTournamentDto) {
    return this.tournamentService.update(+id, updateTournamentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentService.remove(+id);
  }
}
