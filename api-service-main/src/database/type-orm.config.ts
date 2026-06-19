import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { config } from 'dotenv';
import { Feature } from './entities/feature.entity';
import { SubFeature } from './entities/sub-feature.entity';
import { Policy } from './entities/policy.entity';
import { Role } from './entities/role.entity';
import { Casbin } from './entities/casbin.entity';
import { TaskScheduler } from './entities/task-scheduler.entity';
import { TaskSchedulerMessage } from './entities/task-scheduler-message.entity';
import { CreateRoles1705019791844 } from './migrations/1705019791844-CreateRoles';
import { CreateUsers1705020220540 } from './migrations/1705020220540-CreateUsers';
import { CreateFeatures1705020232724 } from './migrations/1705020232724-CreateFeatures';
import { CreateSubFeatures1705020244611 } from './migrations/1705020244611-CreateSubFeatures';
import { CreatePolicies1705020253897 } from './migrations/1705020253897-CreatePolicies';
import { CreateTaskScheduler1705026765862 } from './migrations/1705026765862-CreateTaskScheduler';
import { CreateTaskSchedulerMessage1705027162463 } from './migrations/1705027162463-CreateTaskSchedulerMessage';
import { CreateInsects1726716116006 } from './migrations/1726716116006-CreateInsects';
import { CreateInsectImages1726716169885 } from './migrations/1726716169885-CreateInsectImages';
import { CreateAreas1726716180322 } from './migrations/1726716180322-CreateAreas';
import { CreateTrapNodes1726716198483 } from './migrations/1726716198483-CreateTrapNodes';
import { CreateEnvironmentDetails1726716297432 } from './migrations/1726716297432-CreateEnvironmentDetails';
import { CreateCaptureResults1726716403496 } from './migrations/1726716403496-CreateCaptureResults';
import { AddSensorsColumnToTrapNode1727048650049 } from './migrations/1727048650049-AddSensorsColumnToTrapNode';
import { AddMessageIdToCaptureResult1727063371854 } from './migrations/1727063371854-AddMessageIdToCaptureResult';
import { CreateImageTagsTable1727233045036 } from './migrations/1727233045036-CreateImageTagsTable';
import { AddPhotoToUsers1727841176874 } from './migrations/1727841176874-AddPhotoToUsers';
import { AddLampStatusToTrapNode1728530030596 } from './migrations/1728530030596-AddLampStatusToTrapNode';
import { CreateManualTasks1728541696220 } from './migrations/1728541696220-CreateManualTasks';
import { ManualTask } from './entities/manual-tasks.entity';
import { AddMessageIdOnTaskMessage1728609026537 } from './migrations/1728609026537-AddMessageIdOnTaskMessage';
import { CreateEndpoints1728858572586 } from './migrations/1728858572586-CreateEndpoints';
import { Endpoint } from './entities/endpoint.entity';
import { AddSignalToNodeTrap1729579276783 } from './migrations/1729579276783-AddSignalToNodeTrap';
import { CreateDevices1732510083012 } from './migrations/1732510083012-CreateDevices';
import { Device } from './entities/device.entity';
import { AddRoleToInsect1732779815953 } from './migrations/1732779815953-AddRoleToInsect';

config();

export const dbdatasource: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [
    User,
    Feature,
    SubFeature,
    Policy,
    Role,
    Casbin,
    ManualTask,
    TaskScheduler,
    TaskSchedulerMessage,
    Endpoint,
    Device,
  ],
  migrations: [
    CreateRoles1705019791844,
    CreateUsers1705020220540,
    CreateFeatures1705020232724,
    CreateSubFeatures1705020244611,
    CreatePolicies1705020253897,
    CreateTaskScheduler1705026765862,
    CreateTaskSchedulerMessage1705027162463,
    CreateInsects1726716116006,
    CreateInsectImages1726716169885,
    CreateAreas1726716180322,
    CreateTrapNodes1726716198483,
    CreateEnvironmentDetails1726716297432,
    CreateCaptureResults1726716403496,
    AddSensorsColumnToTrapNode1727048650049,
    AddMessageIdToCaptureResult1727063371854,
    CreateImageTagsTable1727233045036,
    AddPhotoToUsers1727841176874,
    AddLampStatusToTrapNode1728530030596,
    CreateManualTasks1728541696220,
    AddMessageIdOnTaskMessage1728609026537,
    CreateEndpoints1728858572586,
    AddSignalToNodeTrap1729579276783,
    CreateDevices1732510083012,
    AddRoleToInsect1732779815953,
  ],
};

const dataSource = new DataSource(dbdatasource);
export default dataSource;
