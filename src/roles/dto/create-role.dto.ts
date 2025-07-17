import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'Tên của vai trò (role) cần tạo.',
  })
  @IsNotEmpty({ message: 'Thiếu roleName' })
  @IsString()
  readonly roleName: string;

  @ApiPropertyOptional({
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    description:
      'Danh sách UUID v4 của các quyền (permissions) được gán cho vai trò.',
  })
  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true }) // mỗi phần tử là UUID v4
  readonly permissions?: string[];

  @ApiPropertyOptional({
    example: false,
    description:
      'Cờ đánh dấu vai trò đã bị xoá hay chưa. Mặc định là false nếu không có.',
  })
  @IsBoolean()
  @IsOptional()
  readonly deleted?: boolean;

  @ApiPropertyOptional({
    example: null,
    description:
      'Thời điểm vai trò bị xoá (nếu có). Dạng ISO string hoặc null.',
  })
  @IsOptional()
  readonly deletedAt?: Date | null;
}
