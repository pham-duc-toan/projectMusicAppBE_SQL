// src/entities/permission.entity.ts
import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Permission extends BaseUUIDEntity {
  @Column()
  name: string;

  @Column()
  pathName: string;

  @Column()
  method: string;
}
