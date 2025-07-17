import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SongToPlayList {
  @ApiProperty({
    example: 'song_123456',
    description: 'ID của bài hát muốn thêm vào playlist.',
  })
  @IsNotEmpty()
  @IsString()
  idSong: string;
}
