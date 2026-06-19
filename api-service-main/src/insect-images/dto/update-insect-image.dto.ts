import { IsOptional, IsString, IsArray, IsPositive } from 'class-validator';
import { IsExist } from '../../common/validators/is-exist';
import { IsBase64Image } from '../../common/validators/is-base64';

export class UpdateInsectImageDto {
  @IsPositive()
  @IsExist({ tableName: 'insects', column: 'id' })
  insect_id?: number;

  @IsArray()
  insect_images: InsectImageUpdateDto[];
}

class InsectImageUpdateDto {
  @IsPositive()
  @IsExist({ tableName: 'insect_images', column: 'id' })
  id?: number;

  @IsOptional()
  @IsString()
  @IsBase64Image({ message: 'image must be valid base64 image' })
  image?: string;

  @IsArray()
  @IsOptional()
  tag_names?: string[];
}
