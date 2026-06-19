import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  Header,
} from '@nestjs/common';
import { EnvironmentDetailsService } from './environment-details.service';
import { CreateEnvironmentDetailDto } from './dto/create-environment-detail.dto';
import { UpdateEnvironmentDetailDto } from './dto/update-environment-detail.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';

@Controller('environment-details')
export class EnvironmentDetailsController {
  constructor(
    private readonly environmentDetailsService: EnvironmentDetailsService,
  ) {}

  @Post()
  create(@Body() createEnvironmentDetailDto: CreateEnvironmentDetailDto) {
    return this.environmentDetailsService.create(createEnvironmentDetailDto);
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.environmentDetailsService.findAll(query);
  }

  @Get('/summary')
  summary(@Query() query: QueryParamsDto) {
    return this.environmentDetailsService.summary(query);
  }

  @Get('/summary/today')
  todaySummary() {
    return this.environmentDetailsService.today_summary();
  }

  @Get('/chart')
  chart(@Query() query: QueryParamsDto) {
    return this.environmentDetailsService.chart(query);
  }

  @Get('/report')
  report(@Query() query: QueryParamsDto) {
    return this.environmentDetailsService.report(query);
  }

  @Get('/report/download')
  @Header('Content-Disposition', 'attachment; filename="report.csv"')
  reportDownload(@Query() query: QueryParamsDto) {
    return this.environmentDetailsService.reportDownload(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.environmentDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnvironmentDetailDto: UpdateEnvironmentDetailDto,
  ) {
    return this.environmentDetailsService.update(
      +id,
      updateEnvironmentDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.environmentDetailsService.remove(+id);
  }
}
