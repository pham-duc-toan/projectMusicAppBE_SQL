import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { SongToPlayList } from './dto/add-song-to-playlist.dto';
import { UserService } from 'src/users/users.service';
import { SongsService } from 'src/songs/songs.service';
import { PlayList } from './entities/playlist.entity';
import { Song } from 'src/songs/entities/song.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlayList)
    private readonly playlistRepo: Repository<PlayList>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => SongsService))
    private readonly songService: SongsService,
  ) {}

  async findAll(): Promise<PlayList[]> {
    return this.playlistRepo.find({ relations: ['listSong'] });
  }

  async createPlaylist(createDto: CreatePlaylistDto): Promise<PlayList> {
    const user = await this.userService.findUserId(createDto.userId);
    if (!user) throw new BadRequestException('User không tồn tại');

    const playlist = this.playlistRepo.create({
      title: createDto.title,
      user: user,
    });

    const saved = await this.playlistRepo.save(playlist);
    await this.userService.addPlaylistToUser(user.id, saved.id);
    return saved;
  }

  async findOne(id: string) {
    const playlist = await this.playlistRepo.findOne({
      where: { id },
      relations: ['listSong', 'listSong.singer'],
    });
    if (!playlist) throw new NotFoundException('Playlist không tồn tại');
    return playlist;
  }

  async detail(userId: string) {
    const user = await this.userService.findUserId(userId);
    return user.listPlaylist;
  }

  async addSong(dto: SongToPlayList, playlistId: string, userId: string) {
    const user = await this.userService.findUserId(userId);
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: ['listSong', 'user'],
    });

    if (!playlist || playlist.user.id !== user.id) {
      throw new BadRequestException('Playlist không thuộc về người dùng');
    }

    if (!user.listFavoriteSong.some((song) => song.id === dto.idSong)) {
      throw new BadRequestException(
        'Bài hát chưa có trong danh sách yêu thích',
      );
    }

    const song = await this.songService.findOneById(dto.idSong);
    if (!song) throw new BadRequestException('Bài hát không tồn tại');

    if (playlist.listSong.some((s) => s.id === song.id)) {
      throw new BadRequestException('Bài hát đã có trong playlist');
    }

    playlist.listSong.push(song);
    return this.playlistRepo.save(playlist);
  }

  async removeSong(dto: SongToPlayList, playlistId: string, userId: string) {
    const user = await this.userService.findUserId(userId);
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: ['listSong', 'user'],
    });

    if (!playlist || playlist.user.id !== user.id) {
      throw new BadRequestException('Playlist không thuộc về người dùng');
    }

    playlist.listSong = playlist.listSong.filter((s) => s.id !== dto.idSong);
    return this.playlistRepo.save(playlist);
  }

  async remove(id: string, userId: string): Promise<PlayList> {
    const playlist = await this.playlistRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!playlist) throw new NotFoundException('Playlist không tồn tại');

    await this.playlistRepo.remove(playlist);
    await this.userService.removePlaylistFromUser(userId, id);
    return playlist;
  }

  async edit(id: string, body: any) {
    const playlist = await this.playlistRepo.findOne({
      where: { id },
      relations: ['listSong'],
    });
    if (!playlist) {
      throw new NotFoundException('Playlist không tồn tại');
    }

    if (body.listSong) {
      const oldIds = new Set(playlist.listSong.map((s) => s.id));
      const incomingIds = new Set<string>(body.listSong);

      if (
        oldIds.size !== incomingIds.size ||
        ![...incomingIds].every((id) => oldIds.has(id))
      ) {
        throw new BadRequestException('Danh sách bài hát không hợp lệ');
      }

      const songs: Song[] = [];
      for (const id of body.listSong) {
        const song = await this.songService.findOneById(id);
        if (!song) {
          throw new BadRequestException(
            `Bài hát với ID "${id}" không tồn tại.`,
          );
        }
        songs.push(song);
      }
      playlist.listSong = songs;
    }

    if (body.title) playlist.title = body.title;
    return this.playlistRepo.save(playlist);
  }

  async removeByDeleteUser(userId: string) {
    const user = await this.userService.findUserId(userId);
    const playlists = await this.playlistRepo.find({
      where: { user: { id: user.id } },
    });
    return this.playlistRepo.remove(playlists);
  }
}
