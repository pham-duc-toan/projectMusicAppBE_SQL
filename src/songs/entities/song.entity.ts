import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Singer } from 'src/singers/entities/singer.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity()
export class Song extends BaseUUIDEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Singer, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'singerId' })
  singer: Singer;

  @ManyToOne(() => Topic, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0 })
  listen: number;

  @Column({ nullable: true, type: 'text' })
  lyrics: string;

  @Column()
  audio: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;
}
