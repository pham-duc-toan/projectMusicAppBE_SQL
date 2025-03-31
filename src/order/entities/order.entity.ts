// src/entities/order.entity.ts

import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Entity, Column } from 'typeorm';
// src/entities/order.entity.ts hoặc src/common/enums/order-status.enum.ts
export enum OrderStatus {
  INIT = 'init',
  DONE = 'done',
}

@Entity()
export class Order extends BaseUUIDEntity {
  @Column()
  orderId: string;

  @Column()
  userId: string;

  @Column()
  resultCode: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.INIT })
  status: OrderStatus;

  @Column()
  message: string;

  @Column()
  shortLink: string;
}
