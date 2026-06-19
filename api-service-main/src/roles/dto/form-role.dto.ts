import { Exclude } from 'class-transformer';

export class RoleFormResponseDto {
  id: number;
  name: string;
  description: string;
  sub_features?: SubFeatureResponseDto[];
  @Exclude()
  created_by: number;
  @Exclude()
  created_at: string;
  @Exclude()
  updated_by: number;
  @Exclude()
  updated_at: string;
}

export class SubFeatureResponseDto {
  id: number;
  name: string;
  description: string;
  features_id: number;
  url: string;
  method: string;
  @Exclude()
  created_by: number;
  @Exclude()
  created_at: string;
  @Exclude()
  updated_by: number;
  @Exclude()
  updated_at: string;
}
