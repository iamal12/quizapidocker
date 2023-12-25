import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TournamentService {
  constructor(@InjectRepository(Tournament) private tournamentRepository: Repository<Tournament>, private categoryService: CategoriesService) { }
  async create(createTournamentDto: CreateTournamentDto) {
    const { category, ...rest } = createTournamentDto
    const categoryEntity = await this.categoryService.findOne(category)
    const tournament = this.tournamentRepository.create({ ...rest, category: categoryEntity })
    return this.tournamentRepository.save(tournament)
  }

  findAll() {
    return this.tournamentRepository.createQueryBuilder('tournament').innerJoinAndSelect('tournament.category', 'category').leftJoinAndSelect('tournament.users', 'users').orderBy('tournament.created', 'DESC').getMany();
  }

  findOne(id: number) {
    return this.tournamentRepository.findOne({ where: { id }, relations: ['users'] })
  }

  findJoinedTournaments(user?: User) {
    return this.tournamentRepository
      .createQueryBuilder('tournament')
      .innerJoinAndSelect('tournament.category', 'category')
      .innerJoinAndSelect('tournament.users', 'users')
      .where('users.id = :userId', { userId: user.id })
      .orderBy('tournament.created', 'DESC').getMany();
  }

  findUpcomingTournaments() {
    return this.tournamentRepository
      .createQueryBuilder('tournament')
      .innerJoinAndSelect('tournament.category', 'category')
      .leftJoinAndSelect('tournament.users', 'users')
      .where('tournament.startTime > :currentTime', { currentTime: new Date() })
      .orderBy('tournament.created', 'DESC').getMany();
  }

  update(id: number, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: number) {
    return this.tournamentRepository.delete({ id });
  }

  async joinTournament(id: number, user: User) {
    const tournament = await this.findOne(id)
    const users = tournament.users ?? []
    const index = users.findIndex(value => value.id === user.id)
    if (index === -1) {
      tournament.users = [...users, user]
      return this.tournamentRepository.save(tournament)
    }
    return tournament
  }
}
