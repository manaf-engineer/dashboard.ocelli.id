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
import { TrapNodesService } from './trap-nodes.service';
import { CreateTrapNodeDto } from './dto/create-trap-node.dto';
import { UpdateTrapNodeDto } from './dto/update-trap-node.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';

@Controller('trap-nodes')
export class TrapNodesController {
  constructor(private readonly trapNodesService: TrapNodesService) {}

  @Post()
  create(@Body() createTrapNodeDto: CreateTrapNodeDto) {
    return this.trapNodesService.create(createTrapNodeDto);
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.trapNodesService.findAll(query);
  }

  @Get('/all')
  detailAll(@Query() query: QueryParamsDto) {
    return this.trapNodesService.findAllNoPagination(query);
  }

  @Get('/summary')
  summary() {
    return this.trapNodesService.summary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trapNodesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrapNodeDto: UpdateTrapNodeDto,
  ) {
    return this.trapNodesService.update(+id, updateTrapNodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trapNodesService.remove(+id);
  }
}
