// src/singers/dto/create-singer.dto.ts

import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSingerDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['active', 'inactive']) // ✅ validate cho đúng enum
  status: 'active' | 'inactive';
}

// src/singers/dto/update-singer.dto.ts
