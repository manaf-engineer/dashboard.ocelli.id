import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  IsIn,
  IsISO8601,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryParamsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'page must be an integer' })
  @IsPositive({ message: 'page must be positive' })
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'limit must be a positive integer' })
  @IsPositive({ message: 'limit must be a positive integer' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'search must be a string' })
  search?: string;

  @IsOptional()
  @Matches(/^(asc|desc)$/i, {
    message: 'dir must be "asc" or "desc".',
  })
  dir?: string = 'desc';

  @IsOptional()
  @IsString({ message: 'sort_by must be a string' })
  @IsIn(
    [
      'id',
      'username',
      'title',
      'name',
      'scientific_name',
      'common_name',
      'description',
      'province',
      'regency',
      'subdistrict',
      'last_update',
      'created_at',
      'updated_at',
      'collection_time',
      'area_id',
      'wind_speed',
      'light_intensity',
      'temperature',
      'humidity',
      'tempera',
      'id_trap_nodes',
      'name_areas',
    ],
    {
      message: 'invalid sort_by value',
    },
  )
  sort_by?: string = 'created_at';

  @IsOptional()
  @IsISO8601()
  start_date?: Date;

  @IsOptional()
  @IsISO8601()
  @Transform(({ value, obj }) => {
    if (value) {
      const date = new Date(value);
      date.setDate(date.getDate() + 1);
      const new_date = date.toISOString().split('T')[0];
      return new_date;
    }
    return value;
  })
  end_date?: Date;

  @IsOptional()
  @IsArray({ message: 'ids must be an array of integers' })
  @Transform(
    ({ value }) =>
      typeof value === 'string' ? value.split(',').map(Number) : value,
    { toClassOnly: true },
  )
  @IsInt({ each: true, message: 'Each id must be an integer' })
  @IsPositive({ each: true, message: 'Each id must be positive' })
  area_ids?: number[];

  @IsOptional()
  @IsArray({ message: 'ids must be an array of integers' })
  @Transform(
    ({ value }) =>
      typeof value === 'string' ? value.split(',').map(Number) : value,
    { toClassOnly: true },
  )
  @IsInt({ each: true, message: 'Each id must be an integer' })
  @IsPositive({ each: true, message: 'Each id must be positive' })
  trap_node_ids?: number[];

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'trap_node_id must be an integer' })
  @IsPositive({ message: 'trap_node_id must be positive' })
  area_id?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'trap_node_id must be an integer' })
  @IsPositive({ message: 'trap_node_id must be positive' })
  trap_node_id?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'insect_id must be an integer' })
  @IsPositive({ message: 'insect_id must be positive' })
  insect_id?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'role_id must be an integer' })
  @IsPositive({ message: 'role_id must be positive' })
  role_id?: number;
}
