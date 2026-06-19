import { Injectable } from '@nestjs/common';
import { CreateCaptureResultDto } from './dto/create-capture-result.dto';
import { UpdateCaptureResultDto } from './dto/update-capture-result.dto';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CaptureResult } from '../database/entities/capture-result.entity';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { plainToClass } from 'class-transformer';
import { CaptureResultResponseDto } from './dto/response-capture-result.dto';
import { EnvironmentDetail } from '../database/entities/environment-detail.entity';
import { ConfigService } from '@nestjs/config';
import { Message } from '../common/message.enum';
import { ErrorException } from '../common/filters/error.exception';
import { formatDateInTimezone } from '../common/utils/date-to-string';
import { json2csv } from 'json-2-csv';
import { transformImageToPublicUrl } from '../common/utils/file-to-public-url';
import * as moment from 'moment-timezone';

@Injectable()
export class CaptureResultsService {
  constructor(
    @InjectRepository(CaptureResult)
    private readonly captureResultRepository: Repository<CaptureResult>,
    @InjectRepository(EnvironmentDetail)
    private readonly environmentDetailRepository: Repository<EnvironmentDetail>,
    private readonly configService: ConfigService,
  ) {}

  create(createCaptureResultDto: CreateCaptureResultDto) {
    return 'This action adds a new captureResult';
  }

  async findAll(queryParams: QueryParamsDto) {
    const where: any = {};
    if (queryParams.trap_node_id) {
      where.trap_node_id = queryParams.trap_node_id;
    }

    // Add start_date and end_date conditions if provided
    if (queryParams.start_date && queryParams.end_date) {
      where.collection_time = Between(
        moment.tz(queryParams.start_date, this.configService.get('timezone')).format(),
        moment.tz(queryParams.end_date, this.configService.get('timezone')).format(),
      );
    } else if (queryParams.start_date) {
      where.collection_time = MoreThanOrEqual(moment.tz(queryParams.start_date, this.configService.get('timezone')).format());
    } else if (queryParams.end_date) {
      where.collection_time = LessThanOrEqual(moment.tz(queryParams.end_date, this.configService.get('timezone')).format());
    }

    const [data, totalData] = await this.captureResultRepository.findAndCount({
      where,
      order: {
        [queryParams.sort_by]: queryParams.dir.toUpperCase(),
      },
      take: queryParams.limit,
      skip: (queryParams.page - 1) * queryParams.limit,
    });

    // Sample plain object (from database or API response)
    const dataResponse: CaptureResultResponseDto[] = data.map(
      (captureResultEntity) => {
        const responseDto = plainToClass(
          CaptureResultResponseDto,
          captureResultEntity,
        );
        responseDto.image = `${this.configService.get<string>(
          'minioPublicUrl',
        )}/${this.configService.get<string>('minioBucketName')}/${
          captureResultEntity.image
        }`;

        return responseDto;
      },
    );

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async findOne(id: number) {
    const captureResult = await this.captureResultRepository.findOneBy({
      id: id,
    });

    if (!captureResult) {
      throw new ErrorException(
        Message.NOT_FOUND,
        404,
        'capture result not found',
      );
    }

    // Retrieve the latest environment detail for the corresponding trap_node_id
    const latestEnvironmentDetail = await this.environmentDetailRepository
      .createQueryBuilder('environmentDetail')
      .where('environmentDetail.trap_node_id = :trapNodeId', {
        trapNodeId: captureResult.trap_node_id,
      })
      .andWhere('environmentDetail.collection_time < :collectionTime', {
        collectionTime: captureResult.collection_time,
      })
      .orderBy('environmentDetail.collection_time', 'DESC')
      .getOne();

    // Create a plain object for DTO transformation
    const responseObject = {
      id: captureResult.id,
      wind_speed: latestEnvironmentDetail?.wind_speed,
      light_intensity: latestEnvironmentDetail?.light_intensity,
      temperature: latestEnvironmentDetail?.temperature,
      humidity: latestEnvironmentDetail?.humidity,
      collection_time: captureResult.collection_time,
      image: captureResult.image,
    };

    // Transform plain object to DTO
    const responseDto = plainToClass(CaptureResultResponseDto, responseObject);
    responseDto.image = `${this.configService.get<string>(
      'minioPublicUrl',
    )}/${this.configService.get<string>('minioBucketName')}/${
      captureResult.image
    }`;
    return generateSingleDataResponse(responseDto);
  }

  update(id: number, updateCaptureResultDto: UpdateCaptureResultDto) {
    return `This action updates a #${id} captureResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} captureResult`;
  }

  async getReportQueryBuilder(queryParams: QueryParamsDto) {
    const { start_date, end_date, area_ids, trap_node_ids } = queryParams;

    const queryBuilder = this.captureResultRepository
      .createQueryBuilder('cr')
      .select([
        'cr.collection_time AS collection_time',
        'tn.name AS name_trap_nodes',
        'tn.trap_id as id_trap_nodes',
        'tn.latitude AS latitude',
        'tn.longitude AS longitude',
        'ar.name AS name_areas',
        'ar.province AS province_areas',
        'ar.regency AS regency_areas',
        'ar.subdistrict AS subdistrict_areas',
        'cr.image AS image',
      ])
      .innerJoin('cr.trap_node', 'tn') // Assuming relationships are defined in your entities
      .innerJoin('tn.area', 'ar'); // Assuming relationships are defined in your entities

    // Add date range filter if provided
    if (start_date && end_date) {
      queryBuilder.where(
        `cr.collection_time AT TIME ZONE '${this.configService.get(
          'timezone',
        )}' BETWEEN :start_date AND :end_date`,
        {
          start_date: `${start_date}T00:00:00+07:00`,
          end_date: `${end_date}T00:00:00+07:00`,
        },
      );
    }

    // Add area IDs filter if provided
    if (area_ids && area_ids.length > 0) {
      queryBuilder.andWhere('ar.id IN (:...area_ids)', { area_ids });
    }

    // Add trap node IDs filter if provided
    if (trap_node_ids && trap_node_ids.length > 0) {
      queryBuilder.andWhere('tn.id IN (:...trap_node_ids)', { trap_node_ids });
    }

    return queryBuilder;
  }

  async report(queryParams: QueryParamsDto) {
    console.log('masuk sini');

    // Get Data
    const { page, limit, dir } = queryParams;
    const queryBuilderData = await this.getReportQueryBuilder(queryParams);
    queryBuilderData.offset((page - 1) * limit).limit(limit);
    if (queryParams.sort_by == 'created_at') {
      queryParams.sort_by = 'collection_time';
    }
    if (dir.toUpperCase() === 'DESC') {
      queryBuilderData.orderBy(queryParams.sort_by, 'DESC');
    } else {
      queryBuilderData.orderBy(queryParams.sort_by, 'ASC');
    }

    const data = await queryBuilderData.getRawMany();

    // Get Count
    const queryBuilderCount = await this.getReportQueryBuilder(queryParams);
    const totalData = await queryBuilderCount.getCount();

    // Format the data as required
    const dataResponse = data.map((item) => ({
      collection_time: formatDateInTimezone(item.collection_time),
      name_trap_nodes: item.name_trap_nodes,
      id_trap_nodes: item.id_trap_nodes,
      latitude: item.latitude,
      longitude: item.longitude,
      name_areas: item.name_areas,
      province_areas: item.province_areas,
      regency_areas: item.regency_areas,
      subdistrict_areas: item.subdistrict_areas,
      image: transformImageToPublicUrl(item.image),
    }));

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async reportDownload(queryParams: QueryParamsDto) {
    const queryBuilderData = await this.getReportQueryBuilder(queryParams);
    const data = await queryBuilderData.getRawMany();
    const dataResponse = data.map((item) => ({
      collection_time: formatDateInTimezone(item.collection_time),
      name_trap_nodes: item.name_trap_nodes,
      id_trap_nodes: item.id_trap_nodes,
      latitude: item.latitude,
      longitude: item.longitude,
      name_areas: item.name_areas,
      province_areas: item.province_areas,
      regency_areas: item.regency_areas,
      subdistrict_areas: item.subdistrict_areas,
      image: transformImageToPublicUrl(item.image),
    }));

    return json2csv(dataResponse);
  }

  async reportDownloadZip(queryParams: QueryParamsDto) {
    const queryBuilderData = await this.getReportQueryBuilder(queryParams);
    return await queryBuilderData.getRawMany();
  }
}
