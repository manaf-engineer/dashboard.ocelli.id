import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { generateSingleDataResponse } from '../common/utils/general-response';
import { plainToClass } from 'class-transformer';
import { Message } from '../common/message.enum';
import { ErrorException } from '../common/filters/error.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../database/entities/device.entity';
import { ResponseDeviceDto } from './dto/response-device.dto';
import { AreaResponseDto } from "../areas/dto/response-area.dto";

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepostiory: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const device = this.deviceRepostiory.create(createDeviceDto);

    try {
      const savedArea = await this.deviceRepostiory.save(device);
      return generateSingleDataResponse(
        plainToClass(ResponseDeviceDto, savedArea),
        201,
        Message.CREATED,
      );
    } catch (e) {
      if (e.message.includes('duplicate key')) {
        throw new ErrorException(
          `device ${Message.DATA_EXIST}`,
          HttpStatus.CONFLICT,
          'trap_id already taken please use different id',
        );
      }
    }
  }

  async findAll() {
    const data = await this.deviceRepostiory.find();
    return generateSingleDataResponse(data);
  }

  async findOne(id: number) {
    const device = await this.deviceRepostiory.findOneBy({ id: id });
    if (!device) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'device not found');
    }

    return generateSingleDataResponse(device);
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    try {
      await this.deviceRepostiory.update(id, updateDeviceDto);
    } catch (e) {
      if (e.message.includes('duplicate key')) {
        throw new ErrorException(
          `device ${Message.DATA_EXIST}`,
          HttpStatus.CONFLICT,
          'trap_id already taken please use different id',
        );
      }
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.deviceRepostiory.delete(id);
    if (result.affected === 0) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'device not found');
    }

    return generateSingleDataResponse(null, 204, Message.NO_CONTENT);
  }
}
