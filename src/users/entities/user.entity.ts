import { BaseUUIDEntity } from 'src/entities/base.entity';
import { PlayList } from 'src/playlist/entities/playlist.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Singer } from 'src/singers/entities/singer.entity';
import { Song } from 'src/songs/entities/song.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class User extends BaseUUIDEntity {
  @Column()
  fullName: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  username: string;

  @Column({ unique: true })
  userId: string;

  @Column({
    default:
      'https://res.cloudinary.com/dsi9ercdo/image/upload/v1731207669/oagc6qxabksf7lzv2wy9.jpg',
  })
  avatar: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn()
  role: Role;

  @Column({ type: 'enum', enum: ['SYSTEM', 'GITHUB', 'GOOGLE'] })
  type: 'SYSTEM' | 'GITHUB' | 'GOOGLE';

  @Column({ nullable: true, type: 'text' })
  refreshToken: string;

  @ManyToMany(() => PlayList, { cascade: true })
  @JoinTable()
  listPlaylist: PlayList[];

  @ManyToMany(() => Song, { cascade: true })
  @JoinTable()
  listFavoriteSong: Song[];

  @ManyToOne(() => Singer, { nullable: true })
  @JoinColumn()
  singerId?: Singer;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'datetime', nullable: true })
  deletedAt: Date;
}
