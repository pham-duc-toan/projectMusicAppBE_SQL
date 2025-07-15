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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import aqp from 'api-query-params';

@ApiTags('Recommended Songs')
@Controller('song-for-you')
export class SongForYouController {
  constructor(private readonly songForYouService: SongForYouService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài hát đề xuất (admin)' })
  @ApiResponse({ status: 200, description: 'Danh sách bài hát đề xuất' })
  async getRecommendedSongs() {
    return this.songForYouService.getRecommendedSongs();
  }

  @Get('client')
  @ApiOperation({
    summary: 'Lấy danh sách bài hát đề xuất cho client (chỉ bài active)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Giới hạn số bài hát',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Bỏ qua số lượng bài hát',
  })
  @ApiResponse({ status: 200, description: 'Danh sách bài hát cho client' })
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

  @Get('ids')
  @ApiOperation({ summary: 'Lấy danh sách ID bài hát đề xuất (dạng mảng ID)' })
  @ApiResponse({ status: 200, description: 'Danh sách ID bài hát' })
  async getSongs() {
    return this.songForYouService.getSongs();
  }

  @Post(':songId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm bài hát vào danh sách đề xuất' })
  @ApiParam({ name: 'songId', description: 'ID của bài hát cần thêm' })
  @ApiResponse({ status: 200, description: 'Thêm bài hát thành công' })
  async addSongToList(@Param('songId') songId: string) {
    if (!songId) throw new BadRequestException('Thiếu songId');
    return this.songForYouService.addSongToList(songId);
  }

  @Delete(':songId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài hát khỏi danh sách đề xuất' })
  @ApiParam({ name: 'songId', description: 'ID của bài hát cần xóa' })
  @ApiResponse({ status: 200, description: 'Xóa bài hát thành công' })
  async removeSongFromList(@Param('songId') songId: string) {
    if (!songId) throw new BadRequestException('Thiếu songId');
    return this.songForYouService.removeSongFromList(songId);
  }

  @Patch('order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thứ tự danh sách bài hát đề xuất' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        listSong: {
          type: 'array',
          items: { type: 'string' },
          example: ['songId1', 'songId2', 'songId3'],
        },
      },
      required: ['listSong'],
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thứ tự thành công' })
  async updateSongList(@Body() body: { listSong: string[] }) {
    if (!Array.isArray(body.listSong)) {
      throw new BadRequestException('listSong phải là một mảng ID hợp lệ');
    }
    return this.songForYouService.updateSongs(body.listSong);
  }
}
