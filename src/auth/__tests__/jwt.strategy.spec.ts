// Unit test cho JwtStrategy
// Giải thích: Test validate trả về user với permissions và listPrivate đúng, mock các service phụ thuộc.

import { JwtStrategy } from '../passport/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '../../roles/roles.service';
import { PermissionsService } from '../../permissions/permissions.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;
  let rolesService: jest.Mocked<RolesService>;
  let permissionsService: jest.Mocked<PermissionsService>;

  beforeEach(() => {
    configService = { get: jest.fn().mockReturnValue('secret') } as any;
    rolesService = { findOne: jest.fn() } as any;
    permissionsService = { findAll: jest.fn() } as any;
    strategy = new JwtStrategy(configService, rolesService, permissionsService);
  });

  it('should return user with permissions and listPrivate', async () => {
    const payload = { id: 1, role: { id: 2 } } as any;
    const roleInfo = {
      id: '2',
      roleName: 'user',
      deleted: false,
      deletedAt: null,
      permissions: [
        {
          id: '1',
          name: 'Test Permission',
          method: 'GET',
          pathName: '/test',
          deleted: false,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          generateId: jest.fn(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      generateId: jest.fn(), // Mock thêm hàm generateId để đúng interface Role
    };
    const listPrivate = [
      {
        id: '1',
        name: 'Test Permission',
        method: 'GET',
        pathName: '/test',
        deleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        generateId: jest.fn(),
      },
    ];
    rolesService.findOne.mockResolvedValue(roleInfo);
    permissionsService.findAll.mockResolvedValue(listPrivate);
    const result = await strategy.validate(payload);
    expect(result).toEqual({
      ...payload,
      permissions: roleInfo.permissions,
      listPrivate,
    });
    expect(rolesService.findOne).toHaveBeenCalledWith(2);
    expect(permissionsService.findAll).toHaveBeenCalledWith({});
  });
});
