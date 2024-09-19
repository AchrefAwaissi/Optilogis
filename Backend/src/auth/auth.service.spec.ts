import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    mockUserModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = { ...createUserDto, _id: 'some_id' };
  
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockUserModel.create.mockResolvedValue(createdUser);
  
      const result = await service.signUp(createUserDto);
  
      expect(result).toEqual(createdUser);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
    });
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      const user = {
        _id: 'user_id',
        username: 'testuser',
        password: 'hashedPassword',
      };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.signIn('testuser', 'password123');

      expect(result).toEqual({ access_token: 'test_token' });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.signIn('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ _id: '1', username: 'user1' }, { _id: '2', username: 'user2' }];
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { _id: '1', username: 'user1' };
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('1')).rejects.toThrow('User with ID "1" not found');
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const updatedUser = { _id: '1', ...updateUserDto };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('1', updateUserDto, { new: true });
    });

    it('should throw NotFoundException if user not found during update', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('1', { username: 'newname' })).rejects.toThrow('User with ID "1" not found');
    });
  });

  describe('remove', () => {
    it('should remove and return a user', async () => {
      const user = { _id: '1', username: 'user1' };
      mockUserModel.findByIdAndDelete.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.remove('1');

      expect(result).toEqual(user);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found during removal', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('1')).rejects.toThrow('User with ID "1" not found');
    });
  });
});