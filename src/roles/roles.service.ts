import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserService } from 'src/users/users.service';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    private readonly permissionService: PermissionsService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async existPermission(id: string) {
    return this.permissionService.existPermission(id);
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepo.findOne({
      where: { roleName: createRoleDto.roleName },
    });
    if (existingRole) {
      throw new ConflictException(
        `Role "${createRoleDto.roleName}" đã tồn tại`,
      );
    }

    let permissions: Permission[] = [];
    if (createRoleDto.permissions?.length > 0) {
      for (const permissionId of createRoleDto.permissions) {
        const isValid = await this.existPermission(permissionId);
        if (!isValid) {
          throw new BadRequestException(
            `Permission ${permissionId} không hợp lệ`,
          );
        }
        const permission = await this.permissionService.findOne(permissionId);
        if (permission) permissions.push(permission);
      }
    }

    const newRole = this.roleRepo.create({
      roleName: createRoleDto.roleName,
      permissions,
    });

    return this.roleRepo.save(newRole);
  }

  async findAll(options: any): Promise<Role[]> {
    const { filter, sort, skip, limit } = options;
    return this.roleRepo.find({
      where: filter,
      relations: ['permissions'],
      order: sort || { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async findFull(): Promise<Role[]> {
    return this.roleRepo.find({
      relations: ['permissions'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role với ID ${id} không tồn tại`);
    }
    return role;
  }

  async findRoleClient(): Promise<Role> {
    return this.roleRepo.findOne({ where: { roleName: 'User' } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    console.log(updateRoleDto);

    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role với ID ${id} không tồn tại`);
    }

    if (updateRoleDto.roleName) {
      const existingRole = await this.roleRepo.findOne({
        where: { roleName: updateRoleDto.roleName },
      });
      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(
          `Role "${updateRoleDto.roleName}" đã tồn tại`,
        );
      }
      role.roleName = updateRoleDto.roleName;
    }

    if (updateRoleDto.permissions?.length > 0) {
      const permissions: Permission[] = [];
      for (const permissionId of updateRoleDto.permissions) {
        const isValid = await this.existPermission(permissionId);
        if (!isValid) {
          throw new BadRequestException(
            `Permission ${permissionId} không hợp lệ`,
          );
        }
        const permission = await this.permissionService.findOne(permissionId);
        if (permission) permissions.push(permission);
      }
      role.permissions = permissions;
    }

    return this.roleRepo.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role với ID ${id} không tồn tại`);
    }

    if (role.roleName === 'User' || role.roleName === 'Admin') {
      throw new BadRequestException('Không thể xóa Role mặc định!');
    }

    const roleClient = await this.roleRepo.findOne({
      where: { roleName: 'User' },
    });

    await this.userService.removeRole(id, roleClient.id);
    await this.roleRepo.remove(role);
  }
}
