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
    updatePremiumStatus: jest.fn(),
    findAllPremiumUsers: jest.fn(),
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
    it('should create a new user with isPremium set to false', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const mockFile = {
        path: 'path/to/photo.jpg',
      } as Express.Multer.File;
      
      const expectedUser = {...createUserDto, profilePhotoPath: 'path/to/photo.jpg', isPremium: false};
      mockAuthService.signUp.mockResolvedValue(expectedUser);

      expect(await controller.signUp(createUserDto, mockFile)).toEqual(expectedUser);
      expect(mockAuthService.signUp).toHaveBeenCalledWith({...createUserDto, profilePhotoPath: 'path/to/photo.jpg'});
    });

    it('should create a new user without profile photo', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      
      const expectedUser = {...createUserDto, isPremium: false};
      mockAuthService.signUp.mockResolvedValue(expectedUser);

      expect(await controller.signUp(createUserDto, undefined)).toEqual(expectedUser);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result = { access_token: 'test_token', userId: '1' };
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
      const mockFile = {
        path: 'path/to/new_photo.jpg',
      } as Express.Multer.File;

      mockAuthService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto, mockFile)).toEqual(result);
      expect(mockAuthService.update).toHaveBeenCalledWith('1', {...updateUserDto, profilePhotoPath: 'path/to/new_photo.jpg'});
    });

    it('should update a user without changing profile photo', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const result = { id: '1', username: 'updateduser' };

      mockAuthService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto, undefined)).toEqual(result);
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

  describe('updateCurrentUser', () => {
    it('should update the current user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const result = { id: '1', username: 'updateduser' };
      const mockFile = {
        path: 'path/to/new_photo.jpg',
      } as Express.Multer.File;
      const mockRequest = { user: { userId: '1' } };

      mockAuthService.update.mockResolvedValue(result);

      expect(await controller.updateCurrentUser(mockRequest, updateUserDto, mockFile)).toEqual(result);
      expect(mockAuthService.update).toHaveBeenCalledWith('1', {...updateUserDto, profilePhotoPath: 'path/to/new_photo.jpg'});
    });
  });

  describe('getCurrentUser', () => {
    it('should get the current user', async () => {
      const result = { id: '1', username: 'testuser' };
      const mockRequest = { user: { userId: '1' } };
      mockAuthService.findOne.mockResolvedValue(result);

      expect(await controller.getCurrentUser(mockRequest)).toEqual(result);
      expect(mockAuthService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updatePremiumStatus', () => {
    it('should update premium status of a user', async () => {
      const userId = '1';
      const isPremium = true;
      const result = { id: userId, username: 'testuser', isPremium };
      mockAuthService.updatePremiumStatus.mockResolvedValue(result);

      expect(await controller.updatePremiumStatus(userId, isPremium)).toEqual(result);
      expect(mockAuthService.updatePremiumStatus).toHaveBeenCalledWith(userId, isPremium);
    });
  });

  describe('findAllPremiumUsers', () => {
    it('should return an array of premium users', async () => {
      const result = [
        { id: '1', username: 'user1', isPremium: true },
        { id: '2', username: 'user2', isPremium: true }
      ];
      mockAuthService.findAllPremiumUsers.mockResolvedValue(result);

      expect(await controller.findAllPremiumUsers()).toEqual(result);
      expect(mockAuthService.findAllPremiumUsers).toHaveBeenCalled();
    });
  });
});