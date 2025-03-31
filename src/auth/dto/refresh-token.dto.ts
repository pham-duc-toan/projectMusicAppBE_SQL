import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'refresh_token khong duoc de trong' })
  refreshToken: string;
}
