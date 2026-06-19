import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { InsectImagesService } from './insect-images.service';
import { CreateInsectImageDto } from './dto/create-insect-image.dto';
import { UpdateInsectImageDto } from './dto/update-insect-image.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';

@Controller('insect-images')
export class InsectImagesController {
  constructor(private readonly insectImagesService: InsectImagesService) {}

  @Post()
  create(@Body() createInsectImageDto: CreateInsectImageDto) {
    return this.insectImagesService.create(createInsectImageDto);
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.insectImagesService.findAll(query);
  }

  @Get('/all')
  detailAll(@Query() query: QueryParamsDto) {
    return this.insectImagesService.findAllNoPagination(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insectImagesService.findOne(+id);
  }

  @Put()
  update(@Body() updateInsectImageDto: UpdateInsectImageDto) {
    return this.insectImagesService.update(updateInsectImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insectImagesService.remove(+id);
  }
}
