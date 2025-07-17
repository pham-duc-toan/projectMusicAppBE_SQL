import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty({
    example: 'Chill Vibes',
    description: 'Tiêu đề của playlist do người dùng đặt.',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'user_78910',
    description: 'ID của người dùng tạo playlist.',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    example: ['song_123', 'song_456'],
    description: 'Danh sách ID bài hát thêm vào playlist. Có thể để trống.',
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (value && value.length > 0 ? [] : value))
  listSong?: string[];
}
