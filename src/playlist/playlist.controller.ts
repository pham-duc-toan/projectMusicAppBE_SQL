import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { SongToPlayList } from './dto/add-song-to-playlist.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlayList } from './entities/playlist.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo playlist mới' })
  @ApiResponse({ status: 201, description: 'Tạo playlist thành công' })
  async create(
    @Body() createPlaylistDto: CreatePlaylistDto,
  ): Promise<PlayList> {
    if (createPlaylistDto.listSong) {
      createPlaylistDto.listSong = [];
    }
    return this.playlistService.createPlaylist(createPlaylistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả playlist' })
  @ApiResponse({ status: 200, description: 'Danh sách playlist' })
  async findAll(): Promise<PlayList[]> {
    return this.playlistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết playlist theo ID' })
  @ApiParam({ name: 'id', description: 'ID của playlist' })
  @ApiResponse({ status: 200, description: 'Thông tin playlist' })
  async findOne(@Param('id') id: string): Promise<PlayList> {
    return this.playlistService.findOne(id);
  }

  @Get('user/my-playlists')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách playlist của user hiện tại' })
  @ApiResponse({ status: 200, description: 'Danh sách playlist của user' })
  async detail(@Request() req) {
    return this.playlistService.detail(req.user.id);
  }

  @Post(':id/songs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm bài hát vào playlist' })
  @ApiParam({ name: 'id', description: 'ID của playlist' })
  @ApiBody({ type: SongToPlayList })
  @ApiResponse({ status: 200, description: 'Thêm bài hát thành công' })
  async addSong(
    @Body() idSong: SongToPlayList,
    @Param('id') idListSong: string,
    @Request() req,
  ) {
    return this.playlistService.addSong(idSong, idListSong, req.user.id);
  }

  @Delete(':id/songs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài hát khỏi playlist' })
  @ApiParam({ name: 'id', description: 'ID của playlist' })
  @ApiBody({ type: SongToPlayList })
  @ApiResponse({ status: 200, description: 'Xóa bài hát thành công' })
  async removeSong(
    @Body() idSong: SongToPlayList,
    @Param('id') idListSong: string,
    @Request() req,
  ) {
    return this.playlistService.removeSong(idSong, idListSong, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa playlist của user hiện tại' })
  @ApiParam({ name: 'id', description: 'ID của playlist' })
  @ApiResponse({ status: 200, description: 'Kết quả xóa playlist' })
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    const listPlaylist = await this.playlistService.detail(req.user.id);
    const exists = listPlaylist.some(
      (playlist) => playlist.id.toString() === id,
    );

    if (exists) {
      await this.playlistService.remove(id, req.user.id);
      return { message: `Playlist với id ${id} đã được xóa thành công` };
    } else {
      return {
        message: `Bạn không phải người tạo playlist nên không có quyền xóa`,
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật playlist của user hiện tại' })
  @ApiParam({ name: 'id', description: 'ID của playlist' })
  @ApiResponse({ status: 200, description: 'Kết quả cập nhật playlist' })
  async edit(
    @Param('id') id: string,
    @Body() body: UpdatePlaylistDto,
    @Request() req,
  ): Promise<{ message: string }> {
    const listPlaylist = await this.playlistService.detail(req.user.id);
    const exists = listPlaylist.some(
      (playlist) => playlist.id.toString() === id,
    );

    if (exists) {
      await this.playlistService.edit(id, body);
      return { message: `Playlist với id ${id} đã được update thành công` };
    } else {
      return {
        message: `Bạn không phải người tạo playlist nên không có quyền sửa`,
      };
    }
  }
}
