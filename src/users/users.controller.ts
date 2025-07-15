import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import aqp from 'api-query-params';
import { UpdateSinger } from './dto/update-singer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidatorFileTypeImage } from 'src/interceptors/ValidatorFileExist.interceptor';
import { CloudinaryFileUploadInterceptor } from 'src/interceptors/FileToLinkOnlineCloudinary.interceptor';
import { changePassword } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo user mới' })
  @ApiResponse({ status: 201, description: 'Tạo user thành công' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách user, hỗ trợ filter & phân trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng trả về' })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Bỏ qua số lượng record',
  })
  @ApiResponse({ status: 200, description: 'Danh sách user' })
  async findAll(@Query() query: any) {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    const filter = e.filter;
    return this.userService.findAll({
      filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin user hiện tại' })
  @ApiResponse({ status: 200, description: 'Thông tin user' })
  async getProfile(@Request() req): Promise<User> {
    return this.userService.profileUser(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật profile user' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @UseInterceptors(
    FileInterceptor('avatar'),
    ValidatorFileTypeImage,
    CloudinaryFileUploadInterceptor,
  )
  async updateProfile(@Request() req, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUser);
  }

  @Patch('profile/singer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gán ca sĩ cho user' })
  @ApiResponse({ status: 200, description: 'Cập nhật ca sĩ thành công' })
  async updateSinger(@Request() req, @Body() singerId: UpdateSinger) {
    return this.userService.updateSinger(req.user.id, singerId.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID của user cần đổi trạng thái' })
  @ApiOperation({ summary: 'Đổi trạng thái hoạt động của user' })
  @ApiResponse({ status: 200, description: 'Đổi trạng thái thành công' })
  async changeStatus(@Param('id') id: string): Promise<User> {
    return this.userService.updateStatus(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID của user cần xóa' })
  @ApiOperation({ summary: 'Xóa user theo ID' })
  @ApiResponse({ status: 200, description: 'Xóa user thành công' })
  async deleteOne(@Param('id') id: string) {
    return this.userService.deleteOne(id);
  }

  @Patch(':id/role/:roleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiParam({ name: 'roleId', description: 'ID của role cần gán' })
  @ApiOperation({ summary: 'Gán quyền cho user' })
  @ApiResponse({ status: 200, description: 'Gán role thành công' })
  async updateRole(
    @Param('id') idUser: string,
    @Param('roleId') idRole: string,
  ): Promise<User> {
    return this.userService.updateRole(idUser, idRole);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu user hiện tại' })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  async changePassword(@Request() req, @Body() body: changePassword) {
    return this.userService.changePassword(req.user.username, body);
  }
}
