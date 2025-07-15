import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Patch,
  Query,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { SingersService } from './singers.service';
import { ResponeMessage } from 'src/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryFileUploadInterceptor } from 'src/interceptors/FileToLinkOnlineCloudinary.interceptor';
import { UpdateSingerDto } from './dto/update-singer.dto';
import {
  ValidatorFileExistImage,
  ValidatorFileTypeImage,
} from 'src/interceptors/ValidatorFileExist.interceptor';
import { CreateSingerDto } from './dto/create-singer.dto';
import aqp from 'api-query-params';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { Singer } from './entities/singer.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Singers')
@Controller('singers')
export class SingersController {
  constructor(private readonly singersService: SingersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo ca sĩ mới' })
  @ApiResponse({ status: 201, description: 'Tạo ca sĩ thành công' })
  @UseInterceptors(
    FileInterceptor('avatar'),
    ValidatorFileExistImage,
    CloudinaryFileUploadInterceptor,
  )
  async createSinger(@Body() createSingerDto: CreateSingerDto, @Request() req) {
    if (req.user.singerId) {
      throw new UnauthorizedException('Bạn đã quản lý ca sĩ rồi!');
    }
    return this.singersService.createSinger(createSingerDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách ca sĩ (admin hoặc backend)' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiResponse({ status: 200, description: 'Danh sách ca sĩ' })
  @ResponeMessage('Find all')
  async findAll(@Query() query: any): Promise<Singer[]> {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    const filter = e.filter;
    return this.singersService.findAll({
      filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get('public')
  @ApiOperation({ summary: 'Lấy danh sách ca sĩ cho client hiển thị' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiResponse({ status: 200, description: 'Danh sách ca sĩ public' })
  async findClient(@Query() query: any) {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    const filter = e.filter;
    return this.singersService.findClient({
      filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin ca sĩ' })
  @ApiParam({ name: 'id', description: 'ID của ca sĩ' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @UseInterceptors(
    FileInterceptor('avatar'),
    ValidatorFileTypeImage,
    CloudinaryFileUploadInterceptor,
  )
  async patchSinger(
    @Param('id') id: string,
    @Request() req,
    @Body() updateSingerDto: UpdateSingerDto,
  ) {
    if (req.user.singerId.id !== id) {
      throw new UnauthorizedException('Bạn không phải quản lý ca sĩ này!');
    }
    return this.singersService.patchSinger(id, updateSingerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết ca sĩ theo ID' })
  @ApiParam({ name: 'id', description: 'ID của ca sĩ' })
  @ApiResponse({ status: 200, description: 'Thông tin ca sĩ' })
  async findOne(@Param('id') id: string) {
    return this.singersService.findOne(id);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết ca sĩ public theo slug' })
  @ApiParam({ name: 'slug', description: 'Slug của ca sĩ' })
  @ApiResponse({ status: 200, description: 'Thông tin ca sĩ cho client' })
  async findOneClient(@Param('slug') slug: string) {
    return this.singersService.findOneClient(slug);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa ca sĩ (admin)' })
  @ApiParam({ name: 'id', description: 'ID của ca sĩ' })
  @ApiResponse({ status: 200, description: 'Xóa ca sĩ thành công' })
  async deleteSinger(@Param('id') id: string) {
    return this.singersService.deleteSinger(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thay đổi trạng thái ca sĩ (admin)' })
  @ApiParam({ name: 'id', description: 'ID của ca sĩ' })
  @ApiResponse({ status: 200, description: 'Thay đổi trạng thái thành công' })
  async changeStatus(@Param('id') id: string) {
    return await this.singersService.changeStatus(id);
  }
}
