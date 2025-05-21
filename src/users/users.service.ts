import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { changePassword } from './dto/change-password.dto';

import { RolesService } from 'src/roles/roles.service';
import { SingersService } from 'src/singers/singers.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { Role } from 'src/roles/entities/role.entity';
import { PlayList } from 'src/playlist/entities/playlist.entity';
import { Song } from 'src/songs/entities/song.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(PlayList) private playlistRepo: Repository<PlayList>,
    @InjectRepository(Song) private songRepo: Repository<Song>,

    @Inject(forwardRef(() => RolesService))
    private readonly roleService: RolesService,
    @Inject(forwardRef(() => SingersService))
    private readonly singerService: SingersService,
    @Inject(forwardRef(() => PlaylistService))
    private readonly playlistService: PlaylistService,
  ) {}

  getHashPassWord = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = this.getHashPassWord(createUserDto.password);

    const existUserId = await this.userRepo.findOneBy({
      userId: createUserDto.userId,
    });
    const existUser = await this.userRepo.findOneBy({
      username: createUserDto.username,
      type: createUserDto.type,
    });

    const roleClient = await this.roleService.findRoleClient();

    if (!existUser && !existUserId) {
      const newUser = this.userRepo.create({
        ...createUserDto,
        role: roleClient,
      });
      return this.userRepo.save(newUser);
    }

    throw new BadRequestException(`Đã tồn tại tài khoản!`);
  }

  async findAll(options: any) {
    const { filter, sort, skip, limit } = options;

    const [data, total] = await this.userRepo.findAndCount({
      where: filter,
      order: sort,
      skip,
      take: limit,
      relations: ['role'], // có thể thêm các relations khác nếu cần
    });

    // Loại bỏ mật khẩu trước khi trả về (nếu cần)
    const dataWithoutPassword = data.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return { data: dataWithoutPassword, total };
  }

  async addPlaylistToUser(userId: string, playlistId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['listPlaylist'],
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    // Đảm bảo không thêm trùng
    if (user.listPlaylist.some((p) => p.id === playlistId)) {
      return user;
    }

    const playlist = await this.playlistRepo.findOneBy({ id: playlistId });
    if (!playlist) {
      throw new NotFoundException('Playlist không tồn tại');
    }

    user.listPlaylist.push(playlist);
    return await this.userRepo.save(user);
  }

  async findUserId(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'listPlaylist',
        'listPlaylist.listSong',
        'listPlaylist.listSong.singer',
        'listFavoriteSong',
        'listFavoriteSong.singer',
        'listFavoriteSong.topic',
      ],
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }

  async profileUser(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'role',
        'role.permissions',
        'listPlaylist',
        'listPlaylist.listSong',
        'listPlaylist.listSong.singer',
        'listPlaylist.listSong.topic',
        'listFavoriteSong',
        'listFavoriteSong.singer',
        'listFavoriteSong.topic',
        'singerId',
      ],
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }

  async checkUserLogin(username: string, pass: string) {
    const user = await this.userRepo.findOne({
      where: { username, type: 'SYSTEM' },
      relations: ['role', 'singerId'],
    });

    if (!user) {
      throw new BadRequestException('Sai tài khoản hoặc mật khẩu');
    }

    if (user.status === 'inactive') {
      throw new BadRequestException('Tài khoản của bạn đã bị khóa');
    }

    if (user.deleted) {
      throw new BadRequestException('Tài khoản của bạn đã bị xóa');
    }

    const isMatch = compareSync(pass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Sai tài khoản hoặc mật khẩu');
    }

    const { password, ...result } = user;
    return result;
  }

  async deleteOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['singerId'],
    });

    if (!user) throw new NotFoundException('User không tồn tại');

    if (user.singerId) {
      await this.singerService.deleteSinger(user.singerId.id);
    }

    await this.playlistService.removeByDeleteUser(id);
    return await this.userRepo.delete(id);
  }

  async updateTokenRefresh(refresh_token: string, id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new BadRequestException('Sai định dạng id');

    user.refreshToken = refresh_token;
    return await this.userRepo.save(user);
  }

  async findByTokenRefresh(refresh_token: string) {
    return await this.userRepo.findOne({
      where: { refreshToken: refresh_token },
      relations: ['role', 'singerId'],
    });
  }

  //xóa playlist
  async removePlaylistFromUser(userId: string, playlistId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['listPlaylist'],
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    user.listPlaylist = user.listPlaylist.filter((p) => p.id !== playlistId);
    await this.userRepo.save(user);

    return { message: 'Xóa playlist thành công', user };
  }

  async updateSinger(userId: string, singerId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['singerId'],
    });

    if (!user) throw new NotFoundException('User không tồn tại');
    if (user.singerId) {
      throw new BadRequestException('User đã được đăng ký singer');
    }

    const singerManaged = await this.userRepo.findOne({
      where: { singerId: { id: singerId } },
    });

    if (singerManaged) {
      throw new BadRequestException('Singer đã được quản lý');
    }

    user.singerId = { id: singerId } as any;
    await this.userRepo.save(user);

    return { message: 'Cập nhật singerId thành công', user };
  }

  async updateProfile(userId: string, updateUser: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    const updated = this.userRepo.merge(user, updateUser);
    return await this.userRepo.save(updated);
  }

  // xoa singerId khi singerId xoa
  async deleteSinger(singerId: string) {
    const user = await this.userRepo.findOne({
      where: { singerId: { id: singerId } },
      relations: ['singerId'],
    });

    if (!user) return null;

    user.singerId = null;
    return await this.userRepo.save(user);
  }

  //----FAVORITE SONGS--------
  async getFavoriteSongs(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['listFavoriteSong'],
    });

    if (!user) throw new NotFoundException('User không tồn tại');

    return user.listFavoriteSong;
  }

  async addSongFavorite(userId: string, songId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['listFavoriteSong'],
    });
    if (!user) throw new NotFoundException('User không tồn tại');

    if (user.listFavoriteSong.some((s) => s.id === songId)) {
      throw new BadRequestException('Bài hát đã có trong danh sách yêu thích');
    }

    const song = await this.songRepo.findOne({ where: { id: songId } });
    if (!song) throw new BadRequestException('Bài hát không tồn tại');

    user.listFavoriteSong.push(song);
    return this.userRepo.save(user);
  }

  async removeSongFavorite(userId: string, songId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['listFavoriteSong'],
    });
    if (!user) throw new NotFoundException('User không tồn tại');

    const index = user.listFavoriteSong.findIndex((s) => s.id === songId);
    if (index === -1) {
      throw new BadRequestException(
        'Bài hát không có trong danh sách yêu thích',
      );
    }

    user.listFavoriteSong.splice(index, 1);
    return this.userRepo.save(user);
  }

  async updateStatus(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.status = user.status === 'active' ? 'inactive' : 'active';
    return this.userRepo.save(user);
  }

  async updateRole(userId: string, roleId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role không tồn tại');

    user.role = role;
    return this.userRepo.save(user);
  }

  //user thay doi khi xoa role
  async removeRole(roleId: string, roleNew: string) {
    const newRole = await this.roleRepo.findOne({ where: { id: roleNew } });
    if (!newRole) throw new BadRequestException('Role mới không tồn tại');

    await this.userRepo
      .createQueryBuilder()
      .update()
      .set({ role: newRole })
      .where('roleId = :roleId', { roleId })
      .execute();
  }

  async test(): Promise<void> {
    await this.userRepo
      .createQueryBuilder()
      .update()
      .set({ status: 'active' })
      .execute();
  }

  //user đổi mật khẩu
  async changePassword(username: string, dataPass: changePassword) {
    const { passOld, passNew } = dataPass;

    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại!');

    if (!compareSync(passOld, user.password)) {
      throw new BadRequestException('Sai mật khẩu cũ!');
    }

    user.password = this.getHashPassWord(passNew);
    await this.userRepo.save(user);

    return { message: 'Đổi mật khẩu thành công!' };
  }

  //user cap nhat mat khau moi
  async changePasswordByOTP(username: string, passNew: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new BadRequestException('Người dùng không tồn tại!');

    user.password = this.getHashPassWord(passNew);
    await this.userRepo.save(user);

    return { message: 'Đổi mật khẩu thành công!' };
  }

  //GOOGLE OAUTH
  //tim user bang email type google
  async findOneByEmailGoogle(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        username: email,
        type: 'GOOGLE',
      },
      relations: ['role', 'singerId'],
    });
  }

  //tim user bang email type google
  async createOAuthGoogle(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
  }): Promise<User> {
    const roleClient = await this.roleService.findRoleClient();

    const newUser = this.userRepo.create({
      username: googleUser.email,
      fullName: `${googleUser.firstName} ${googleUser.lastName}`,
      avatar: googleUser.avatar,
      userId: `GG_${googleUser.email}`,
      type: 'GOOGLE',
      role: roleClient,
    });

    return this.userRepo.save(newUser);
  }
}
