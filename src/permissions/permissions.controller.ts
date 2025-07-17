import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';
import { BaseController } from 'src/bases/base.controller';
import { UseJWTAuth } from 'src/common/decorators/authenticated';

@UseJWTAuth()
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController extends BaseController<
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto
> {
  protected service = this.permissionsService;

  constructor(private readonly permissionsService: PermissionsService) {
    super();
  }

  @Post()
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo permission thành công',
    type: Permission,
  })
  async create(@Body() dto: CreatePermissionDto): Promise<Permission> {
    return super.create(dto);
  }

  @Patch(':id')
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật permission thành công',
    type: Permission,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ): Promise<Permission> {
    return super.update(id, dto);
  }
}
