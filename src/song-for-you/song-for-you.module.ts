import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongForYou } from './entities/song-for-you.entity';
import { SongForYouController } from './song-for-you.controller';
import { SongForYouService } from './song-for-you.service';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  imports: [TypeOrmModule.forFeature([SongForYou]), SongsModule],
  controllers: [SongForYouController],
  providers: [SongForYouService],
  exports: [SongForYouService],
})
export class SongForYouModule {}
