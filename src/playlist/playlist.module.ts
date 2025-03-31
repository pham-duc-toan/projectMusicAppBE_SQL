import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { SongsModule } from 'src/songs/songs.module';
import { UserModule } from 'src/users/users.module';
import { PlayList } from './entities/playlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayList]),
    forwardRef(() => SongsModule),
    forwardRef(() => UserModule),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
