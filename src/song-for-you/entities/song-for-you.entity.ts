import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Song } from 'src/songs/entities/song.entity';
import { Entity, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class SongForYou extends BaseUUIDEntity {
  @ManyToMany(() => Song, { eager: true })
  @JoinTable()
  listSong: Song[];
}
