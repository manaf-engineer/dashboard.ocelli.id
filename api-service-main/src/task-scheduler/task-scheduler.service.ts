import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BulkUpdateTaskSchedulerDto } from './dto/bulk-update-task-scheduler.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskScheduler } from '../database/entities/task-scheduler.entity';
import { TaskSchedulerMessage } from '../database/entities/task-scheduler-message.entity';
import { MqttClient, connect } from 'mqtt';
import { QoS } from 'mqtt-packet';
import { EnvironmentDetail } from '../database/entities/environment-detail.entity';
import { CaptureResult } from '../database/entities/capture-result.entity';
import { TrapNode } from '../database/entities/trap-node.entity';
import { MinioService } from '../minio/minio.services';
import * as crypto from 'crypto';
import { plainToInstance } from 'class-transformer';
import { ResponseTaskSchedulerDto } from './dto/response-task-scheduler.dto';
import { generateSingleDataResponse } from '../common/utils/general-response';
import { SwitchLampDto } from './dto/switch-lamp.dto';
import { v4 as uuidv4 } from 'uuid';
import { ManualTriggerDto } from './dto/manual-trigger.dto';
import { ManualTask } from '../database/entities/manual-tasks.entity';
import { ErrorException } from '../common/filters/error.exception';
import { Message } from '../common/message.enum';
import { ManualTaskResponseDto } from './dto/manual-task-response.dto';

@Injectable()
export class TaskSchedulerService implements OnModuleInit, OnModuleDestroy {
  private client: MqttClient;

  constructor(
    @InjectRepository(TaskScheduler)
    private readonly taskSchedulerRepository: Repository<TaskScheduler>,
    @InjectRepository(TaskSchedulerMessage)
    private readonly tsmRepository: Repository<TaskSchedulerMessage>,
    @InjectRepository(CaptureResult)
    private readonly captureResultRepository: Repository<CaptureResult>,
    @InjectRepository(EnvironmentDetail)
    private readonly environmentDetailRepository: Repository<EnvironmentDetail>,
    @InjectRepository(TrapNode)
    private readonly trapNodeRepository: Repository<TrapNode>,
    @InjectRepository(ManualTask)
    private readonly manualTaskRepository: Repository<ManualTask>,
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  async findAll() {
    const data = await this.taskSchedulerRepository.find();
    const dataResponse: ResponseTaskSchedulerDto[] = data.map((taskScheduler) =>
      plainToInstance(ResponseTaskSchedulerDto, taskScheduler),
    );

    return generateSingleDataResponse(dataResponse);
  }

  async update(param: BulkUpdateTaskSchedulerDto): Promise<any> {
    const tasks = param.tasks;

    const updatePromises = tasks.map(async (update) => {
      const task = await this.taskSchedulerRepository.findOneBy({
        id: update.id,
      });
      if (task) {
        if (update.interval !== undefined)
          task.expression = String(update.interval);

        const message = JSON.stringify({
          id: uuidv4(),
          interval: update.interval,
        });

        await this.taskSchedulerRepository.save(task);

        // broadcast schedule update
        this.publish(`schedule/${task.name}`, message, 1, true);
      }
    });

    await Promise.all(updatePromises);
    return this.findAll();
  }

  async sendHealthCheckRequest(trap_node_id: string) {
    const task_id = uuidv4();
    const message = JSON.stringify({
      id: task_id,
      interval: null,
    });

    this.publish(`schedule/healthcheck/${trap_node_id}`, message, 1, true);

    // Create manual task
    const manualTask = this.manualTaskRepository.create({
      task_id: task_id,
      type: 'healthcheck',
    });
    await this.manualTaskRepository.save(manualTask);
  }

  async manualTrigger(data: ManualTriggerDto) {
    const { trap_node_id, type } = data;
    const trapNode = await this.trapNodeRepository.findOneBy({
      id: trap_node_id,
    });

    // Make assumption that trap node is offline
    // Therefore we also send health check for each manual too
    // If the trap node online, it will be updated via health check
    trapNode.connection = false;
    trapNode.uptime = null;
    trapNode.battery_level = null;
    trapNode.battery_status = null;
    await this.trapNodeRepository.save(trapNode);

    const task_id = uuidv4();
    const message = JSON.stringify({
      id: task_id,
      interval: null,
    });

    await this.sendHealthCheckRequest(trapNode.trap_id);
    if (type != 'healthcheck') {
      this.publish(`schedule/manual/${trapNode.trap_id}`, message, 1, true);

      // Create manual task
      const manualTask = this.manualTaskRepository.create({
        task_id: task_id,
        type: 'manual',
      });
      await this.manualTaskRepository.save(manualTask);
    }

    return generateSingleDataResponse(null);
  }

  async manualTriggerCheck(id: number) {
    const trapNode = await this.manualTaskRepository.findOne({
      where: { id: id },
    });

    if (!trapNode) {
      throw new ErrorException(Message.NOT_FOUND, 404, 'manual task not found');
    }

    return generateSingleDataResponse(
      plainToInstance(ManualTaskResponseDto, trapNode),
    );
  }

  async switchLamp(data: SwitchLampDto) {
    const { trap_node_id, status } = data;
    const trapNode = await this.trapNodeRepository.findOneBy({
      id: trap_node_id,
    });

    // Make assumption that trap node is offline
    // Therefore we also send health check for each manual too
    // If the trap node online, it will be updated via health check
    trapNode.connection = false;
    trapNode.uptime = null;
    trapNode.battery_level = null;
    trapNode.battery_status = null;
    await this.trapNodeRepository.save(trapNode);

    await this.sendHealthCheckRequest(trapNode.trap_id);

    const task_id = uuidv4();
    const message = JSON.stringify({
      id: task_id,
      device_id: trapNode.trap_id,
      status: status,
    });

    this.publish(`saklar_lampu/${trapNode.trap_id}`, message, 1, true);

    // Create manual task
    const manualTask = this.manualTaskRepository.create({
      task_id: task_id,
      type: 'switch_lamp',
    });
    await this.manualTaskRepository.save(manualTask);

    return generateSingleDataResponse({ task_id: task_id, status: status });
  }

  // --- MQTT Handler ---
  onModuleInit() {
    const mqttHost = this.configService.get<string>('mqttHost');
    const mqttUser = this.configService.get<string>('mqttUser');
    const mqttPassword = this.configService.get<string>('mqttPassword');

    this.client = connect('mqtt://' + mqttHost, {
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
      clean: true,
      connectTimeout: 4000,
      username: mqttUser,
      password: mqttPassword,
      reconnectPeriod: 1000,
    });

    this.client.on('error', (error) => {
      console.log('MQTT client error:', error.message);
    });

    this.client.on('reconnect', () => {
      console.log('MQTT client reconnecting...');
    });

    this.client.on('offline', () => {
      console.log('MQTT client is offline');
    });

    this.client.on('close', () => {
      console.log('MQTT client connection closed');
    });

    this.client.on('connect', () => {
      console.log('MQTT client connected');

      this.client.subscribe('#', (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        }
      });
    });

    // Handle mqtt message
    this.client.on('message', async (topic: string, message: Buffer) => {
      const msg = message.toString();

      // Parse the message as JSON
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(msg);
      } catch (error) {
        console.error(`Failed to parse message: ${msg}`, error);
        return;
      }

      // Check if message already consumed
      const isExist = await this.tsmRepository.exist({
        where: { msg_id: parsedMessage.id },
      });
      if (isExist) {
        console.warn(`Message ${parsedMessage.id} Already Consumed`);
        return;
      }

      // Handle messages based on topic prefix
      let saveMessage = true;
      let saveMessageBody = true;
      if (topic.startsWith('data/lingkungan')) {
        await this.handleDataLingkungan(parsedMessage);
      } else if (topic.startsWith('data/foto')) {
        saveMessageBody = false;
        await this.handleDataFoto(parsedMessage);
      } else if (topic.startsWith('data')) {
        saveMessageBody = false;
        await this.handleData(parsedMessage);
      } else if (topic.startsWith('healthcheck')) {
        await this.handleHealthCheck(parsedMessage);
      } else if (topic.startsWith('saklar_lampu/reply')) {
        await this.handleLamp(parsedMessage);
      } else {
        saveMessage = false;
        console.warn(`Unhandled topic: ${topic}`);
      }

      if (saveMessage) {
        if (saveMessageBody) {
          await this.tsmRepository.save({
            topic: topic,
            msg: parsedMessage,
            msg_id: parsedMessage.id,
          });
        } else {
          await this.tsmRepository.save({
            topic: topic,
            msg_id: parsedMessage.id,
          });
        }
      }
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end(() => {
        console.log('MQTT client disconnected');
      });
    }
  }

  publish(topic: string, message: string, qos: QoS, retain: boolean) {
    this.client.publish(topic, message, { qos, retain }, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log('message published');
      }
    });
  }

  async handleData(data) {
    // Save manual task status
    const manualTask = await this.manualTaskRepository.findOneBy({
      task_id: data.id,
    });
    if (manualTask) {
      manualTask.status = 'replied';
      await this.manualTaskRepository.save(manualTask);
    }

    await this.handleDataLingkungan(data);
    await this.handleDataFoto(data);
  }

  // Functions to handle each message type
  async handleLamp(data) {
    const { device_id, status } = data; // Adjust based on your structure

    // Find the corresponding TrapNode by trap_id
    this.trapNodeRepository
      .findOne({ where: { trap_id: device_id, status: true } })
      .then((trapNode) => {
        if (!trapNode) {
          console.warn(`TrapNode with trap_id ${device_id} not found.`);
          return;
        }

        trapNode.lamp_status = status;

        // Save the updated TrapNode
        this.trapNodeRepository.save(trapNode);
      })
      .then(() => {
        console.log('TrapNode updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating TrapNode:', error);
      });
  }

  async handleDataLingkungan(data) {
    const { id, device_id, datetime, sensors } = data; // Adjust based on your structure

    const isExist = await this.environmentDetailRepository.exist({
      where: { message_id: id },
    });
    if (isExist) {
      console.warn(`Enviroment detail with message_id ${id} already exist.`);
      return;
    }

    // Create a new EnvironmentDetail instance
    const environmentDetail = new EnvironmentDetail();

    // Safely assign sensor values with default fallback
    environmentDetail.message_id = id;
    environmentDetail.wind_speed = sensors.wind_speed?.value ?? null;
    environmentDetail.light_intensity = sensors.light_intensity?.value ?? null;
    environmentDetail.temperature = sensors.temperature?.value ?? null;
    environmentDetail.humidity = sensors.humidity?.value ?? null;

    // Ensure collection_time is valid
    const collectionTime = new Date(datetime);
    const messageCollectionTime = isNaN(collectionTime.getTime())
      ? null
      : collectionTime;
    environmentDetail.collection_time = messageCollectionTime;

    // Set the trap_node_id based on your logic
    const trap_node = await this.trapNodeRepository.findOneBy({
      trap_id: device_id,
      status: true,
    });
    if (trap_node) {
      environmentDetail.trap_node_id = trap_node.id;
      this.environmentDetailRepository
        .save(environmentDetail)
        .then(() => {
          console.log(
            'Environment detail saved successfully:',
            environmentDetail,
          );
        })
        .catch((error) => {
          console.error('Error saving environment detail:', error);
        });

      trap_node.last_update = messageCollectionTime;
      this.trapNodeRepository
        .save(trap_node)
        .then(() => {
          console.log('Trap node saved successfully:');
        })
        .catch((error) => {
          console.error('Error saving trap node:', error);
        });
    }
  }

  async handleDataFoto(data) {
    const { id, device_id, datetime, image } = data; // Adjust based on your structure

    const isExist = await this.captureResultRepository.exist({
      where: { message_id: id },
    });
    if (isExist) {
      console.warn(`Capture result with message_id ${id} already exist.`);
      return;
    }

    // Create a new CaptureResult instance
    const captureResult = new CaptureResult();
    captureResult.message_id = id;
    const base64Image = image;

    // Ensure collection_time is valid
    const collectionTime: Date = new Date(datetime);
    const messageCollectionTime = isNaN(collectionTime.getTime())
      ? null
      : collectionTime;
    captureResult.collection_time = messageCollectionTime;

    // Prepare image
    const year = collectionTime.getFullYear();
    const month = String(collectionTime.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(collectionTime.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;

    const randomString = crypto.randomBytes(10).toString('hex');
    const fileExtension = 'jpeg';

    // Set the trap_node_id based on your logic
    const trap_node = await this.trapNodeRepository.findOneBy({
      trap_id: device_id,
      status: true,
    });

    if (trap_node) {
      // Save base64 image to minio
      const imageFilename = `${dateString}_${randomString}.${fileExtension}`;
      captureResult.image = `capture_result/${trap_node.id}/${imageFilename}`;
      await this.minioService.uploadBase64Image2(
        base64Image,
        captureResult.image,
      );

      captureResult.trap_node_id = trap_node.id;
      this.captureResultRepository
        .save(captureResult)
        .then(() => {
          console.log('Capture result saved successfully');
        })
        .catch((error) => {
          console.error('Error saving capture result:', error);
        });

      trap_node.last_update = messageCollectionTime;
      this.trapNodeRepository
        .save(trap_node)
        .then(() => {
          console.log('Trap node saved successfully');
        })
        .catch((error) => {
          console.error('Error saving trap node:', error);
        });
    }
  }

  async handleHealthCheck(data) {
    const {
      device_id,
      status,
      datetime,
      uptime,
      battery_status,
      battery_level,
      signal,
      sensors,
    } = data;

    // Save manual task status
    const manualTask = await this.manualTaskRepository.findOneBy({
      task_id: data.id,
    });
    if (manualTask) {
      manualTask.status = 'replied';
      await this.manualTaskRepository.save(manualTask);
    }

    // Find the corresponding TrapNode by trap_id
    this.trapNodeRepository
      .findOne({ where: { trap_id: device_id, status: true } })
      .then((trapNode) => {
        if (!trapNode) {
          console.warn(`TrapNode with trap_id ${device_id} not found.`);
          return;
        }

        // Update the status and other fields
        if (status === 'online') {
          trapNode.connection = true; // Set as true or false based on status
          trapNode.uptime = uptime; // Directly assign the integer uptime

          if (battery_status) {
            // Version 1
            trapNode.battery_level = battery_status.level;
            trapNode.battery_status = battery_status.status;
          } else if (battery_level) {
            // Version 2
            trapNode.battery_level = battery_level;
            trapNode.battery_status = 'charged';

            // Map Signal to Int
            const signalMap = {
              poor: 1,
              fair: 2,
              good: 3,
              excellent: 4,
            };

            trapNode.signal = signalMap[signal] || 0;
          }

          // Optionally update sensor statuses
          trapNode.wind_sensor_status = sensors.wind_speed;
          trapNode.light_sensor_status = sensors.light_intensity;
          trapNode.temperature_sensor_status = sensors.temperature;
          trapNode.humidity_sensor_status = sensors.humidity;

          // Ensure collection_time is valid
          const collectionTime = new Date(datetime);
          trapNode.last_update = isNaN(collectionTime.getTime())
            ? null
            : collectionTime;
        } else {
          trapNode.connection = false;
          trapNode.uptime = null;
          trapNode.battery_level = null;
          trapNode.battery_status = null;

          // Optionally update sensor statuses
          trapNode.wind_sensor_status = 'unknown';
          trapNode.light_sensor_status = 'unknown';
          trapNode.temperature_sensor_status = 'unknown';
          trapNode.humidity_sensor_status = 'unknown';
          trapNode.last_update = new Date();
        }

        // Save the updated TrapNode
        this.trapNodeRepository.save(trapNode);
      })
      .then(() => {
        console.log('TrapNode updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating TrapNode:', error);
      });
  }
}
