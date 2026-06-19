import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInsectTagDto {
  @IsNotEmpty()
  @IsString()
  tag: string;
}
