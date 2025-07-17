import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSongDto {
  @ApiProperty({
    example: 'Nắng ấm xa dần',
    description: 'Tiêu đề của bài hát.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Thiếu title' })
  title: string;

  @ApiPropertyOptional({
    example: 'Bài hát về tình yêu và chia ly.',
    description: 'Mô tả ngắn về nội dung bài hát.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Love Ballad',
    description: 'Chủ đề hoặc thể loại chính của bài hát.',
  })
  @IsNotEmpty({ message: 'Thiếu topic' })
  @IsString()
  topic: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh đại diện (file)',
  })
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Audio nhạc (file)',
  })
  @IsString()
  audio?: string;

  @ApiPropertyOptional({
    example: 'Lời bài hát sẽ được hiển thị ở đây...',
    description: 'Lời bài hát, có thể là plain text hoặc HTML.',
  })
  @IsOptional()
  @IsString()
  lyrics?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Thứ tự hiển thị của bài hát trong playlist hoặc danh sách.',
  })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({
    example: 'active',
    description: 'Trạng thái bài hát: active hoặc inactive.',
    enum: ['active', 'inactive'],
  })
  @IsNotEmpty({ message: 'Thiếu status' })
  @IsIn(['active', 'inactive'], {
    message: 'Không đúng định dạng status',
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
