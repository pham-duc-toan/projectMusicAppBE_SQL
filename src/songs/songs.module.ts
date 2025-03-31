import { forwardRef, Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SingersModule } from 'src/singers/singers.module';
import { TopicsModule } from 'src/topics/topics.module';
import { UserModule } from 'src/users/users.module';
import { Song } from './entities/song.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    CloudinaryModule,
    forwardRef(() => SingersModule),
    forwardRef(() => TopicsModule),
    forwardRef(() => UserModule),
  ],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}
