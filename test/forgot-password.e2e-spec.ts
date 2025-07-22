// E2E test cho module forgot-password
// Kiểm tra qua HTTP giống user thật
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ForgotPassword E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should request OTP (giả lập)', async () => {
    const email = 'test@example.com';
    const res1 = await request(app.getHttpServer())
      .post('/forgot-password/request')
      .send({ email })
      .expect(201);
    expect(res1.text).toContain('OTP');
  });

  afterAll(async () => {
    await app.close();
  });
});
