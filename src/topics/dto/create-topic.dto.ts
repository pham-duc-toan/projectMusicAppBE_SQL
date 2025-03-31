import { IsString, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  title: string;

  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  description?: string = '';

  @IsIn(['active', 'inactive'], {
    message: 'Trạng thái phải là "active" hoặc "inactive"',
  })
  status: 'active' | 'inactive';

  @IsOptional()
  @IsBoolean()
  deleted?: boolean = false;
}
