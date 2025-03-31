import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { SongForYouService } from './song-for-you.service';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import aqp from 'api-query-params';

@Controller('song-for-you')
export class SongForYouController {
  constructor(private readonly songForYouService: SongForYouService) {}

  // Lấy danh sách bài hát đề xuất (admin)
  @Get()
  async getRecommendedSongs() {
    return this.songForYouService.getRecommendedSongs();
  }

  // Lấy danh sách bài hát đề xuất cho client (lọc active, limit)
  @Get('client')
  async getClientRecommendedSongs(@Query() query: any) {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    const filter = e.filter;

    return this.songForYouService.getClientRecommendSong({
      filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  // Lấy danh sách bài hát đề xuất dạng ID (không populate)
  @Get('songId')
  async getSongs() {
    return this.songForYouService.getSongs();
  }

  // Thêm bài hát vào danh sách đề xuất
  @UseGuards(JwtAuthGuard)
  @Post('add/:songId')
  async addSongToList(@Param('songId') songId: string) {
    if (!songId) throw new BadRequestException('Thiếu songId');
    return this.songForYouService.addSongToList(songId);
  }

  // Xoá bài hát khỏi danh sách đề xuất
  @UseGuards(JwtAuthGuard)
  @Delete('remove/:songId')
  async removeSongFromList(@Param('songId') songId: string) {
    if (!songId) throw new BadRequestException('Thiếu songId');
    return this.songForYouService.removeSongFromList(songId);
  }

  // Cập nhật thứ tự danh sách bài hát
  @UseGuards(JwtAuthGuard)
  @Patch('update-order')
  async updateSongList(@Body() body: { listSong: string[] }) {
    if (!Array.isArray(body.listSong)) {
      throw new BadRequestException('listSong phải là một mảng ID hợp lệ');
    }

    return this.songForYouService.updateSongs(body.listSong);
  }
}
