import { BaseUUIDEntity } from 'src/entities/base.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';

@Entity()
export class Role extends BaseUUIDEntity {
  @Column({ unique: true })
  roleName: string;

  @ManyToMany(() => Permission, { cascade: true, eager: true })
  @JoinTable()
  permissions: Permission[];

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
