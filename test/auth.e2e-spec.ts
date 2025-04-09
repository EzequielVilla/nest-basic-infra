import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { DbService } from '../src/db/db.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
      }),
    );
    app.setGlobalPrefix('api'); // ADD GLOBAL PREFIX TO ALL TESTS APP
    await app.init();
    dbConnection = moduleFixture.get<DbService>(DbService).getDbHandle();
  });
  beforeEach(async () => {});
  afterEach(async () => {});
  afterAll(async () => {
    await dbConnection.collection('auths').deleteMany({});
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });
  describe('/auth/signup (POST)', () => {
    it('Created', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({ email: 'test@gmail.com', password: 'test123123', name: 'eze' })
        .expect(201);
    });
    it('Email must be unique', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({ email: 'test@gmail.com', password: 'test123123', name: 'eze' })
        .expect(409);
    });
    it("Name can't be empty", () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({ email: 'test2@gmail.com', password: 'test123123' })
        .expect(400);
    });
    it('Password to short', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({ email: 'test3@gmail.com', password: '123', name: 'eze' })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('Success', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com', password: 'test123123' })
        .expect(200);
    });
    it('Email not found', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'another_test_email@gmail.com', password: 'test123123' })
        .expect(404);
    });
    it('Wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com', password: 'wrong_password' })
        .expect(400);
    });
    it("Password can't be empty", () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com', password: '' })
        .expect(401);
    });
  });
});
