import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { convertToSlug } from 'src/helpers/convertToSlug';
import { SingersService } from 'src/singers/singers.service';
import { TopicsService } from 'src/topics/topics.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,

    @Inject(forwardRef(() => SingersService))
    private readonly singerService: SingersService,

    @Inject(forwardRef(() => TopicsService))
    private readonly topicService: TopicsService,

    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
  ) {}

  async create(createSongDto: CreateSongDto, singerId: string) {
    if (!singerId)
      throw new UnauthorizedException('Chỉ ca sĩ mới có thể thực hiện');

    const singer = await this.singerService.findOne(singerId);
    const topic = await this.topicService.findOneById(createSongDto.topic);

    const newSong = this.songRepo.create({
      ...createSongDto,
      singer,
      topic,
      slug: convertToSlug(createSongDto.title),
    });

    return this.songRepo.save(newSong);
  }

  async findAll(options: any): Promise<{ data: Song[]; total: number }> {
    const { filter, sort, skip, limit } = options;

    let where: any[] = [];

    if (filter?.query) {
      const keyword = `%${filter.query}%`;
      where = [
        { status: 'active', deleted: false, lyrics: ILike(keyword) },
        { status: 'active', deleted: false, slug: ILike(keyword) },
        { status: 'active', deleted: false, title: ILike(keyword) },
      ];
    } else {
      where = [{ status: 'active', deleted: false }];
    }

    const [data, total] = await this.songRepo.findAndCount({
      where,
      relations: ['singer', 'topic'],
      order: sort || { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findFull(options: any): Promise<{ data: Song[]; total: number }> {
    const { filter, sort, skip, limit } = options;

    const [data, total] = await this.songRepo.findAndCount({
      relations: ['singer', 'topic'],
      order: sort || { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findOfSinger(singerId: string): Promise<Song[]> {
    return this.songRepo.find({
      where: {
        singer: { id: singerId },
        deleted: false,
        status: 'active',
      },
      relations: ['singer', 'topic'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOfTopic(topicId: string): Promise<Song[]> {
    return this.songRepo.find({
      where: {
        topic: { id: topicId },
        deleted: false,
        status: 'active',
      },
      relations: ['singer', 'topic'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(slug: string): Promise<Song> {
    const song = await this.songRepo.findOne({
      where: { slug },
      relations: ['singer', 'topic'],
    });
    if (!song) throw new NotFoundException('Không tìm thấy bài hát');
    return song;
  }

  async findOneById(id: string): Promise<Song> {
    const song = await this.songRepo.findOne({
      where: { id },
      relations: ['singer', 'topic'],
    });
    if (!song) throw new NotFoundException('Không tìm thấy bài hát');
    return song;
  }

  async update(id: string, updateDto: UpdateSongDto, singerId: string) {
    const song = await this.songRepo.findOne({
      where: { id },
      relations: ['singer'],
    });
    if (!song) throw new NotFoundException('Bài hát không tồn tại');

    if (song.singer.id !== singerId) {
      throw new UnauthorizedException('Không có quyền sửa bài hát này');
    }

    if (updateDto.topic) {
      const topic = await this.topicService.findOneById(updateDto.topic);
      song.topic = topic;
    }

    Object.assign(song, updateDto);
    return this.songRepo.save(song);
  }

  async remove(id: string, singerId: string) {
    const song = await this.songRepo.findOne({
      where: { id },
      relations: ['singer'],
    });
    if (!song) throw new NotFoundException('Bài hát không tồn tại');

    if (song.singer.id !== singerId) {
      throw new UnauthorizedException('Không có quyền xoá bài hát này');
    }

    return this.songRepo.remove(song);
  }

  async findSongBySinger(singerId: string): Promise<Song[]> {
    return this.songRepo.find({
      where: { singer: { id: singerId } },
      relations: ['topic'],
    });
  }

  async getFavoriteSongs(userId: string) {
    return this.usersService.getFavoriteSongs(userId);
  }

  async addSongFavorite(userId: string, songId: string) {
    const song = await this.songRepo.findOne({ where: { id: songId } });
    if (!song) throw new NotFoundException('Bài hát không tồn tại');

    const updatedUser = await this.usersService.addSongFavorite(userId, songId);
    if (updatedUser) {
      song.like += 1;
      await this.songRepo.save(song);
    }

    return updatedUser;
  }

  async removeSongFavorite(userId: string, songId: string) {
    const song = await this.songRepo.findOne({ where: { id: songId } });
    if (!song) throw new NotFoundException('Bài hát không tồn tại');

    const updatedUser = await this.usersService.removeSongFavorite(
      userId,
      songId,
    );
    if (updatedUser) {
      song.like -= 1;
      await this.songRepo.save(song);
    }

    return updatedUser;
  }

  async increaseListen(songId: string) {
    const song = await this.songRepo.findOne({ where: { id: songId } });
    if (!song) throw new NotFoundException('Bài hát không tồn tại');

    song.listen += 1;
    return this.songRepo.save(song);
  }

  async banSongByBanSinger(singerId: string) {
    return this.songRepo.update(
      { singer: { id: singerId } },
      { status: 'inactive' },
    );
  }

  async banSongByBanTopic(topicId: string) {
    return this.songRepo.update(
      { topic: { id: topicId } },
      { status: 'inactive' },
    );
  }

  async changeStatus(songId: string) {
    const song = await this.songRepo.findOne({
      where: { id: songId },
      relations: ['singer', 'topic'],
    });
    if (!song) throw new NotFoundException('Bài hát không tồn tại');

    if (
      song.singer?.status === 'inactive' ||
      song.topic?.status === 'inactive'
    ) {
      throw new UnauthorizedException('Ca sĩ hoặc chủ đề hiện đang bị khoá');
    }

    song.status = song.status === 'active' ? 'inactive' : 'active';
    return this.songRepo.save(song);
  }

  async test() {
    return this.songRepo
      .createQueryBuilder()
      .update(Song)
      .set({ topic: { id: '67500b84409ba47eea8e2ba3' } })
      .where('topicId = :id', { id: '653b3f79884a78f7ecf902e1' })
      .execute();
  }
  // ✅ Tìm 1 bài hát theo ID
  async findById(id: string): Promise<Song> {
    const song = await this.songRepo.findOne({ where: { id } });
    if (!song) throw new NotFoundException('Bài hát không hợp lệ');
    return song;
  }

  // ✅ Tìm danh sách bài hát theo mảng ID
  async findByIds(ids: string[]): Promise<Song[]> {
    return this.songRepo.find({
      where: { id: In(ids) },
    });
  }
}
