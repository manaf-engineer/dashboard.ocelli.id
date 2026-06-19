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
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  findAll(
    @Query() query: QueryParamsDto,
  ) {
    return this.areasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
