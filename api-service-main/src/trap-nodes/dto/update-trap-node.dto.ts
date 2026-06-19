import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { IsExist } from '../../common/validators/is-exist';
import { Column } from "typeorm";

export class UpdateTrapNodeDto {
  @IsString()
  @IsOptional()
  readonly trap_id?: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly latitude?: string;

  @IsString()
  @IsOptional()
  readonly longitude?: string;

  @IsBoolean()
  @IsOptional()
  readonly status?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsExist({ tableName: 'areas', column: 'id' })
  readonly area_id?: number;

  @IsString()
  @IsOptional()
  lamp_status?: string;

  @IsNumber()
  @IsOptional()
  signal?: number;

  @IsNumber()
  @IsOptional()
  battery_level?: number;

  @IsString()
  @IsOptional()
  battery_status?: string;

  @IsBoolean()
  @IsOptional()
  connection?: boolean;

  @IsNumber()
  @IsOptional()
  readonly updated_by?: number;
}
