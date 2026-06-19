import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPositive,
  IsArray,
} from 'class-validator';
import { IsExist } from '../../common/validators/is-exist';
import { IsBase64Image } from '../../common/validators/is-base64';

export class CreateInsectImageDto {
  @IsNotEmpty()
  @IsPositive()
  @IsExist({ tableName: 'insects', column: 'id' })
  insect_id: number;

  @IsArray()
  insect_images: InsectImageCreateDto[];
}

class InsectImageCreateDto {
  @IsNotEmpty()
  @IsString()
  @IsBase64Image({ message: 'image must be valid base64 image' })
  image: string;

  @IsArray()
  @IsOptional()
  tag_names?: string[];
}
