import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Post,
  Query,
  Put,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { QueryParamsDto } from '../common/dtos/query-params.dto';
import { UsersService } from './users.service';

@Controller('')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  findAll(@Query() query: QueryParamsDto) {
    return this.userService.findUsers(query);
  }

  @Get('users/:id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Put('users/:id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+id, +req.userid, updateUserDto);
  }

  @Get('me')
  getMyProfile(@Request() req) {
    return this.userService.myProfile(+req.userid);
  }

  @Put('update-profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+req.userid, +req.userid, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(+id);
  }

  @Post('users')
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Get('hello')
  hello(@Request() req) {
    return this.userService.hello(req.user);
  }
}
