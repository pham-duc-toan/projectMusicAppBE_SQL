import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserType {
  SYSTEM = 'SYSTEM',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email đăng nhập của người dùng.',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  username: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Mật khẩu tài khoản.',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @ApiProperty({
    example: 'user_123',
    description: 'Mã định danh nội bộ của người dùng. Chỉ gồm chữ, số và _',
  })
  @IsNotEmpty({ message: 'UserId không được để trống' })
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message: 'UserId chỉ được chứa chữ, số và dấu _',
  })
  userId: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ tên đầy đủ của người dùng.',
  })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string;

  @ApiProperty({
    example: 'SYSTEM',
    enum: UserType,
    description: 'Loại người dùng: hệ thống, Google, hoặc GitHub.',
  })
  @IsNotEmpty({ message: 'Type không được để trống' })
  @IsEnum(UserType, { message: 'Type không hợp lệ' })
  type: UserType;

  @ApiPropertyOptional({
    example: 'active',
    enum: UserStatus,
    description: 'Trạng thái người dùng (tuỳ chọn).',
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Trạng thái không hợp lệ' })
  status?: UserStatus;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.png',
    description: 'Ảnh đại diện của người dùng (URL).',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
