import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { join } from 'path';
import { SingersModule } from './singers/singers.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { SongsModule } from './songs/songs.module';
import { TopicsModule } from './topics/topics.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SongForYouModule } from './song-for-you/song-for-you.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { PingController } from './ping/ping.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Dùng biến môi trường ở mọi nơi trong app
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // path to your 'public' folder
    }),
    SingersModule,
    AuthModule,
    UserModule,
    PermissionsModule,
    RolesModule,
    SongsModule,
    TopicsModule,
    PlaylistModule,
    SongForYouModule,
    ForgotPasswordModule,
    PaymentModule,
    OrderModule,
  ],
  controllers: [PingController],
})
export class AppModule {}
