import { Injectable } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class TournamentService {
  constructor(@InjectRepository(Tournament) private tournamentRepository: Repository<Tournament>, private categoryService: CategoriesService) { }
  async create(createTournamentDto: CreateTournamentDto) {
    const {category,...rest} = createTournamentDto
    const categoryEntity = await this.categoryService.findOne(category)
    const tournament = this.tournamentRepository.create({...rest,category: categoryEntity})
    return this.tournamentRepository.save(tournament)
  }

  findAll() {
    return this.tournamentRepository.find();
  }

  findOne(id: number) {
    return this.tournamentRepository.findOneBy({id})
  }

  update(id: number, updateTournamentDto: UpdateTournamentDto) {
    return `This action updates a #${id} tournament`;
  }

  remove(id: number) {
    return this.tournamentRepository.delete({id});
  }
}
