import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Dùng biến môi trường ở mọi nơi trong app
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
})
export class AppModule {}
