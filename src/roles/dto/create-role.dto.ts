import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Thiếu roleName' })
  @IsString()
  readonly roleName: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true }) // mỗi phần tử là UUID v4
  readonly permissions?: string[];

  @IsBoolean()
  @IsOptional()
  readonly deleted?: boolean;

  @IsOptional()
  readonly deletedAt?: Date | null;
}
