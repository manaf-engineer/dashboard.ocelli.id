import { plainToInstance, Transform } from 'class-transformer';
import { formatDateInTimezone } from '../../common/utils/date-to-string';
import { ResponseInsectImageDto } from '../../insect-images/dto/response-insect-image.dto';

export class InsectResponseDto {
  id: number;
  scientific_name: string;
  common_name: string;
  role: string;
  family: string;
  order: string;
  description?: string;
  created_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  created_at: Date;
  updated_by?: number;

  @Transform(({ value }) => formatDateInTimezone(value))
  updated_at?: Date;

  @Transform(({ value }) => plainToInstance(ResponseInsectImageDto, value))
  insect_images: ResponseInsectImageDto[];
}
