import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'newSecurePassword123',
    description: 'Mật khẩu mới mà người dùng muốn thay đổi sang.',
  })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString()
  passNew: string;

  @ApiProperty({
    example: 'oldPassword456',
    description: 'Mật khẩu hiện tại đang sử dụng để xác minh.',
  })
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  @IsString()
  passOld: string;
}
