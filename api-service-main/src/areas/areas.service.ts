import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Area } from '../database/entities/area.entity';
import { plainToClass } from 'class-transformer';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { AreaResponseDto } from './dto/response-area.dto';
import { Message } from '../common/message.enum';
import { ErrorException } from '../common/filters/error.exception';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    const area = this.areaRepository.create(createAreaDto);

    try {
      const savedArea = await this.areaRepository.save(area);
      return generateSingleDataResponse(
        plainToClass(AreaResponseDto, savedArea),
        201,
        Message.CREATED,
      );
    } catch (e) {
      if (e.message.includes('duplicate key')) {
        throw new ErrorException(
          `area ${Message.DATA_EXIST}`,
          HttpStatus.CONFLICT,
          'area_id already taken please use different id',
        );
      }
    }
  }

  async findAll(queryParams: QueryParamsDto) {
    const where: any = {};
    if (queryParams.trap_node_id) {
      where.trap_node_id = queryParams.trap_node_id;
    }

    if (queryParams.search) {
      where.name = ILike(`%${queryParams.search}%`);
    }

    const [data, totalData] = await this.areaRepository.findAndCount({
      where,
      order: {
        [queryParams.sort_by]: queryParams.dir.toUpperCase(),
      },
      take: queryParams.limit,
      skip: (queryParams.page - 1) * queryParams.limit,
    });

    const dataResponse: AreaResponseDto[] = data.map((areaEntity) =>
      plainToClass(AreaResponseDto, areaEntity),
    );

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async findOne(id: number) {
    const area = await this.areaRepository.findOneBy({ id: id });
    if (!area) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'area not found');
    }

    return generateSingleDataResponse(
      plainToClass(AreaResponseDto, area),
      200,
      Message.SUCCESS,
    );
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    try {
      await this.areaRepository.update(id, updateAreaDto);
    } catch (e) {
      if (e.message.includes('duplicate key')) {
        throw new ErrorException(
          `area ${Message.DATA_EXIST}`,
          HttpStatus.CONFLICT,
          'area_id already taken please use different id',
        );
      }
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.areaRepository.delete(id);
    if (result.affected === 0) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'area not found');
    }

    return generateSingleDataResponse(null, 204, Message.NO_CONTENT);
  }
}
