import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'abc@abc.com', description: 'Tên đăng nhập' })
  @IsString()
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string;

  @ApiProperty({ example: 'aaa', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty({ message: 'Password không được để trống' })
  password: string;
}
