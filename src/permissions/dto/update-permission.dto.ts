import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const API_PREFIX = '/api/v1/';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiPropertyOptional({
    example: '/api/v1/users/update',
    description:
      'Đường dẫn API cần cập nhật quyền. Sẽ tự động thêm prefix "/api/v1/" nếu chưa có.',
  })
  @Transform(({ value }) =>
    value?.startsWith(API_PREFIX) ? value : API_PREFIX + value,
  )
  pathName: string;
}
