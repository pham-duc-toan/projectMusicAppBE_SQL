import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponeMessage } from 'src/decorator/customize';

import aqp from 'api-query-params';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { Permission } from './entities/permission.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

const API_PREFIX = '/api/v1/';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo permission mới' })
  @ApiResponse({ status: 201, description: 'Tạo permission thành công' })
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    createPermissionDto.pathName = API_PREFIX + createPermissionDto.pathName;
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách permission' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Giới hạn số lượng kết quả',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Bỏ qua số lượng kết quả',
  })
  @ApiResponse({ status: 200, description: 'Danh sách permission' })
  async findAll(@Query() query: any): Promise<Permission[]> {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    const filter = e.filter;
    return this.permissionsService.findAll({
      filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết permission theo ID' })
  @ApiParam({ name: 'id', description: 'ID của permission' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết permission' })
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật permission theo ID' })
  @ApiParam({ name: 'id', description: 'ID của permission cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    updatePermissionDto.pathName = API_PREFIX + updatePermissionDto.pathName;
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponeMessage('Xóa tất cả')
  @ApiOperation({ summary: 'Xóa toàn bộ permission' })
  @ApiResponse({ status: 200, description: 'Xóa tất cả thành công' })
  async remove(): Promise<void> {
    return this.permissionsService.remove();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponeMessage('Xóa một permission')
  @ApiOperation({ summary: 'Xóa permission theo ID' })
  @ApiParam({ name: 'id', description: 'ID của permission cần xóa' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  async removeOne(@Param('id') id: string): Promise<void> {
    return this.permissionsService.removeOne(id);
  }
}
