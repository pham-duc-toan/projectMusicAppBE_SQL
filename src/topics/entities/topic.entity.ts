import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Song } from 'src/songs/entities/song.entity';
import { Column, Entity, OneToMany, Index } from 'typeorm';

@Entity()
export class Topic extends BaseUUIDEntity {
  @Column()
  title: string;

  @Column()
  avatar: string;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Song, (song) => song.topic)
  songs: Song[];
}
