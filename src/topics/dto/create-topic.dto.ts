import { IsString, IsBoolean, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTopicDto {
  @ApiProperty({
    example: 'Ballads',
    description: 'Tên chủ đề (topic) của bài hát.',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh đại diện (file)',
  })
  @IsString()
  avatar: any;

  @ApiPropertyOptional({
    example: 'Những bản nhạc nhẹ nhàng sâu lắng.',
    description: 'Mô tả nội dung của chủ đề.',
    default: '',
  })
  @IsOptional()
  @IsString()
  description?: string = '';

  @ApiProperty({
    example: 'active',
    description: 'Trạng thái chủ đề: active hoặc inactive.',
    enum: ['active', 'inactive'],
  })
  @IsIn(['active', 'inactive'], {
    message: 'Trạng thái phải là "active" hoặc "inactive"',
  })
  status: 'active' | 'inactive';

  @ApiPropertyOptional({
    example: false,
    description: 'Đánh dấu nếu chủ đề đã bị xoá mềm (soft delete).',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  deleted?: boolean = false;
}
