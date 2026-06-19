import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Header,
  Res,
} from '@nestjs/common';
import { CaptureResultsService } from './capture-results.service';
import { CreateCaptureResultDto } from './dto/create-capture-result.dto';
import { UpdateCaptureResultDto } from './dto/update-capture-result.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import * as archiver from 'archiver';
import { Response } from 'express';
import { MinioService } from '../minio/minio.services';
import * as moment from 'moment-timezone';
import { ConfigService } from '@nestjs/config';
import { formatDateInTimezone } from '../common/utils/date-to-string';

@Controller('capture-results')
export class CaptureResultsController {
  constructor(
    private readonly captureResultsService: CaptureResultsService,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createCaptureResultDto: CreateCaptureResultDto) {
    return this.captureResultsService.create(createCaptureResultDto);
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.captureResultsService.findAll(query);
  }

  @Get('/report')
  report(@Query() query: QueryParamsDto) {
    return this.captureResultsService.report(query);
  }

  @Get('/report/download')
  async downloadZip(@Query() query: QueryParamsDto, @Res() res: Response) {
    const data = await this.captureResultsService.reportDownloadZip(query);

    // Initialize zip stream
    const zip = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    // Pipe the ZIP file stream to the response
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="report.zip"');
    zip.pipe(res);

    try {
      // Append each image to the ZIP file using Promise.all for parallel processing
      await Promise.all(
        data.map(async (item) => {
          try {
            const imageStream = await this.minioService.getImageStream(
              item.image,
            );

            // Customize file naming in the ZIP
            const fileName = item.image.split('/').pop();
            const parts = fileName.split('_');

            // Remove the date part (first part) from the filename
            const uniqueId = parts[1]; // This should be `3e2a30ddf527913bf19c` in your example

            // Format the collection_time to YYYYMMDD_HHMMSS
            const formattedDate = formatDateInTimezone(item.collection_time);

            const dateTime = formattedDate.split('T');
            const date = dateTime[0].replace(/-/g, ''); // Remove dashes from date
            const time = dateTime[1].split('+')[0].replace(/:/g, ''); // Remove colons from time

            // Step 2: Combine them into the desired format
            const formattedString = `${date}_${time}`;

            // Combine everything into the desired filename format
            const fullName = `${item.id_trap_nodes}_${formattedString}_${uniqueId}`; // Adjust this based on your naming convention
            zip.append(imageStream, { name: fullName });
          } catch (error) {
            throw new Error(`Error processing image : ${error.message}`);
          }
        }),
      );

      // Finalize ZIP archive after all files are appended
      await zip.finalize();
    } catch (error) {
      console.error(error);
      throw new Error('Error creating ZIP file');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.captureResultsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCaptureResultDto: UpdateCaptureResultDto,
  ) {
    return this.captureResultsService.update(+id, updateCaptureResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.captureResultsService.remove(+id);
  }
}
