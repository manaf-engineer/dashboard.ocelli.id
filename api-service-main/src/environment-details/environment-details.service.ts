import { Injectable } from '@nestjs/common';
import { CreateEnvironmentDetailDto } from './dto/create-environment-detail.dto';
import { UpdateEnvironmentDetailDto } from './dto/update-environment-detail.dto';
import { EnvironmentDetail } from '../database/entities/environment-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  generatePaginatedResponse,
  generateSingleDataResponse,
} from '../common/utils/general-response';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { plainToClass } from 'class-transformer';
import { EnvironmentDetailResponseDto } from './dto/response-environment-detail.dto';
import { json2csv } from 'json-2-csv';
import { formatDateInTimezone } from '../common/utils/date-to-string';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

@Injectable()
export class EnvironmentDetailsService {
  constructor(
    @InjectRepository(EnvironmentDetail)
    private readonly environmentDetailRepository: Repository<EnvironmentDetail>,
    private readonly configService: ConfigService,
  ) {}

  create(createEnvironmentDetailDto: CreateEnvironmentDetailDto) {
    return 'This action adds a new environmentDetail';
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

    const [data, totalData] =
      await this.environmentDetailRepository.findAndCount({
        where,
        order: {
          [queryParams.sort_by]: queryParams.dir.toUpperCase(),
        },
        take: queryParams.limit,
        skip: (queryParams.page - 1) * queryParams.limit,
      });

    // Sample plain object (from database or API response)
    const dataResponse: EnvironmentDetailResponseDto[] = data.map(
      (environmentEntity) =>
        plainToClass(EnvironmentDetailResponseDto, environmentEntity),
    );

    return generatePaginatedResponse(
      dataResponse,
      totalData,
      queryParams.page,
      queryParams.limit,
    );
  }

  async chart(queryParams: QueryParamsDto) {
    const { start_date, end_date, trap_node_id } = queryParams;

    const query = this.environmentDetailRepository
      .createQueryBuilder('ed')
      .select([
        'tn.id AS trap_node_id',
        `TRIM(TO_CHAR(ed.collection_time AT TIME ZONE '${this.configService.get(
          'timezone',
        )}', 'YYYY-MM-DD')) AS collection_date`,
        'AVG(ed.wind_speed) AS avg_wind_speed',
        'AVG(ed.light_intensity) AS avg_light_intensity',
        'AVG(ed.temperature) AS avg_temperature',
        'AVG(ed.humidity) AS avg_humidity',
      ])
      .innerJoin('ed.trap_node', 'tn')
      .where('tn.id = :trap_node_id', { trap_node_id });

    // Add date filters only if provided
    if (start_date && end_date) {
      query.andWhere('ed.collection_time BETWEEN :start_date AND :end_date', {
        start_date: `${start_date}T00:00:00+07:00`,
        end_date: `${end_date}T00:00:00+07:00`,
      });
    }

    // Group by both trap_node_id and collection_date
    query.groupBy('tn.id, collection_date').orderBy('collection_date', 'ASC'); // Sort by collection_date in ascending order

    const data = await query.getRawMany();

    const transformedData = {
      date: [],
      temperature: [],
      wind_speed: [],
      humidity: [],
      light_intensity: [],
    };

    data.forEach((item) => {
      transformedData.date.push(item.collection_date);
      transformedData.temperature.push(
        Math.round(parseFloat(item.avg_temperature) * 100) / 100 || null,
      );
      transformedData.wind_speed.push(
        Math.round(parseFloat(item.avg_wind_speed) * 100) / 100 || null,
      );
      transformedData.humidity.push(
        Math.round(parseFloat(item.avg_humidity) * 100) / 100 || null,
      );
      transformedData.light_intensity.push(
        Math.round(parseFloat(item.avg_light_intensity) * 100) / 100 || null,
      );
    });

    return generateSingleDataResponse(transformedData);
  }

  async getReportQueryBuilder(queryParams: QueryParamsDto) {
    const { start_date, end_date, area_ids, trap_node_ids } = queryParams;

    const queryBuilder = this.environmentDetailRepository
      .createQueryBuilder('ed')
      .select([
        'ed.collection_time AS collection_time',
        'tn.name AS name_trap_nodes',
        'tn.trap_id as id_trap_nodes',
        'tn.latitude AS latitude',
        'tn.longitude AS longitude',
        'ar.name AS name_areas',
        'ar.province AS province_areas',
        'ar.regency AS regency_areas',
        'ar.subdistrict AS subdistrict_areas',
        'ed.wind_speed AS wind_speed',
        'ed.light_intensity AS light_intensity',
        'ed.temperature AS temperature',
        'ed.humidity AS humidity',
      ])
      .innerJoin('ed.trap_node', 'tn') // Assuming relationships are defined in your entities
      .innerJoin('tn.area', 'ar'); // Assuming relationships are defined in your entities

    // Add date range filter if provided
    if (start_date && end_date) {
      queryBuilder.where(
        `ed.collection_time AT TIME ZONE '${this.configService.get(
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
      wind_speed: item.wind_speed,
      light_intensity: item.light_intensity,
      temperature: item.temperature,
      humidity: item.humidity,
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
      wind_speed: item.wind_speed,
      light_intensity: item.light_intensity,
      temperature: item.temperature,
      humidity: item.humidity,
    }));
    const csv_data = json2csv(dataResponse);
    return csv_data;
  }

  async summary(queryParams: QueryParamsDto) {
    const { start_date, area_id } = queryParams;
    const startDate = new Date(start_date);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1; // Months are 0-indexed

    const query = this.environmentDetailRepository
      .createQueryBuilder('ed')
      .select([
        'ar.id AS area_id',
        'ar.name AS name_areas',
        'ar.province',
        'ar.regency',
        "TRIM(TO_CHAR(ed.collection_time, 'Month')) AS month_collection_time",
        'AVG(ed.wind_speed) AS avg_wind_speed',
        'AVG(ed.light_intensity) AS avg_light_intensity',
        'AVG(ed.temperature) AS avg_temperature',
        'AVG(ed.humidity) AS avg_humidity',
      ])
      .innerJoin('ed.trap_node', 'tn') // Adjust based on your entity relationships
      .innerJoin('tn.area', 'ar') // Adjust based on your entity relationships
      .where('EXTRACT(YEAR FROM ed.collection_time) = :year', {
        year: startYear,
      })
      .andWhere('EXTRACT(MONTH FROM ed.collection_time) = :month', {
        month: startMonth,
      });

    if (area_id) {
      query.andWhere('ar.id = :area_id', { area_id });
    }

    const data = await query
      .groupBy('ar.id, ar.name, ar.province, ar.regency, month_collection_time')
      .getRawMany();

    // Format the data as required
    return generateSingleDataResponse(
      data.map((item) => ({
        area_id: item.area_id,
        name_areas: item.name_areas,
        province: item.province,
        regency: item.regency,
        month_collection_time: item.month_collection_time,
        avg_wind_speed:
          Math.round(parseFloat(item.avg_wind_speed) * 100) / 100 || null,
        avg_light_intensity:
          Math.round(parseFloat(item.avg_light_intensity) * 100) / 100 || null,
        avg_temperature:
          Math.round(parseFloat(item.avg_temperature) * 100) / 100 || null,
        avg_humidity:
          Math.round(parseFloat(item.avg_humidity) * 100) / 100 || null,
      })),
    );
  }

  async today_summary() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format

    const data = await this.environmentDetailRepository
      .createQueryBuilder('ed')
      .select([
        'tn.name AS name_trap_nodes',
        'ar.name AS name_areas',
        'AVG(ed.wind_speed) AS avg_wind_speed',
        'AVG(ed.light_intensity) AS avg_light_intensity',
        'AVG(ed.temperature) AS avg_temperature',
        'AVG(ed.humidity) AS avg_humidity',
      ])
      .innerJoin('ed.trap_node', 'tn')
      .innerJoin('tn.area', 'ar')
      .where('DATE(ed.collection_time) = :formattedDate', { formattedDate })
      .groupBy('tn.name, ar.name')
      .getRawMany();

    // Format the data as required
    const transformedData = data.reduce(
      (acc, item) => {
        acc.area.push(item.name_areas);
        acc.temperature.push(
          Math.round(parseFloat(item.avg_temperature) * 100) / 100 || null,
        );
        acc.wind_speed.push(
          Math.round(parseFloat(item.avg_wind_speed) * 100) / 100 || null,
        );
        acc.light_intensity.push(
          Math.round(parseFloat(item.avg_light_intensity) * 100) / 100 || null,
        );
        acc.humidity.push(
          Math.round(parseFloat(item.avg_humidity) * 100) / 100 || null,
        );
        return acc;
      },
      {
        area: [],
        temperature: [],
        wind_speed: [],
        light_intensity: [],
        humidity: [],
      },
    );

    return generateSingleDataResponse(transformedData);
  }

  findOne(id: number) {
    return `This action returns a #${id} environmentDetail`;
  }

  update(id: number, updateEnvironmentDetailDto: UpdateEnvironmentDetailDto) {
    return `This action updates a #${id} environmentDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} environmentDetail`;
  }
}
