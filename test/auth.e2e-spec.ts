import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api'); // ADD GLOBAL PREFIX TO ALL TESTS APP
    sequelize = app.get<Sequelize>(Sequelize);
    await app.init();
  });
  beforeEach(async () => {});
  afterEach(async () => {});
  afterAll(async () => {
    await sequelize.sync({ force: true });
    if (app) {
      await app.close();
    }
    if (sequelize) {
      await sequelize.close();
    }
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
        .expect(400);
    });
    it("Name can't be empty", () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({ email: 'test@gmail.com', password: 'test123123' })
        .expect(400);
    });
    it('Password to short', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({ email: 'test@gmail.com', password: '123', name: 'eze' })
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
