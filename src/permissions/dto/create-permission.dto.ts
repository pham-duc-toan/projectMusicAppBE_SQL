import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const API_PREFIX = '/api/v1/';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'Manage Users',
    description: 'Tên của quyền (permission) cần tạo.',
  })
  @IsNotEmpty({ message: 'Thiếu name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '/api/v1/users',
    description:
      'Đường dẫn của API cần cấp quyền. Sẽ tự động thêm prefix "/api/v1/" nếu chưa có.',
  })
  @IsNotEmpty({ message: 'Thiếu pathName' })
  @IsString()
  @Transform(({ value }) =>
    value.startsWith(API_PREFIX) ? value : API_PREFIX + value,
  )
  pathName: string;

  @ApiProperty({
    example: 'GET',
    description:
      'Phương thức HTTP áp dụng cho quyền này (GET, POST, PUT, DELETE, ...).',
  })
  @IsNotEmpty({ message: 'Thiếu method' })
  @IsString()
  method: string;
}
