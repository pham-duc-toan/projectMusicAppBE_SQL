// src/permissions/permissions.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async existPermission(id: string): Promise<boolean> {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    return !!permission;
  }

  async create(createDto: CreatePermissionDto): Promise<Permission> {
    const { pathName, method } = createDto;

    const exists = await this.permissionRepo.findOne({
      where: { pathName, method },
    });

    if (exists) {
      throw new ConflictException(
        `Permission với path ${pathName} và method ${method} đã tồn tại`,
      );
    }

    const permission = this.permissionRepo.create(createDto);
    return this.permissionRepo.save(permission);
  }

  async findAll(options: any): Promise<Permission[]> {
    const {
      filter = {},
      sort = { createdAt: 'DESC' },
      skip = 0,
      limit = 50,
    } = options;

    return this.permissionRepo.find({
      where: filter,
      order: sort,
      skip,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({ where: { id } });

    if (!permission) {
      throw new NotFoundException(`Permission với ID ${id} không tồn tại`);
    }

    return permission;
  }

  async update(
    id: string,
    updateDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const { pathName, method } = updateDto;

    const exists = await this.permissionRepo.findOne({
      where: { pathName, method },
    });

    if (exists && exists.id !== id) {
      throw new ConflictException(
        `Permission với path ${pathName} và method ${method} đã tồn tại`,
      );
    }

    const permission = await this.permissionRepo.preload({
      id,
      ...updateDto,
    });

    if (!permission) {
      throw new NotFoundException(`Permission với ID ${id} không tồn tại`);
    }

    return this.permissionRepo.save(permission);
  }

  async remove(): Promise<void> {
    const result = await this.permissionRepo.delete({});
    if (result.affected === 0) {
      throw new NotFoundException('Chưa xóa được');
    }
  }

  async removeOne(id: string): Promise<void> {
    const result = await this.permissionRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Chưa xóa được');
    }
  }
}
