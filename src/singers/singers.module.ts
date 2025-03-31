import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SingersService } from './singers.service';
import { SingersController } from './singers.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/users/users.module';
import { SongsModule } from 'src/songs/songs.module';
import { OrderModule } from 'src/order/order.module';
import { Singer } from './entities/singer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Singer]),
    CloudinaryModule,
    OrderModule,
    forwardRef(() => UserModule),
    forwardRef(() => SongsModule),
  ],
  controllers: [SingersController],
  providers: [SingersService],
  exports: [SingersService],
})
export class SingersModule {}
