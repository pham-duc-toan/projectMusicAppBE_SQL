import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 'ORD12345',
    description: 'Mã đơn hàng được gửi từ client để định danh giao dịch.',
  })
  @IsNotEmpty({ message: 'orderId không được để trống' })
  @IsString()
  orderId: string;

  @ApiProperty({
    example: 'https://short.link/payment',
    description: 'URL shortlink chuyển hướng đến trang thanh toán.',
  })
  @IsNotEmpty({ message: 'shortLink không được để trống' })
  @IsUrl({}, { message: 'shortLink phải là một URL hợp lệ' })
  shortLink: string;
}
