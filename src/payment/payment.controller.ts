import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrderService } from 'src/order/order.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo yêu cầu thanh toán' })
  @ApiResponse({ status: 201, description: 'Khởi tạo thanh toán thành công' })
  async createPayment() {
    return this.paymentService.createPayment();
  }

  @Post('ipn')
  @ApiOperation({ summary: 'Nhận IPN từ cổng thanh toán (callback kết quả)' })
  @ApiResponse({ status: 200, description: 'Xử lý IPN thành công' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', example: 'ORD123456' },
        resultCode: { type: 'string', example: '0' },
        message: { type: 'string', example: 'Thanh toán thành công' },
      },
      required: ['orderId', 'resultCode', 'message'],
    },
  })
  async handleIpn(@Body() ipnData: any) {
    const { resultCode, orderId, message } = ipnData;

    await this.orderService.updateResultCode(
      orderId,
      resultCode.toString(),
      message,
    );

    if (resultCode == '0') {
      return {
        status: 'success',
        message: 'Thanh toán thành công',
        ipnData,
      };
    } else {
      return {
        status: 'failed',
        message: `Thanh toán thất bại: ${message}`,
        ipnData,
      };
    }
  }

  @Post('transaction-status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái giao dịch' })
  @ApiResponse({ status: 200, description: 'Trả về trạng thái giao dịch' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', example: 'ORD123456' },
      },
      required: ['orderId'],
    },
  })
  async checkStatus(@Body() body: any) {
    return this.paymentService.checkStatus(body);
  }
}
