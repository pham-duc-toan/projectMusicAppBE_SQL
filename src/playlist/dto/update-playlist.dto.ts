import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePlaylistDto } from './create-playlist.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlaylistDto extends OmitType(
  PartialType(CreatePlaylistDto),
  ['userId'] as const,
) {
  @ApiPropertyOptional({
    example: ['song_001', 'song_002'],
    description:
      'Danh sách ID bài hát cập nhật cho playlist. Nếu không có thì giữ nguyên.',
  })
  listSong?: string[];
}
