import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { BulkUpdateTaskSchedulerDto } from './dto/bulk-update-task-scheduler.dto';
import { QoS } from 'mqtt-packet';
import { SwitchLampDto } from './dto/switch-lamp.dto';
import { ManualTriggerDto } from './dto/manual-trigger.dto';

@Controller('task-scheduler')
export class TaskSchedulerController {
  constructor(private readonly taskSchedulerService: TaskSchedulerService) {}

  @Get()
  findAll() {
    return this.taskSchedulerService.findAll();
  }

  @Put()
  update(@Body() param: BulkUpdateTaskSchedulerDto) {
    return this.taskSchedulerService.update(param);
  }

  @Post('switch-lamp')
  @HttpCode(HttpStatus.OK)
  switchLamp(@Body() param: SwitchLampDto) {
    return this.taskSchedulerService.switchLamp(param);
  }

  @Post('manual')
  @HttpCode(HttpStatus.OK)
  manualTrigger(@Body() param: ManualTriggerDto) {
    return this.taskSchedulerService.manualTrigger(param);
  }

  @Get('manual/:id')
  @HttpCode(HttpStatus.OK)
  manualTriggerCheck(@Param('id') id: string) {
    return this.taskSchedulerService.manualTriggerCheck(+id);
  }

  @Post('publish')
  @HttpCode(HttpStatus.OK)
  publishMessage(
    @Body() body: { topic: string; message: string; qos: QoS; retain: boolean },
  ) {
    const { topic, message, qos, retain } = body;
    const message_string = JSON.stringify(message);
    this.taskSchedulerService.publish(topic, message_string, qos, retain);
    return { code: 200, message: `Message sent to ${topic}` };
  }
}
