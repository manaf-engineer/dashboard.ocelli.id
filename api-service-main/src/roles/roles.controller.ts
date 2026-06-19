import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  ValidationPipe,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Request() req, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(+req.userid, createRoleDto);
  }

  @Get()
  findAll(
    @Query() query: QueryParamsDto,
  ) {
    return this.rolesService.findAll(query);
  }

  @Get('/form')
  getForm() {
    return this.rolesService.getForm();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(+id);
  }
}
