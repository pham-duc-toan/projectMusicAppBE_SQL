import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty({ message: 'Thiếu title' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Thiếu topic' })
  @IsString()
  topic: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  audio?: string;

  @IsOptional()
  @IsString()
  lyrics?: string;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsNotEmpty({ message: 'Thiếu status' })
  @IsIn(['active', 'inactive'], {
    message: 'Không đúng định dạng status',
  })
  status: 'active' | 'inactive';

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
