import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { RoleSeed } from './seeders/role.seed';
import { UserSeed } from './seeders/user.seed';
import { TaskSchedulerSeed } from './seeders/task-scheduler.seed';
import { InsectSeed } from './seeders/insect.seed';
import { AreaSeed } from './seeders/area.seed';
import { TrapNodeSeed } from './seeders/trap-node.seed';
import { EnvironmentDetailSeed } from './seeders/environment-detail.seed';
import { CaptureResultSeed } from './seeders/capture-result.seed';
import { MinioService } from '../minio/minio.services';
import { ConfigService } from '@nestjs/config';
import { TagSeed } from './seeders/tag.seed';
import { FeatureSeed } from './seeders/feature.seed';
import { SubFeatureSeed } from './seeders/sub_feature.seed';
import { PolicySeed } from './seeders/policy.seed';
import { EndpointSeed } from './seeders/endpoint.seed';
import { ExportImageSeed } from './seeders/export-image.seed';
import { DeviceAclSeed } from "./seeders/device-acl.seed";

async function runSeeder(seedType: string) {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const configService = app.get(ConfigService);
  const minioService = new MinioService(configService);

  switch (seedType) {
    case 'deviceAcl':
      await DeviceAclSeed(dataSource);
      break;

    case 'exportAcl':
      await ExportImageSeed(dataSource);
      break;

    case 'initial':
    default:
      await RoleSeed(dataSource);
      await UserSeed(dataSource);
      await TaskSchedulerSeed(dataSource);
      await TagSeed(dataSource);
      await InsectSeed(dataSource, minioService);
      await AreaSeed(dataSource);
      await TrapNodeSeed(dataSource);
      await TaskSchedulerSeed(dataSource);
      await EnvironmentDetailSeed(dataSource);
      await CaptureResultSeed(dataSource, minioService);
      await FeatureSeed(dataSource);
      await SubFeatureSeed(dataSource);
      await EndpointSeed(dataSource);
      await PolicySeed(dataSource);
      break;
  }

  await dataSource.destroy(); // Close the database connection
  await app.close();
  process.exit(0);
}

const seedType = process.argv[2] || 'initial';
runSeeder(seedType);
