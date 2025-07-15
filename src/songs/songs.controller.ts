import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryMultiFileUploadInterceptor } from 'src/interceptors/FileToLinkOnlineCloudinary.interceptor';
import {
  ValidatorFileExistImageAndAudio,
  ValidatorFileTypeImageAndAudio,
} from 'src/interceptors/ValidatorFileExist.interceptor';
import aqp from 'api-query-params';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { SingersService } from 'src/singers/singers.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly singersService: SingersService,
  ) {}

  async checkSinger(req: any) {
    const singerId = req.user.singerId.id;
    const singer = await this.singersService.findOne(singerId);
    if (singer.status === 'inactive') {
      throw new UnauthorizedException('Tài khoản ca sĩ của bạn đang bị khóa.');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ca sĩ tạo bài hát mới' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
    ValidatorFileExistImageAndAudio,
    CloudinaryMultiFileUploadInterceptor,
  )
  async create(@Body() createSongDto: CreateSongDto, @Request() req) {
    await this.checkSinger(req);
    createSongDto.audio = createSongDto.audio[0];
    createSongDto.avatar = createSongDto.avatar[0];
    return this.songsService.create(createSongDto, req.user?.singerId.id || '');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ca sĩ cập nhật bài hát' })
  @ApiParam({ name: 'id', description: 'ID bài hát' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
    ValidatorFileTypeImageAndAudio,
    CloudinaryMultiFileUploadInterceptor,
  )
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDto,
    @Request() req,
  ) {
    await this.checkSinger(req);
    if (updateSongDto.audio) updateSongDto.audio = updateSongDto.audio[0];
    if (updateSongDto.avatar) updateSongDto.avatar = updateSongDto.avatar[0];
    return this.songsService.update(
      id,
      updateSongDto,
      req.user?.singerId.id || '',
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài hát public' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  findAll(@Query() query: any) {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    return this.songsService.findAll({
      filter: e.filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin lấy danh sách toàn bộ bài hát' })
  findFull(@Query() query: any) {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    return this.songsService.findFull({
      filter: e.filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get('singer/:singerId')
  @ApiOperation({ summary: 'Lấy bài hát theo ca sĩ' })
  findSongOfSinger(@Param('singerId') singerId: string) {
    return this.songsService.findOfSinger(singerId);
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Lấy bài hát theo chủ đề' })
  findSongOfTopic(@Param('topicId') topicId: string) {
    return this.songsService.findOfTopic(topicId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết bài hát theo slug' })
  findOne(@Param('slug') slug: string) {
    return this.songsService.findOne(slug);
  }

  @Get('manager/mysongs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ca sĩ lấy danh sách bài hát của mình' })
  manager(@Request() req) {
    if (!req.user.singerId.id)
      throw new UnauthorizedException('Bạn không phải ca sĩ!');
    return this.songsService.findSongBySinger(req.user.singerId.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ca sĩ xóa bài hát của mình' })
  remove(@Param('id') id: string, @Request() req) {
    return this.songsService.remove(id, req.user.singerId.id);
  }

  // FAVORITE SONG
  @Get('favorites/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách bài hát yêu thích của user' })
  favoriteSongs(@Request() req) {
    return this.songsService.getFavoriteSongs(req.user.id);
  }

  @Post('favorites/add/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm bài hát vào danh sách yêu thích' })
  addFavoriteSongs(@Request() req, @Param('id') id: string) {
    return this.songsService.addSongFavorite(req.user.id, id);
  }

  @Delete('favorites/remove/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài hát khỏi danh sách yêu thích' })
  removeFavoriteSongs(@Request() req, @Param('id') id: string) {
    return this.songsService.removeSongFavorite(req.user.id, id);
  }

  @Patch('listen/increase/:id')
  @ApiOperation({ summary: 'Tăng lượt nghe của bài hát' })
  increaseListen(@Param('id') id: string) {
    return this.songsService.increaseListen(id);
  }

  @Patch('status/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin thay đổi trạng thái bài hát' })
  changeStatus(@Param('id') id: string) {
    return this.songsService.changeStatus(id);
  }

  @Patch('test')
  @ApiOperation({ summary: 'API test chức năng nội bộ' })
  test() {
    return this.songsService.test();
  }
}
