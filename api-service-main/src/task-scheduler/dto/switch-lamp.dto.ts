import { IsNotEmpty, IsIn, IsString, IsNumber } from 'class-validator';
import { IsExist } from '../../common/validators/is-exist';

export class SwitchLampDto {
  @IsNotEmpty()
  @IsNumber()
  @IsExist({ tableName: 'trap_nodes', column: 'id' })
  trap_node_id: number;

  @IsNotEmpty()
  @IsString({ message: 'status must be a string' })
  @IsIn(['on', 'off'], {
    message: 'status must be on or off',
  })
  status: string;
}
