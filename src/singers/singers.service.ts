import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateSingerDto } from './dto/update-singer.dto';
import { CreateSingerDto } from './dto/create-singer.dto';
import { convertToSlug } from 'src/helpers/convertToSlug';
import { UserService } from 'src/users/users.service';
import { SongsService } from 'src/songs/songs.service';
import { OrderService } from 'src/order/order.service';
import { Singer } from './entities/singer.entity';

@Injectable()
export class SingersService {
  constructor(
    @InjectRepository(Singer)
    private readonly singerRepo: Repository<Singer>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => SongsService))
    private readonly songService: SongsService,

    private readonly orderService: OrderService,
  ) {}

  async existId(id: string) {
    const exist = await this.singerRepo.findOne({ where: { id } });
    return !!exist;
  }

  async createSinger(data: CreateSingerDto, userId: string) {
    const order = await this.orderService.findOrder({
      userId,
      status: 'init',
      resultCode: '0',
    });

    if (!order) {
      throw new UnauthorizedException(
        'Không thể tạo vì chuyển khoản không hợp lệ!',
      );
    }

    await this.orderService.updateStatus(order.orderId, 'done');
    const singer = this.singerRepo.create({
      ...data,
      slug: convertToSlug(data.fullName),
    });
    const saved = await this.singerRepo.save(singer);
    return this.userService.updateSinger(userId, saved.id);
  }

  async patchSinger(id: string, updateSingerDto: UpdateSingerDto) {
    const singer = await this.singerRepo.preload({ id, ...updateSingerDto });
    if (!singer) {
      throw new NotFoundException('Ca sĩ không tồn tại');
    }
    return this.singerRepo.save(singer);
  }

  async findAll(options: any) {
    const { filter, sort, skip, limit } = options;
    const query = this.singerRepo.createQueryBuilder('singer');

    if (filter?.query) {
      query.andWhere(
        '(LOWER(singer.fullName) LIKE LOWER(:query) OR LOWER(singer.slug) LIKE LOWER(:slug))',
        {
          query: `%${filter.query}%`,
          slug: `%${convertToSlug(filter.query)}%`,
        },
      );
    }

    // Default sort
    const orderByField = sort?.field || 'singer.createdAt';
    const orderByDirection =
      sort?.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    return query
      .orderBy(orderByField, orderByDirection)
      .skip(Number(skip) || 0)
      .take(Number(limit) || 20)
      .getMany();
  }

  async findClient(options: any) {
    const {
      filter = {},
      sort = { field: 'singer.createdAt', order: 'DESC' },
      skip = 0,
      limit = 20,
    } = options;

    const query = this.singerRepo.createQueryBuilder('singer');

    query.where('singer.status = :status AND singer.deleted = false', {
      status: 'active',
    });

    if (filter.query) {
      query.andWhere(
        '(LOWER(singer.fullName) LIKE LOWER(:query) OR LOWER(singer.slug) LIKE LOWER(:slug))',
        {
          query: `%${filter.query}%`,
          slug: `%${convertToSlug(filter.query)}%`,
        },
      );
    }

    const singers = await query
      .orderBy(
        sort.field || 'singer.createdAt',
        sort.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      )
      .skip(Number(skip))
      .take(Number(limit))
      .getMany();

    const enriched = await Promise.all(
      singers.map(async (singer) => {
        const songs = await this.songService.findOfSinger(singer.id);
        return {
          ...singer,
          songsCount: songs.length || 0,
        };
      }),
    );

    return enriched;
  }

  async findOne(id: string) {
    const singer = await this.singerRepo.findOne({ where: { id } });
    if (!singer) {
      throw new NotFoundException('Ca sĩ không tồn tại');
    }
    return singer;
  }

  async findOneClient(slug: string) {
    const singer = await this.singerRepo.findOne({
      where: { slug, status: 'active', deleted: false },
    });
    if (!singer) {
      throw new BadRequestException('Không tồn tại singer này!');
    }
    return singer;
  }

  async deleteSinger(id: string) {
    const singer = await this.singerRepo.findOne({ where: { id } });
    if (!singer) throw new NotFoundException('Ca sĩ không tồn tại');

    await this.userService.deleteSinger(id);
    return this.singerRepo.remove(singer);
  }

  async changeStatus(singerId: string) {
    const singer = await this.singerRepo.findOne({ where: { id: singerId } });
    if (!singer) {
      throw new NotFoundException('Ca sĩ không tồn tại');
    }

    if (singer.status === 'active') {
      singer.status = 'inactive';
      await this.songService.banSongByBanSinger(singerId);
    } else {
      singer.status = 'active';
    }

    return this.singerRepo.save(singer);
  }
}
