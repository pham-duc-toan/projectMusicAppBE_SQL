import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongForYou } from './entities/song-for-you.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/entities/song.entity';
import { SongsService } from 'src/songs/songs.service';

@Injectable()
export class SongForYouService {
  constructor(
    @InjectRepository(SongForYou)
    private readonly songForYouRepo: Repository<SongForYou>,

    private readonly songService: SongsService,
  ) {}

  // Lấy danh sách bài hát đề xuất đầy đủ
  async getRecommendedSongs(): Promise<SongForYou> {
    const [record] = await this.songForYouRepo.find({
      relations: ['listSong', 'listSong.singer', 'listSong.topic'],
    });

    if (!record)
      throw new NotFoundException('Chưa có danh sách bài hát đề xuất');

    return record;
  }

  // Lấy danh sách bài hát đề xuất (client) - lọc theo điều kiện
  async getClientRecommendSong(options: any): Promise<SongForYou> {
    const { limit = 10 } = options;

    const [record] = await this.songForYouRepo.find({
      relations: ['listSong', 'listSong.singer', 'listSong.topic'],
    });

    if (!record || !record.listSong) return record;

    record.listSong = record.listSong
      .filter((song) => song.status === 'active' && song.deleted === false)
      .slice(0, limit);

    return record;
  }

  // Lấy danh sách ID bài hát (không populate)
  async getSongs(): Promise<SongForYou> {
    const [record] = await this.songForYouRepo.find({
      relations: ['listSong'],
    });
    if (!record) throw new NotFoundException('Danh sách đề xuất không tồn tại');
    return record;
  }

  // Thêm bài hát vào danh sách
  async addSongToList(songId: string): Promise<SongForYou> {
    const song = await this.songService.findById(songId);
    if (!song) throw new BadRequestException('Bài hát không hợp lệ');

    let [record] = await this.songForYouRepo.find({
      relations: ['listSong'],
    });

    if (!record) {
      record = this.songForYouRepo.create({ listSong: [song] });
    } else {
      const exists = record.listSong.some((s) => s.id === song.id);
      if (exists)
        throw new BadRequestException('Bài hát đã có trong danh sách');

      record.listSong.push(song);
    }

    return this.songForYouRepo.save(record);
  }

  // Xoá bài hát khỏi danh sách
  async removeSongFromList(songId: string): Promise<SongForYou> {
    const [record] = await this.songForYouRepo.find({
      relations: ['listSong'],
    });

    if (!record)
      throw new NotFoundException('Không tìm thấy danh sách đề xuất');

    record.listSong = record.listSong.filter((s) => s.id !== songId);

    return this.songForYouRepo.save(record);
  }

  // Cập nhật thứ tự danh sách
  async updateSongs(listSong: string[]): Promise<SongForYou> {
    const songs = await this.songService.findByIds(listSong);
    if (songs.length !== listSong.length) {
      throw new BadRequestException('Một số bài hát không hợp lệ');
    }

    let [record] = await this.songForYouRepo.find({
      relations: ['listSong'],
    });

    if (!record) {
      record = this.songForYouRepo.create({ listSong: songs });
    } else {
      record.listSong = songs;
    }

    return this.songForYouRepo.save(record);
  }
}
