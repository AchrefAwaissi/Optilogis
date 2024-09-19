// auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      mockAuthService.signUp.mockResolvedValue(createUserDto);

      expect(await controller.signUp(createUserDto)).toEqual(createUserDto);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result = { access_token: 'test_token' };
      mockAuthService.signIn.mockResolvedValue(result);

      expect(await controller.signIn(loginUserDto)).toEqual(result);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(loginUserDto.username, loginUserDto.password);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: '1', username: 'testuser' }];
      mockAuthService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { id: '1', username: 'testuser' };
      mockAuthService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockAuthService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const result = { id: '1', username: 'updateduser' };
      mockAuthService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto)).toEqual(result);
      expect(mockAuthService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { id: '1', username: 'testuser' };
      mockAuthService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockAuthService.remove).toHaveBeenCalledWith('1');
    });
  });
});