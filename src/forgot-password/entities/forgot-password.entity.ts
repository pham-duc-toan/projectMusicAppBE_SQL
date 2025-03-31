// src/forgot-password/forgot-password.entity.ts

import { BaseUUIDEntity } from 'src/entities/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class ForgotPassword extends BaseUUIDEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  otp: string;

  // Dùng cho logic hết hạn sau 3 phút
  @Column()
  expiredAt: Date;
}
