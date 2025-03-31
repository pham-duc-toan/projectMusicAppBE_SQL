// src/forgot-password/forgot-password.module.ts
import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/users.module';
import { ForgotPassword } from './entities/forgot-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForgotPassword]), UserModule],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
