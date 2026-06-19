import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInsectTagDto {
  @IsNotEmpty()
  @IsString()
  tag: string;
}
