import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class PlayList extends BaseUUIDEntity {
  @ManyToOne(() => User, (user) => user.listPlaylist, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  title: string;

  @ManyToMany(() => Song, { cascade: true })
  @JoinTable()
  listSong: Song[];

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;
}
