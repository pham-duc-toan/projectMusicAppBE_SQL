import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]),
    CloudinaryModule,
    forwardRef(() => SongsModule),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}
