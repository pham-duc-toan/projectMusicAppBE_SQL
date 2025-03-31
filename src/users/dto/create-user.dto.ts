import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

// Enum định nghĩa trực tiếp
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
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'UserId không được để trống' })
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message: 'UserId chỉ được chứa chữ, số và dấu _',
  })
  userId: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string;

  @IsNotEmpty({ message: 'Type không được để trống' })
  @IsEnum(UserType, { message: 'Type không hợp lệ' })
  type: UserType;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Trạng thái không hợp lệ' })
  status?: UserStatus;

  @IsOptional()
  @IsString()
  avatar?: string;
}
