// src/order/order.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createOrder(body: Partial<Order>): Promise<Order> {
    const newOrder = this.orderRepo.create(body);
    return this.orderRepo.save(newOrder);
  }

  // Tìm đơn hàng theo orderId
  async findOrderByOrderId(orderId: string): Promise<Order | null> {
    return this.orderRepo.findOne({ where: { orderId } });
  }

  // Tìm đơn hàng theo filter
  async findOrder(filter: any): Promise<Order | null> {
    return this.orderRepo.findOne({ where: filter });
  }

  // Cập nhật resultCode
  async updateResultCode(
    orderId: string,
    resultCode: string,
    message: string,
  ): Promise<Order | null> {
    const order = await this.orderRepo.findOne({ where: { orderId } });
    if (!order) return null;
    order.resultCode = resultCode.toString();
    order.message = message;
    return this.orderRepo.save(order);
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }

    const order = await this.orderRepo.findOne({
      where: { orderId, status: OrderStatus.INIT },
    });

    if (!order) return null;

    order.status = status as OrderStatus;

    return this.orderRepo.save(order);
  }

  // Lấy đơn hàng theo tháng (dựa vào createdAt)
  async getOrdersByMonth(
    year: number,
    month: number,
    options: any,
  ): Promise<Order[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const {
      filter = {},
      skip = 0,
      limit = 20,
      sort = { createdAt: 'DESC' },
    } = options;

    return this.orderRepo.find({
      where: {
        ...filter,
        createdAt: Between(startDate, endDate),
      },
      skip,
      take: limit,
      order: sort,
    });
  }

  // Lấy đơn hàng theo userId
  async getOrderById(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
