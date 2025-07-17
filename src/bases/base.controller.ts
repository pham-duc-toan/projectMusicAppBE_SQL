// bases/base.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import aqp from 'api-query-params';

export abstract class BaseController<T, CreateDto, UpdateDto> {
  protected abstract service: any;

  @Post()
  @ApiOperation({ summary: 'Tạo mới' }) // chung
  async create(@Body() dto: CreateDto): Promise<T> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async findAll(@Query() query: any): Promise<T[]> {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    return this.service.findAll({
      filter: e.filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết' })
  @ApiParam({ name: 'id', description: 'ID của tài nguyên' }) // chung
  async findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật' })
  @ApiParam({ name: 'id', description: 'ID của tài nguyên' }) // chung
  async update(@Param('id') id: string, @Body() dto: UpdateDto): Promise<T> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá' })
  @ApiParam({ name: 'id', description: 'ID của tài nguyên' }) // chung
  async removeOne(@Param('id') id: string): Promise<void> {
    return this.service.removeOne(id);
  }
}
