import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsUnique } from '../../common/validators/is-unique';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @IsUnique({ tableName: 'roles', column: 'name' })
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsArray()
  policies: Policy[];
}

class Policy {
  @IsInt()
  sub_feature_id: number;

  @IsBoolean()
  status: boolean;
}
