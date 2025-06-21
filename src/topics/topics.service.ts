import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere, Like } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { convertToSlug } from 'src/helpers/convertToSlug';
import { SongsService } from 'src/songs/songs.service';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicRepo: Repository<Topic>,

    @Inject(forwardRef(() => SongsService))
    private readonly songService: SongsService,
  ) {}

  async existId(id: string): Promise<boolean> {
    const topic = await this.topicRepo.findOne({ where: { id } });
    return !!topic;
  }

  async create(createDto: CreateTopicDto): Promise<Topic> {
    const newTopic = this.topicRepo.create({
      ...createDto,
      slug: convertToSlug(createDto.title),
    });
    return this.topicRepo.save(newTopic);
  }

  async findAll(options: any): Promise<Topic[]> {
    const {
      filter = {},
      sort = { createdAt: 'DESC' },
      skip = 0,
      limit = 20,
    } = options;

    const whereClause = [];

    if (filter.title) {
      whereClause.push({
        title: Like(`%${filter.title.toLowerCase()}%`),
      });
    }

    if (filter.slug) {
      whereClause.push({
        slug: Like(`%${convertToSlug(filter.slug).toLowerCase()}%`),
      });
    }

    return this.topicRepo.find({
      where: whereClause.length > 0 ? whereClause : {},
      order: sort,
      skip: Number(skip),
      take: Number(limit),
    });
  }

  async findClient(options: any) {
    const {
      filter = {},
      sort = { createdAt: 'DESC' },
      skip = 0,
      limit = 20,
    } = options;

    const whereClause: FindOptionsWhere<any>[] = [];

    if (filter.title) {
      whereClause.push({
        title: Like(`%${filter.title.toLowerCase()}%`),
        status: 'active',
        deleted: false,
      });
    }

    if (filter.slug) {
      whereClause.push({
        slug: Like(`%${convertToSlug(filter.slug).toLowerCase()}%`),
        status: 'active',
        deleted: false,
      });
    }

    // Nếu không có title hoặc slug → fallback về tìm tất cả "active + !deleted"
    const where =
      whereClause.length > 0
        ? whereClause
        : [{ status: 'active', deleted: false }];

    const topics = await this.topicRepo.find({
      where,
      order: sort,
      skip: Number(skip),
      take: Number(limit),
    });

    const enrichedTopics = await Promise.all(
      topics.map(async (topic) => {
        const songs = await this.songService.findOfTopic(topic.id);
        return {
          ...topic,
          songsCount: songs.length,
        };
      }),
    );

    return enrichedTopics;
  }

  async findOne(slug: string): Promise<Topic> {
    const topic = await this.topicRepo.findOne({ where: { slug } });
    if (!topic) {
      throw new NotFoundException(`Topic với slug "${slug}" không tồn tại`);
    }
    return topic;
  }
  async findOneById(id: string): Promise<Topic> {
    const topic = await this.topicRepo.findOne({ where: { id } });
    if (!topic) {
      throw new NotFoundException(`Topic với id "${id}" không tồn tại`);
    }
    return topic;
  }
  async update(id: string, updateDto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.topicRepo.findOne({ where: { id } });
    if (!topic) {
      throw new NotFoundException(`Topic với ID ${id} không tồn tại`);
    }

    const updated = this.topicRepo.merge(topic, updateDto);

    if (updateDto.status === 'inactive') {
      await this.songService.banSongByBanTopic(id);
    }

    return this.topicRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const topic = await this.topicRepo.findOne({ where: { id } });
    if (!topic) {
      throw new NotFoundException(`Topic với ID ${id} không tồn tại`);
    }
    await this.topicRepo.remove(topic);
  }
}
