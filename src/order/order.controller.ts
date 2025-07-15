import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import aqp from 'api-query-params';
import { Order } from './entities/order.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({ status: 201, description: 'Tạo đơn hàng thành công' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', example: 'ORD12345' },
        shortLink: { type: 'string', example: 'https://short.link/payment' },
      },
      required: ['orderId', 'shortLink'],
    },
  })
  async createOrder(@Body() body: any, @Request() req): Promise<Order> {
    const { orderId, shortLink } = body;

    if (!orderId || !shortLink) {
      throw new BadRequestException('Thiếu thông tin bắt buộc');
    }

    const existingOrder = await this.orderService.findOrderByOrderId(orderId);
    if (existingOrder) {
      throw new ConflictException(
        `Đơn hàng với orderId "${orderId}" đã tồn tại`,
      );
    }

    const bodyNew = {
      userId: req.user.id,
      orderId,
      shortLink,
      resultCode: '1000',
      message:
        'Giao dịch đã được khởi tạo, chờ người dùng xác nhận thanh toán.',
    };
    return this.orderService.createOrder(bodyNew);
  }

  @Patch(':orderId/result-code')
  @ApiOperation({ summary: 'Cập nhật resultCode cho đơn hàng' })
  @ApiParam({ name: 'orderId', description: 'Mã đơn hàng' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        resultCode: { type: 'string', example: '0' },
        message: { type: 'string', example: 'Thanh toán thành công' },
      },
      required: ['resultCode'],
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  async patchResultCode(
    @Param('orderId') orderId: string,
    @Body('resultCode') resultCode: string | number,
    @Body('message') message: string,
  ): Promise<Order> {
    if (!resultCode) {
      throw new BadRequestException('Thiếu resultCode để cập nhật');
    }

    const updatedOrder = await this.orderService.updateResultCode(
      orderId,
      resultCode.toString(),
      message,
    );
    if (!updatedOrder) {
      throw new NotFoundException(
        `Không tìm thấy đơn hàng với orderId "${orderId}"`,
      );
    }

    return updatedOrder;
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng sang done' })
  @ApiParam({ name: 'orderId', description: 'Mã đơn hàng' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'done' },
      },
      required: ['status'],
    },
  })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ): Promise<Order> {
    if (status !== 'done') {
      throw new Error('Status can only be updated to "done"');
    }
    return this.orderService.updateStatus(orderId, status);
  }

  @Get('month/:year/:month')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng theo tháng' })
  @ApiParam({ name: 'year', description: 'Năm', example: 2024 })
  @ApiParam({ name: 'month', description: 'Tháng', example: 6 })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng bản ghi' })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Bỏ qua bao nhiêu bản ghi',
  })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  async getOrdersByMonth(
    @Param('year') year: number,
    @Param('month') month: number,
    @Query() query: any,
  ): Promise<Order[]> {
    const { sort, skip, limit, projection, population, ...e } = aqp(query);
    const filter = e.filter;
    return this.orderService.getOrdersByMonth(year, month, {
      filter,
      sort,
      skip,
      limit,
      projection,
      population,
    });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng của user theo userId' })
  @ApiParam({ name: 'userId', description: 'ID của người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng' })
  async getOrderById(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.getOrderById(userId);
  }

  @Get('check-user/payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Kiểm tra đơn hàng chờ thanh toán của user hiện tại',
  })
  @ApiResponse({ status: 200, description: 'Thông tin đơn hàng nếu có' })
  async checkHopLeUser(@Request() req): Promise<Order> {
    return this.orderService.findOrder({
      userId: req.user.id,
      status: 'init',
      resultCode: '0',
    });
  }
}
