import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { json2csv } from 'json-2-csv';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/report/csv')
  @Header('Content-Disposition', 'attachment; filename="file.csv"')
  getCsv(): string {
    const csv_data = json2csv([{ name: 'name', email: 'ok@eamil.com' }]);
    return csv_data;
  }
}
