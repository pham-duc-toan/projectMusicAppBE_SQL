import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSingerDto {
  @ApiProperty({
    example: 'singer_123',
    description: 'ID của ca sĩ cần cập nhật.',
  })
  @IsNotEmpty({ message: 'SingerId không được để trống' })
  @IsString()
  id: string;
}
