import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { IsExist } from '../../common/validators/is-exist';

export class CreateTrapNodeDto {
  @IsNotEmpty()
  @IsString()
  trap_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean = true;

  @IsNotEmpty()
  @IsNumber()
  @IsExist({ tableName: 'areas', column: 'id' })
  area_id?: number;

  @IsNumber()
  @IsOptional()
  created_by?: number;
}
