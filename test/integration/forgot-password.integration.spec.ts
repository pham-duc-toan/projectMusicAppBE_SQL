// Mock nodemailer để không gửi mail thật khi test integration
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: jest.fn() }),
}));
// Integration test cho module forgot-password
// Kiểm tra phối hợp controller, service, repo (dùng sqlite in-memory)
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgotPasswordModule } from '../../src/forgot-password/forgot-password.module';
import { ForgotPassword } from '../../src/forgot-password/entities/forgot-password.entity';
import * as request from 'supertest';

describe('ForgotPassword Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // DÙNG SQLite in-memory cho test
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [ForgotPassword],
          synchronize: true,
          logging: true,
        }),
        ForgotPasswordModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  }, 20000); // tăng timeout lên 20s

  it('should request OTP (mocked mail)', async () => {
    const res1 = await request(app.getHttpServer())
      .post('/forgot-password/request')
      .send({ email: 'a@b.com' })
      .expect(201);
    expect(res1.text).toContain('OTP');
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});
