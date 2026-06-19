import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrapNodeDto } from './dto/create-trap-node.dto';
import { UpdateTrapNodeDto } from './dto/update-trap-node.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import {
  Between,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { TrapNode } from '../database/entities/trap-node.entity';
import { ResponseTrapNodeDto } from './dto/response-trap-node.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { AreaResponseDto } from '../areas/dto/response-area.dto';
import { Message } from '../common/message.enum';
import { ErrorException } from '../common/filters/error.exception';
import { MinioService } from '../minio/minio.services';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

@Injectable()
export class TrapNodesService {
  constructor(
    @InjectRepository(TrapNode)
    private readonly trapNodeRepository: Repository<TrapNode>,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async create(createTrapNodeDto: CreateTrapNodeDto): Promise<any> {
    const trapNode = this.trapNodeRepository.create(createTrapNodeDto);

    // Check if the trap_id is not used
    if (createTrapNodeDto.status !== false) {
      const existTrapNode = await this.trapNodeRepository.findOneBy({
        trap_id: createTrapNodeDto.trap_id,
        status: true,
      });
      if (existTrapNode) {
        throw new ErrorException(
          'device already used',
          HttpStatus.CONFLICT,
          `device with id : ${createTrapNodeDto.trap_id} already used, please use different id`,
        );
      }
    }

    const savedTrapNode = await this.trapNodeRepository.save(trapNode);

    return generateSingleDataResponse(
      plainToClass(AreaResponseDto, savedTrapNode),
      201,
      Message.CREATED,
    );
  }

  async findAll(queryParams: QueryParamsDto) {
    const where: any = {};
    if (queryParams.search) {
      where.name = ILike(`%${queryParams.search}%`);
    }

    if (queryParams.area_ids && queryParams.area_ids.length > 0) {
      where.area_id = In(queryParams.area_ids);
    }

    if (queryParams.start_date && queryParams.end_date) {
      where.last_update = Between(
        moment
          .tz(queryParams.start_date, this.configService.get('timezone'))
          .format(),
        moment
          .tz(queryParams.end_date, this.configService.get('timezone'))
          .format(),
      );
    } else if (queryParams.start_date) {
      where.last_update = MoreThanOrEqual(
        moment
          .tz(queryParams.start_date, this.configService.get('timezone'))
          .format(),
      );
    } else if (queryParams.end_date) {
      where.last_update = LessThanOrEqual(
        moment
          .tz(queryParams.end_date, this.configService.get('timezone'))
          .format(),
      );
    }

    const [data, totalData] = await this.trapNodeRepository.findAndCount({
      where,
      relations: ['area'],
      order: {
        [queryParams.sort_by]: queryParams.dir.toUpperCase(),
      },
      take: queryParams.limit,
      skip: (queryParams.page - 1) * queryParams.limit,
    });

    // Sample plain object (from database or API response)
    const dataResponse: ResponseTrapNodeDto[] = data.map((trapNodeEntity) =>
      plainToClass(ResponseTrapNodeDto, trapNodeEntity),
    );

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async findAllNoPagination(queryParams: QueryParamsDto) {
    const query = this.trapNodeRepository
      .createQueryBuilder('tn')
      .select([
        'tn.name AS name',
        'tn.latitude as latitude',
        'tn.longitude as longitude',
        'tn.trap_id AS trap_id',
        'tn.status AS status',
        'tn.connection AS connection',
        'ed.collection_time AS collection_time_latest',
        'ed.wind_speed AS wind_speed',
        'ed.humidity AS humidity',
        'ed.light_intensity AS light_intensity',
        'ed.temperature AS temperature',
        'ar.name AS name_areas',
      ])
      .innerJoin('tn.area', 'ar') // Assuming a relation exists between TrapNode and Area
      .innerJoin('tn.environment_details', 'ed') // Assuming a relation exists between TrapNode and EnvironmentDetail
      .where(
        'ed.collection_time = (SELECT MAX(ed2.collection_time) FROM environment_details ed2 WHERE ed2.trap_node_id = tn.id)',
      );

    if (queryParams.search) {
      query.andWhere('tn.name ILIKE :search', {
        search: `%${queryParams.search}%`,
      });
    }

    if (queryParams.area_id) {
      query.andWhere('ar.id = :area_id', { area_id: queryParams.area_id });
    }

    query.orderBy('collection_time_latest', 'DESC');

    const data = await query.getRawMany();
    return generateSingleDataResponse(data);
  }

  async summary() {
    // Fetch data based on the new SQL query logic
    const data = await this.trapNodeRepository
      .createQueryBuilder('tn') // Changed alias to 'tn' for trap_nodes
      .select([
        'SUM(CASE WHEN tn.status = true THEN 1 ELSE 0 END) AS status_active',
        'SUM(CASE WHEN tn.connection = true THEN 1 ELSE 0 END) AS connection_active',
        'COUNT(DISTINCT tn.trap_id) AS total_trap_node',
      ])
      .getRawOne();

    return generateSingleDataResponse({
      active_trap: parseInt(data.status_active) || 0,
      connected_trap: parseInt(data.connection_active) || 0,
      total_trap: parseInt(data.total_trap_node) || 0,
    });
  }

  async findOne(id: number) {
    const trapNode = await this.trapNodeRepository.findOne({
      where: { id: id },
      relations: ['area'],
    });

    if (!trapNode) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'trap node not found');
    }

    return generateSingleDataResponse(
      plainToInstance(ResponseTrapNodeDto, trapNode),
    );
  }

  async update(id: number, updateTrapNodeDto: UpdateTrapNodeDto) {
    // Make all indicator unknown / null when status off
    if (updateTrapNodeDto.status === false) {
      updateTrapNodeDto = {
        ...updateTrapNodeDto,
        battery_status: 'unknown',
        battery_level: 0,
        signal: 0,
        lamp_status: 'unknown',
      };
    }

    // Check if trap_id is changed
    const trapNodeDB = await this.trapNodeRepository.findOneBy({ id: id });
    if (updateTrapNodeDto.status !== false) {
      const trapNodeExist = await this.trapNodeRepository.findOne({
        where: {
          trap_id: updateTrapNodeDto.trap_id,
          status: true,
          id: Not(id),
        },
      });

      if (trapNodeExist) {
        throw new ErrorException(
          'device already used',
          HttpStatus.CONFLICT,
          `device with id : ${updateTrapNodeDto.trap_id} already used, please use different id`,
        );
      }
    }

    await this.trapNodeRepository.update(id, updateTrapNodeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const trapNode = await this.trapNodeRepository.findOneBy({ id: id });

    // delete all image on minio.
    await this.minioService.deleteFolder(`capture_result/${trapNode.trap_id}`);

    const result = await this.trapNodeRepository.delete(id);
    if (result.affected === 0) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'trap node not found');
    }

    return generateSingleDataResponse(null, 204, Message.NO_CONTENT);
  }
}
