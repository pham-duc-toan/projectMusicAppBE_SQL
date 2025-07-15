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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { Role } from './entities/role.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import aqp from 'api-query-params';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo role mới' })
  @ApiResponse({ status: 201, description: 'Tạo role thành công' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách role với filter và phân trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Giới hạn kết quả' })
  @ApiQuery({ name: 'skip', required: false, description: 'Bỏ qua kết quả' })
  @ApiResponse({ status: 200, description: 'Danh sách role' })
  async findAll(@Query() query: any): Promise<Role[]> {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    const filter = e.filter;
    return this.rolesService.findAll({
      filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get('full')
  @ApiOperation({ summary: 'Lấy danh sách đầy đủ role không phân trang' })
  @ApiResponse({ status: 200, description: 'Danh sách role đầy đủ' })
  async findFull(): Promise<Role[]> {
    return this.rolesService.findFull();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết role theo ID' })
  @ApiParam({ name: 'id', description: 'ID của role' })
  @ApiResponse({ status: 200, description: 'Chi tiết role' })
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin role theo ID' })
  @ApiParam({ name: 'id', description: 'ID của role cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa role theo ID' })
  @ApiParam({ name: 'id', description: 'ID của role cần xóa' })
  @ApiResponse({ status: 200, description: 'Xóa role thành công' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }
}
