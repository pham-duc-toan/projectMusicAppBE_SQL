import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSingerDto {
  @ApiProperty({
    example: 'Trịnh Công Sơn',
    description: 'Họ tên đầy đủ của ca sĩ.',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh đại diện (file)',
  })
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'active',
    description: 'Trạng thái của ca sĩ: active hoặc inactive.',
    enum: ['active', 'inactive'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}
