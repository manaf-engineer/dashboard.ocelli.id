import { IsNotEmpty, IsIn, IsString, IsNumber } from 'class-validator';
import { IsExist } from '../../common/validators/is-exist';

export class ManualTriggerDto {
  @IsNotEmpty()
  @IsNumber()
  @IsExist({ tableName: 'trap_nodes', column: 'id' })
  trap_node_id: number;

  @IsNotEmpty()
  @IsString({ message: 'status must be a string' })
  @IsIn(['data', 'healthcheck'], {
    message: 'status must be data or healthcheck',
  })
  type: string;
}
