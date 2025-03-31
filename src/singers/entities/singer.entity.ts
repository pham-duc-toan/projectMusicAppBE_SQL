import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Song } from 'src/songs/entities/song.entity';
import { Column, Entity, OneToMany, Index } from 'typeorm';

@Entity()
export class Singer extends BaseUUIDEntity {
  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => Song, (song) => song.singer)
  songs: Song[];
}
