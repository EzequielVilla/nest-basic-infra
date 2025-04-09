// import { Test, TestingModule } from '@nestjs/testing';
// import { User } from 'src/user/entities/user.entity';
// import { UserService } from './../../src/user/user.service';
// import { AuthService } from './Auth.service';
// import { AuthRepository } from './auth.repository';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { FindAuthDto } from './dto/find-auth.dto';
//
// describe('AuthService', () => {
//   let service: AuthService;
//   let userService: Partial<UserService>;
//   let authRepository: Partial<AuthRepository>;
//   const transactionHost: TransactionHost = null;
//   beforeEach(async () => {
//     userService = {
//       create: jest.fn(),
//     };
//     authRepository = {
//       create: jest.fn(),
//       findOneByEmail: jest.fn(),
//       findAll: jest.fn(),
//     };
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: UserService,
//           useValue: userService,
//         },
//         {
//           provide: AuthRepository,
//           useValue: authRepository,
//         },
//       ],
//     }).compile();
//     service = module.get<AuthService>(AuthService);
//   });
//   describe('Create Function', () => {
//     let createAuthDto: CreateAuthDto;
//
//     beforeEach(async () => {
//       createAuthDto = {
//         email: 'test@example.com',
//         password: 'password123',
//         name: 'Test User',
//       };
//     });
//
//     it('Create should call repository and userService correctly', async () => {
//       jest
//         .spyOn(service as any, 'hashPassword')
//         .mockResolvedValue('hashed-password');
//       (authRepository.create as jest.Mock).mockResolvedValue({
//         id: 1,
//         email: 'test@example.com',
//       });
//       (userService.create as jest.Mock).mockResolvedValue(true);
//       await service.create(createAuthDto, transactionHost);
//
//       expect(authRepository.create).toHaveBeenCalledWith(
//         createAuthDto.email,
//         'hashed-password',
//         transactionHost,
//       );
//
//       expect(userService.create).toHaveBeenCalledWith(
//         createAuthDto.name,
//         1,
//         transactionHost,
//       );
//     });
//
//     it('Call repository create should throw error if email is not unique', async () => {
//       (authRepository.create as jest.Mock).mockRejectedValue(
//         new Error('EMAIL_MUST_BE_UNIQUE'),
//       );
//       await expect(
//         service.create(createAuthDto, transactionHost),
//       ).rejects.toThrow('EMAIL_MUST_BE_UNIQUE');
//     });
//
//     it("Call user service and throw an error if user can't be created", async () => {
//       (authRepository.create as jest.Mock).mockResolvedValue({
//         id: 'auth-id',
//         email: createAuthDto.email,
//         password: 'hashed-password',
//       });
//
//       (userService.create as jest.Mock).mockRejectedValue(
//         new Error('ERROR_CREATING_USER'),
//       );
//       await expect(
//         service.create(createAuthDto, transactionHost),
//       ).rejects.toThrow('ERROR_CREATING_USER');
//     });
//   });
//   describe('FindOne Function', () => {
//     let findAuthDto: FindAuthDto;
//
//     beforeEach(async () => {
//       findAuthDto = {
//         email: 'test@example.com',
//         password: 'hashed-password',
//       };
//     });
//     it('Should call repository and userService correctly', async () => {
//       // Mock the findOneByEmail method to return a value
//       (authRepository.findOneByEmail as jest.Mock).mockResolvedValue({
//         id: 1,
//         email: 'test@example.com',
//         password: 'hashed-password',
//       });
//       jest
//         .spyOn(service as any, 'comparePassword')
//         .mockResolvedValue(undefined);
//       await service.findOne(findAuthDto);
//
//       expect(authRepository.findOneByEmail).toHaveBeenCalledWith(
//         findAuthDto.email,
//       );
//     });
//
//     it('Must throw USER_NOT_FOUND', async () => {
//       (authRepository.findOneByEmail as jest.Mock).mockRejectedValue(
//         new Error('USER_NOT_FOUND'),
//       );
//       await expect(service.findOne(findAuthDto)).rejects.toThrow(
//         'USER_NOT_FOUND',
//       );
//     });
//     it('Must throw WRONG_PASSWORD', async () => {
//       (authRepository.findOneByEmail as jest.Mock).mockResolvedValue({
//         id: 1,
//         email: 'test@example.com',
//         password: 'another', // Don't depends on this value.
//       });
//       jest
//         .spyOn(service as any, 'comparePassword')
//         .mockRejectedValue(new Error('WRONG_PASSWORD'));
//       await expect(service.findOne(findAuthDto)).rejects.toThrow(
//         'WRONG_PASSWORD',
//       );
//     });
//     it('Must throw ERROR_RETRIEVING_USER', async () => {
//       (authRepository.findOneByEmail as jest.Mock).mockRejectedValue(
//         new Error('ERROR_RETRIEVING_USER'),
//       );
//       await expect(service.findOne(findAuthDto)).rejects.toThrow(
//         'ERROR_RETRIEVING_USER',
//       );
//     });
//     it('Must return an auth', async () => {
//       // ----- Declare a type dynamically from the repository method. Mock the id value and after that the response
//       type FindOneByEmailReturnType = Awaited<
//         ReturnType<typeof authRepository.findOneByEmail>
//       >;
//       const idValue =
//         'id' as `${string}-${string}-${string}-${string}-${string}`;
//       const mockResponse: FindOneByEmailReturnType = {
//         id: idValue,
//         email: 'test@example.com',
//         password: 'hashed-password',
//         user: {
//           id: idValue,
//           name: 'Test User',
//           role: 'User',
//         } as Partial<User>,
//       } as FindOneByEmailReturnType;
//       // -----
//       (authRepository.findOneByEmail as jest.Mock).mockResolvedValue(
//         mockResponse,
//       );
//       jest
//         .spyOn(service as any, 'comparePassword')
//         .mockResolvedValue(undefined);
//       const result = await service.findOne(findAuthDto);
//       expect(result).toMatchObject({
//         id: idValue,
//         email: 'test@example.com',
//         user: {
//           id: idValue,
//           name: 'Test User',
//         },
//       });
//       expect(result).toHaveProperty('id');
//       expect(result).toHaveProperty('email');
//       expect(result.user).toHaveProperty('id');
//       expect(result.user).toHaveProperty('name');
//     });
//   });
// });
