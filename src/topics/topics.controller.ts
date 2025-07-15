import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ValidatorFileExistImage,
  ValidatorFileTypeImage,
} from 'src/interceptors/ValidatorFileExist.interceptor';
import { CloudinaryFileUploadInterceptor } from 'src/interceptors/FileToLinkOnlineCloudinary.interceptor';
import aqp from 'api-query-params';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { Topic } from './entities/topic.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo chủ đề mới' })
  @ApiResponse({ status: 201, description: 'Tạo chủ đề thành công' })
  @UseInterceptors(
    FileInterceptor('avatar'),
    ValidatorFileExistImage,
    CloudinaryFileUploadInterceptor,
  )
  async create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả chủ đề (admin hoặc backend)' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiResponse({ status: 200, description: 'Danh sách chủ đề' })
  async findAll(@Query() query: any): Promise<Topic[]> {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    return this.topicsService.findAll({
      filter: e.filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get('client')
  @ApiOperation({ summary: 'Lấy danh sách chủ đề hiển thị cho client' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiResponse({ status: 200, description: 'Danh sách chủ đề client' })
  async findClient(@Query() query: any) {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    return this.topicsService.findClient({
      filter: e.filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết chủ đề theo slug' })
  @ApiParam({ name: 'slug', description: 'Slug của chủ đề' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết chủ đề' })
  async findOne(@Param('slug') slug: string): Promise<Topic> {
    return this.topicsService.findOne(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin chủ đề' })
  @ApiParam({ name: 'id', description: 'ID của chủ đề cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @UseInterceptors(
    FileInterceptor('avatar'),
    ValidatorFileTypeImage,
    CloudinaryFileUploadInterceptor,
  )
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<Topic> {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa chủ đề theo ID' })
  @ApiParam({ name: 'id', description: 'ID của chủ đề cần xóa' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.topicsService.remove(id);
  }
}
