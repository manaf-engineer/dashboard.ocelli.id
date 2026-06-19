import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  policies: Policy[];
}

class Policy {
  @IsInt()
  policy_id: number;

  @IsInt()
  sub_feature_id: number;

  @IsBoolean()
  status: boolean;
}
