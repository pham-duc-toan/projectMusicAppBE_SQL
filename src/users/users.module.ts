import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { UserService } from './users.service';
import { UserController } from './users.controller';

import { RolesModule } from 'src/roles/roles.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SingersModule } from 'src/singers/singers.module';
import { PlaylistModule } from 'src/playlist/playlist.module';
import { Role } from 'src/roles/entities/role.entity';
import { PlayList } from 'src/playlist/entities/playlist.entity';
import { Singer } from 'src/singers/entities/singer.entity';
import { Song } from 'src/songs/entities/song.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, PlayList, Song, Singer]),
    forwardRef(() => RolesModule),
    CloudinaryModule,
    forwardRef(() => SingersModule),
    forwardRef(() => PlaylistModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
