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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InsectsService } from './insects.service';
import { CreateInsectDto } from './dto/create-insect.dto';
import { UpdateInsectDto } from './dto/update-insect.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Message } from '../common/message.enum';
import { ErrorException } from '../common/filters/error.exception';
import { extractErrorMessages } from '../common/utils/error-extractor';

@Controller('insects')
export class InsectsController {
  constructor(private readonly insectsService: InsectsService) {}

  @Post()
  create(@Body() createInsectDto: CreateInsectDto) {
    return this.insectsService.create(createInsectDto);
  }

  @Get()
  findAll(
    @Query() query: QueryParamsDto,
  ) {
    return this.insectsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insectsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInsectDto: UpdateInsectDto) {
    return this.insectsService.update(+id, updateInsectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insectsService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const fileType = file.mimetype;
        if (fileType !== 'text/csv') {
          return callback(
            new ErrorException(
              Message.BAD_REQUEST,
              400,
              `Only CSV files are allowed`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new ErrorException(Message.BAD_REQUEST, 400, `No file uploaded`);
    }

    const result = [];
    let row = 1;

    await new Promise<void>((resolve, reject) => {
      createReadStream(file.path)
        .pipe(csv())
        .on('data', async (data) => {
          // Validate data against CreateInsectDto
          const insectDto = plainToInstance(CreateInsectDto, data);
          const errors = await validate(insectDto);
          if (errors.length > 0) {
            console.log(JSON.stringify(insectDto));
            return reject(
              new ErrorException(
                Message.ERROR_VALIDATION,
                422,
                extractErrorMessages(errors, `${row}`),
              ),
            );
          }
          result.push(insectDto);
          row += 1;
        })
        .on('end', () => resolve())
        .on('error', (error) =>
          reject(
            new ErrorException(
              Message.BAD_REQUEST,
              400,
              `Error reading CSV file : ${error.message}`,
            ),
          ),
        );
    });

    return await this.insectsService.upload(result);
  }
}
